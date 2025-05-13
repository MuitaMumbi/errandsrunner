// components/ConversationList.js
import { useEffect, useState } from "react";
import axios from "axios";

const ConversationList = ({ currentUserId, onSelectChat }) => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get(`https://Muita.pythonanywhere.com/api/conversations?user_id=${currentUserId}`);
                setConversations(response.data);
            } catch (err) {
                console.error("Failed to fetch conversations", err);
            }
        };

        fetchConversations();
    }, [currentUserId]);

    return (
        <div>
            <h5>Your Conversations</h5>
            {conversations.length === 0 && <p>No conversations yet.</p>}
            {conversations.map((conv) => (
                <div key={conv.id} className="conversation-item border p-2 mb-2" onClick={() => onSelectChat(conv.id)} style={{ cursor: "pointer" }}>
                    <strong>User #{conv.id}</strong>
                </div>
            ))}
        </div>
    );
};

export default ConversationList;
