from flask import *
import pymysql
import pymysql.cursors
import os
from flask_cors import CORS
app = Flask(__name__) #entry point of the app
CORS(app)

# sign up route
@app.route("/api/signup", methods=["POST"])
def signup():
    username = request.form["username"]
    email = request.form["email"]
    phone = request.form["phone"]
    password = request.form["password"]
    role = request.form["role"]

    # create db connection
    connection = pymysql.connect(host="localhost", user="root", password="Mumbi1234", database="Mumbi")

    # initialize db connection using .cursor()
    cursor = connection.cursor()

    # sql query
    sql = "insert into users(username, email, phone, password, role) values (%s, %s, %s, %s, %s)"

    data = (username, email, phone, password, role)

    # execute the query
    cursor.execute(sql, data)

    # save the changes
    connection.commit()

    return jsonify({"Success": "Thank you for joining"})

# login route
@app.route("/api/signin", methods=["POST"])
def signin():
    username = request.form["username"]
    password = request.form["password"]
    role = request.form["role"]

    connection = pymysql.connect(host="localhost", user="root", password="Mumbi1234", database="Mumbi")
    cursor=connection.cursor(pymysql.cursors.DictCursor)

    sql = "select user_id, username, email, phone, role from users where username = %s and password = %s and role = %s"
    data = (username, password, role)

    cursor.execute(sql, data)
    
    if cursor.rowcount == 0:
        return jsonify({"message" : "Login failed. Invalid credentials"})
    else:
        user = cursor.fetchone()
        return jsonify ({
            "message" : "Login Successful",
            "user" : user
        })
@app.route("/api/adderrand", methods=["POST"])
def add_errand():
    # Check for required fields
    required_fields = ["errand_name", "errand_desc", "errand_cost", "creator_id", "status"]
    if not all(field in request.form for field in required_fields):
        return jsonify({"error": "Missing required form fields"}), 400

    photo_name = "default.jpg"  # or some default image
    if 'errand_photo' in request.files and request.files['errand_photo'].filename != '':
        photo = request.files['errand_photo']
        photo_name = photo.filename
        photo_path = os.path.join(app.config["UPLOAD_FOLDER"], photo_name)
        photo.save(photo_path)

    try:
        # Get form data
        errand_name = request.form["errand_name"]
        errand_desc = request.form["errand_desc"]
        errand_cost = request.form["errand_cost"]
        creator_id = request.form["creator_id"]
        status = request.form["status"]
        photo = request.files["errand_photo"]

        # Validate photo
        if photo.filename == '':
            return jsonify({"error": "No selected photo"}), 400

        # Secure filename and save
        photo_name = photo.filename
        photo_path = os.path.join(app.config["UPLOAD_FOLDER"], photo_name)
        photo.save(photo_path)

        # Database connection
        connection = pymysql.connect(
            host="localhost",
            user="root",
            password="Mumbi1234",
            database="Mumbi"
        )
        
        with connection.cursor() as cursor:
            # Include accepted_by (set to creator_id if not provided)
            accepted_by = request.form.get("accepted_by", creator_id)
            
            sql = """INSERT INTO errands(
                errand_name, errand_desc, errand_cost, 
                creator_id, accepted_by, status, errand_photo
            ) VALUES(%s, %s, %s, %s, %s, %s, %s)"""
            
            data = (
                errand_name, errand_desc, errand_cost,
                creator_id, accepted_by, status, photo_name
            )
            
            cursor.execute(sql, data)
            connection.commit()
            
        return jsonify({"success": "Errand created successfully"}), 201
        
    except Exception as e:
        if 'connection' in locals():
            connection.rollback()
        return jsonify({"error": str(e)}), 500
        
    finally:
        if 'connection' in locals():
            connection.close()

# task runner gets errands
@app.route("/api/geterrands")
def get_errands():
    connection = pymysql.connect(host="localhost", user="root", password="Mumbi1234", database="Mumbi")
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    sql= "select * from errands"

    cursor.execute(sql)

    errands = cursor.fetchall()
    return jsonify(errands)

# task is accepted







app.run(debug=True)