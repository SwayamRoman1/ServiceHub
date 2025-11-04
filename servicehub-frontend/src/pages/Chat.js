import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import "./Chat.css";

const Chat = () => {
  const { theme } = useTheme();
  const [conversations, setConversations] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await API.get("/chat");
        setConversations(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, []);

  const selectChat = async (conv) => {
    setSelectedChat(conv);
    try {
      const res = await API.get(`/chat/${conv._id}`);
      setCurrentMessages(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    try {
      await API.post(`/chat/${selectedChat._id}`, { message: newMsg });
      setCurrentMessages((prev) => [...prev, { message: newMsg, self: true }]);
      setNewMsg("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`chat-page ${theme}`}>
      <div className="conversations">
        <h3>Conversations</h3>
        {conversations.map((conv) => (
          <div
            key={conv._id}
            className={`conv-item ${
              selectedChat?._id === conv._id ? "active" : ""
            }`}
            onClick={() => selectChat(conv)}
          >
            {conv.user?.name || "User"}
          </div>
        ))}
      </div>

      <div className="messages">
        <h3>Messages</h3>
        <div className="message-list">
          {currentMessages.map((msg, idx) => (
            <div key={idx} className={`msg ${msg.self ? "self" : "other"}`}>
              {msg.message}
            </div>
          ))}
        </div>
        {selectedChat && (
          <div className="msg-input">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
