import { useState, useEffect } from "react";
import axios from "axios";

const ChatWindow = ({ currentUserId, chatPartnerId }) => {
    const [messages, setMessages] = useState([]); // Stores all the messages
    const [newMessage, setNewMessage] = useState(""); // Stores the current message typed by the user

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`https://Muita.pythonanywhere.com/api/messages?user1=${currentUserId}&user2=${chatPartnerId}`);
            setMessages(response.data);// Updates the messages state with the response from the server
        } catch (err) {
            console.error("Error fetching messages:", err); // If an error occurs, log it

        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;// Don't send empty messages
        try {
            await axios.post("https://Muita.pythonanywhere.com/api/messages", {
                sender_id: currentUserId,
                receiver_id: chatPartnerId,
                content: newMessage,
            });
            setNewMessage("");// Clear the input field
            fetchMessages(); // Refresh chat
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    useEffect(() => {
        fetchMessages();// Fetch initial messages
        const interval = setInterval(fetchMessages, 3000); // Poll the server every 3 seconds to check for new messages
        return () => clearInterval(interval);// Clean up the interval when the component is unmounted
    }, []);

    return (
        <div className="chat-window border rounded p-3">
            <div className="messages mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {messages.map(msg => (
                    <div key={msg.id} className={msg.sender_id === currentUserId ? "text-end" : "text-start"}>
                        <p className="mb-1"><strong>{msg.sender_id === currentUserId ? "You" : "Them"}:</strong> {msg.content}</p>
                        <small className="text-muted">{new Date(msg.timestamp).toLocaleTimeString()}</small>
                    </div>
                    // If the message's sender_id matches the currentUserId, it displays the message aligned to the right (text-end class) and labels it as "You".

                    // If the sender_id doesn't match the currentUserId, it displays the message aligned to the left (text-start) and labels it as "Them".

                    // The timestamp is formatted into a human-readable time using toLocaleTimeString().
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
                <button className="btn btn-primary" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;
