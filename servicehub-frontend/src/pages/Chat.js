import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/UI";

const Chat = () => {
  const { otherUserId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const listRef = useRef(null);

  const chatId = useMemo(() => {
    if (!user || !otherUserId) return "";
    const a = String(user._id),
      b = String(otherUserId);
    return a < b ? `${a}_${b}` : `${b}_${a}`;
  }, [user, otherUserId]);

  const load = async () => {
    if (!chatId) return;
    try {
      const res = await API.get(`/chat/${chatId}`);
      setMessages(res.data || []);
      setTimeout(() => {
        if (listRef.current)
          listRef.current.scrollTop = listRef.current.scrollHeight;
      }, 0);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t); /* eslint-disable */
  }, [chatId]);

  const send = async () => {
    if (!text.trim()) return;
    try {
      await API.post("/chat", { chatId, text });
      setText("");
      load();
    } catch {
      alert("Failed to send");
    }
  };

  if (!user)
    return <section className="section">Please login to use chat.</section>;

  return (
    <section
      className="section"
      style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}
    >
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Conversation</h3>
        <div className="muted" style={{ fontSize: 13 }}>
          with user: {otherUserId}
        </div>
      </div>

      <div
        className="card"
        style={{
          display: "grid",
          gridTemplateRows: "1fr auto",
          minHeight: "60vh",
          padding: 0,
        }}
      >
        <div ref={listRef} style={{ overflowY: "auto", padding: "18px" }}>
          {messages.length === 0 ? (
            <div className="muted">No messages yet. Say hi!</div>
          ) : (
            messages.map((m) => {
              const self = String(m.sender?._id) === String(user._id);
              return (
                <div
                  key={m._id}
                  style={{
                    maxWidth: "70%",
                    padding: "10px 12px",
                    borderRadius: 22,
                    marginBottom: 8,
                    wordBreak: "break-word",
                    background: self ? "var(--brand)" : "var(--surface-soft)",
                    color: self ? "#fff" : "var(--ink)",
                    marginLeft: self ? "auto" : 0,
                    animation: "pop var(--normal) var(--ease)",
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 3 }}>
                    {m.sender?.name || m.sender?._id}
                  </div>
                  <div>{m.text}</div>
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4 }}>
                    {new Date(m.createdAt).toLocaleString()}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div
          style={{
            borderTop: "1px solid var(--line)",
            padding: "10px",
            display: "flex",
            gap: 10,
          }}
        >
          <Input
            placeholder="Type a message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <Button variant="primary" onClick={send}>
            Send
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Chat;
