import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css"; // Make sure this is installed
import { useNavigate } from "react-router-dom";


const ChatWindow = ({ currentUserId, chatPartnerId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [location, setLocation] = useState("")
    const navigate = useNavigate();

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`https://Muita.pythonanywhere.com/api/messages?user1=${currentUserId}&user2=${chatPartnerId}`);
            setMessages(response.data);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await axios.post("https://Muita.pythonanywhere.com/api/messages", {
                sender_id: currentUserId,
                receiver_id: chatPartnerId,
                content: newMessage,
            });
            setNewMessage("");
            fetchMessages();
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };
    const handleCreateTask = () => {
            navigate('/loc');
        };
    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [currentUserId, chatPartnerId]);

    return (
        <div className="chat-window border rounded p-3 mt-4 shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="d-flex align-items-center mb-3">
                <i className="bi bi-chat-dots-fill me-2 text-primary fs-4"></i>
                <h5 className="mb-0">Chat with {chatPartnerId}</h5>
            </div>

            <div className="messages mb-3 bg-light rounded p-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {messages.map(msg => (
                    <div key={msg.id} className={`mb-2 ${msg.sender_id === currentUserId ? "text-end" : "text-start"}`}>
                        <div className={`d-inline-block px-3 py-2 rounded ${msg.sender_id === currentUserId ? "bg-primary text-white" : "bg-white border"}`}>
                            <strong>{msg.sender_id === currentUserId ? "You" : "Them"}:</strong> {msg.content}
                        </div>
                        <div>
                            <small className="text-muted">{new Date(msg.timestamp).toLocaleTimeString()}</small>
                        </div>
                    </div>
                ))}
            </div>

            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="btn btn-primary" onClick={sendMessage}>
                    <i className="bi bi-send"></i>
                </button>
            </div>

            <div>
                 <button className="btn btn-success mb-4" type="button" onClick={handleCreateTask}>Share Location with</button>

                
            </div>
        </div>
    );
};

export default ChatWindow;
