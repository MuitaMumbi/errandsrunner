from flask import *
import pymysql
import pymysql.cursors
import os
from flask_cors import CORS
from config import Config
from extensions import db
from models import Message, User
from flask_login import login_user
from werkzeug.utils import secure_filename
from flask import jsonify, request
from flask import request, jsonify,g
import pymysql
import jwt
import datetime
from functools import wraps

app = Flask(__name__) #entry point of the app
app.config["UPLOAD_FOLDER"] = os.path.join(os.getcwd(), "static/images")
app.config.from_object(Config)
db.init_app(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
# sign up route
# Flask-Login setup
# login_manager = LoginManager(app)
# login_manager.login_view = 'signin'
# login_manager.init_app(app)
# @login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

SECRET_KEY = "bdda33b2fcfe12ecd5ce7031e7af49f5130f95ef9e00248f2667ec44003bb912"

# create token
def generate_access_token(user):
    payload = {
        'user_id': user['user_id'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),  # Token expires in 1 hour
        'iat': datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

import jwt
from flask import request, jsonify, g
from functools import wraps

SECRET_KEY = 'your-secret-key'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(user_id, *args, **kwargs)  # Inject user_id into route
    return decorated


@app.route("/api/signup", methods=["POST"])
def signup():
    username = request.form["username"]
    email = request.form["email"]
    phone = request.form["phone"]
    password = request.form["password"]
    role = request.form["role"]
    if role not in ["Runner", "Creator"]:
        return jsonify({"message": "Invalid role. Choose either 'Runner' or 'Creator'."}), 400



    try:
        # Create db connection
        connection = pymysql.connect(host="Muita.mysql.pythonanywhere-services.com", user="Muita", password="Mumbi1234", database="Muita$Mumbi")
        cursor = connection.cursor()

        # SQL query to insert new user into the users table
        sql = "INSERT INTO users(username, email, phone, password, role) VALUES (%s, %s, %s, %s, %s)"
        data = (username, email, phone, password, role)

        # Execute the query
        cursor.execute(sql, data)

        # Save the changes
        connection.commit()

        # Send a response with the user's role to determine the appropriate dashboard
        response = {
            "message": "Thank you for joining!",
            "user": {
                "username": username,
                "role": role  # Send the role back so frontend can handle redirection
            }
        }

        # You can handle the response and direct to different dashboards based on the role
        return jsonify(response)

    except pymysql.MySQLError as e:
        # Rollback in case of an error
        connection.rollback()
        return jsonify({"Error": f"Failed to create user: {str(e)}"}), 500
    finally:
        # Close the connection
        connection.close()

# login route

@app.route("/api/signin", methods=["POST"])
def signin():
    username = request.form["username"]
    password = request.form["password"]
    role = request.form["role"]

    # Validate role input
    if role not in ["Runner", "Creator"]:
        return jsonify({"message": "Invalid role. Please provide a valid role."}), 400

    # Database connection
    connection = None
    try:
        connection = pymysql.connect(
            host="Muita.mysql.pythonanywhere-services.com", user="Muita", password="Mumbi1234", database="Muita$Mumbi"
        )
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # SQL Query to check user credentials
        sql = "SELECT user_id, username, email, phone, role, password FROM users WHERE username = %s AND role = %s"
        data = (username, role)

        cursor.execute(sql, data)

        if cursor.rowcount == 0:
            return jsonify({"message": "Login failed. Invalid credentials."}), 401
        else:
            user = cursor.fetchone()

            # Check if the password matches
            # if not (user['password'], password):
            #     return jsonify({"message": "Login failed. Invalid credentials."}), 401

            # Remove password before sending response
            # user.pop('password', None)
            # user["is_active"] = True;
            # user = User(user)
            # login_user(user)
            token = generate_access_token(user)
            # Send back user data and role
            # user_dict = user.to_dict()
            user["access_token"] = token

            return jsonify({
                "message": "Login Successful",
                "user": user,
                "role": user['role'],  # Send role back to the frontend
            })
    except pymysql.MySQLError as e:
        return jsonify({"message": "Database error occurred.", "error": str(e)}), 500

    finally:
        if connection:
            connection.close()



# add
@app.route("/api/adderrand", methods=["POST"])
@token_required
def add_errand(user_id):
    creator_id = user_id  # This now comes from the token
    required_fields = ["errand_name", "errand_desc", "errand_cost", "status"]

    if not all(field in request.form for field in required_fields):
        return jsonify({"error": "Missing required form fields"}), 400
    if "errand_photo" not in request.files:
        return jsonify({"error": "Missing photo"}), 400

    try:
        errand_name = request.form["errand_name"]
        errand_desc = request.form["errand_desc"]
        errand_cost = request.form["errand_cost"]
        status = request.form["status"]

        photo = request.files.get("errand_photo")
        if photo and photo.filename != "":
            photo_name = secure_filename(photo.filename)
            photo_path = os.path.join(app.config["UPLOAD_FOLDER"], photo_name)
            photo.save(photo_path)
        else:
            photo_name = "default.jpg"

        connection = pymysql.connect(
            host="Muita.mysql.pythonanywhere-services.com",
            user="Muita",
            password="Mumbi1234",
            database="Muita$Mumbi"
        )

        cursor = connection.cursor()
        sql = """
            INSERT INTO errands(errand_name, errand_desc, errand_cost, creator_id, status, errand_photo)
            VALUES (%s, %s, %s, %s, %s, %s)
        """

        # You must also insert `accepted_by` since it's marked as NOT NULL
        data = (
            errand_name, errand_desc, errand_cost,
            creator_id,  # accepted_by defaults to creator for now
            status, photo_name
        )

        cursor.execute(sql, data)
        connection.commit()

        return jsonify({"success": "Errand created successfully"}), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        if 'connection' in locals():
            connection.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        if 'connection' in locals():
            connection.close()

#get errands
@app.route("/api/geterrands")
def get_errands():

    connection = pymysql.connect(
        host="Muita.mysql.pythonanywhere-services.com",
        user="Muita",
        password="Mumbi1234",
        database="Muita$Mumbi"
    )
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # Fetch errands that are either available (not accepted yet) or accepted by the current runner
    sql = """
        SELECT e.*, u.username AS creator_name, u.email AS creator_email, u.phone AS creator_phone
        FROM errands e
        JOIN users u ON e.creator_id = u.user_id
    #     WHERE
    #         (e.accepted_by IS NULL OR e.accepted_by = '')  -- Show errands that are available (not accepted)
    #         OR (e.accepted_by = %s)                        -- Show errands accepted by the logged-in runner
    # """
    cursor.execute(sql)
    errands = cursor.fetchall()

    connection.close()
    return jsonify(errands)


#get user errands
@app.route("/api/usererrands")
def user_errands():
    runner_id = request.args.get("runner_id")

    if not runner_id:
        return jsonify({"error": "runner_id is required"}), 400

    connection = pymysql.connect(
        host="Muita.mysql.pythonanywhere-services.com",
        user="Muita",
        password="Mumbi1234",
        database="Muita$Mumbi"
    )
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # Fetch errands that are either available (not accepted yet) or accepted by the current runner
    sql = """
        SELECT e.*, u.username AS creator_name, u.email AS creator_email, u.phone AS creator_phone
        FROM errands e
        JOIN users u ON e.creator_id = u.user_id
        WHERE
            (e.accepted_by IS NULL OR e.accepted_by = '')  -- Show errands that are available (not accepted)
            OR (e.accepted_by = %s)                        -- Show errands accepted by the logged-in runner
    """
    cursor.execute(sql, (runner_id,))
    errands = cursor.fetchall()

    connection.close()
    return jsonify(errands)




@app.route("/api/accepttask", methods=["PUT"])
def accept_task():
    errand_id = request.json.get("errand_id")
    runner_id = request.json.get("runner_id")

    if not errand_id or not runner_id:
        return jsonify({"error": "errand_id and runner_id are required"}), 400

    connection = pymysql.connect(
        host="Muita.mysql.pythonanywhere-services.com",
        user="Muita",
        password="Mumbi1234",
        database="Muita$Mumbi"
    )
    cursor = connection.cursor()

    # Check if the task is available (i.e., not accepted yet)
    cursor.execute("SELECT * FROM errands WHERE errand_id = %s AND (accepted_by IS NULL OR accepted_by = '')", (errand_id,))
    errand = cursor.fetchone()

    if not errand:
        return jsonify({"error": "This task has already been accepted or is not available."}), 400

    # Update the task to set the accepted_by field to the runner's user_id and status to accepted
    sql = "UPDATE errands SET accepted_by = %s, status = 'accepted' WHERE errand_id = %s"
    cursor.execute(sql, (runner_id, errand_id))
    connection.commit()

    connection.close()
    return jsonify({"message": "Task accepted!"})




# in chat communication


# @app.before_first_request


@app.route("/api/messages", methods=["GET"])
def get_messages():
    user1 = request.args.get("user1")
    user2 = request.args.get("user2")
    if not user1 or not user2:
        return jsonify({"error": "Missing user1 or user2"}), 400

    messages = Message.query.filter(
        ((Message.sender_id == user1) & (Message.receiver_id == user2)) |
        ((Message.sender_id == user2) & (Message.receiver_id == user1))
    ).order_by(Message.timestamp.asc()).all()

    return jsonify([m.serialize() for m in messages])

@app.route("/api/messages", methods=["POST"])
def send_message():
    data = request.json
    sender_id = data.get("sender_id")
    receiver_id = data.get("receiver_id")
    content = data.get("content")

    if not all([sender_id, receiver_id, content]):
        return jsonify({"error": "Missing fields"}), 400

    message = Message(sender_id=sender_id, receiver_id=receiver_id, content=content)
    db.session.add(message)
    db.session.commit()

    return jsonify(message.serialize()), 201



@app.route('/api/updatetaskstatus', methods=['PUT'])
def update_task_status():
    data = request.get_json()
    errand_id = data.get('errand_id')
    new_status = data.get('status')
    runner_id = data.get('runner_id')

    if errand_id not in tasks:
        return jsonify({"error": "Task not found"}), 404

    task = tasks[errand_id]

    # Check if the task has been accepted by a runner
    if task["accepted_by"] is None:
        return jsonify({"error": "Task must be accepted first"}), 400

    if task["accepted_by"] != runner_id:
        return jsonify({"error": "You are not the assigned runner"}), 403

    # Update the status
    task["status"] = new_status
    if new_status == "in_progress":
        task["runner_id"] = runner_id  # Associate the task with the runner
    elif new_status == "completed":
        task["runner_id"] = None  # Task completed, remove runner assignment

    return jsonify({"message": "Task status updated", "task": task}), 200


# if __name__ == "__main__":
#     with app.app_context():
#         db.create_all()
#     app.run(debug=True)