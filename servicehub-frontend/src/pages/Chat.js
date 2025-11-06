// src/pages/Chat.js
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const PROVIDER_TEMPLATES = [
  "Hi! Thanks for reaching out. I’m available today — what time works for you?",
  "Could you share your exact location and preferred time window?",
  "Pricing depends on scope. I can visit and confirm a final quote.",
  "I’ll bring all tools. Please ensure access and power are available.",
  "Thanks! I can arrive within 60–90 minutes. Shall I proceed to book?",
];

export default function Chat() {
  const { otherUserId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);

  const chatId = `u:${user?._id}__with__${otherUserId}`;

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/chat/${encodeURIComponent(chatId)}`);
      setMessages(res.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const t = setInterval(fetchMessages, 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = async (overrideText) => {
    const payload = (overrideText ?? text).trim();
    if (!payload) return;
    try {
      const res = await API.post("/chat", { chatId, text: payload });
      setMessages((prev) => [...prev, res.data]);
      if (overrideText === undefined) setText("");
    } catch {
      // optionally toast
    }
  };

  const isProvider = user?.role === "provider";

  return (
    <div className="section">
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          className="chat-header"
          style={{ padding: 12, borderBottom: "1px solid var(--line)" }}
        >
          <strong>Chat</strong>
          <div className="muted" style={{ fontSize: 14 }}>
            Conversation ID: {chatId}
          </div>
        </div>

        {isProvider && (
          <div
            className="quick-templates"
            style={{
              padding: 12,
              borderBottom: "1px solid var(--line)",
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {PROVIDER_TEMPLATES.map((t, i) => (
              <button
                key={i}
                className="btn-ghost btn-sm"
                onClick={() => send(t)}
                title="Send quick reply"
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <div
          ref={listRef}
          className="message-list"
          style={{ height: 420, overflow: "auto", padding: 12 }}
        >
          {loading ? (
            <div className="muted">Loading messages…</div>
          ) : messages.length === 0 ? (
            <div className="muted">No messages yet.</div>
          ) : (
            messages.map((m) => {
              const mine =
                m.sender === user?._id || m.sender?._id === user?._id;
              return (
                <div
                  key={m._id || m.createdAt}
                  className={mine ? "chat-bubble-self" : "chat-bubble-other"}
                  style={{
                    maxWidth: 520,
                    borderRadius: 14,
                    padding: "8px 12px",
                    margin: "8px 0",
                    marginLeft: mine ? "auto" : 0,
                    background: mine ? "var(--brand)" : "var(--surface-soft)",
                    color: mine ? "#fff" : "var(--ink)",
                  }}
                >
                  {m.text}
                </div>
              );
            })
          )}
        </div>

        <div
          className="chat-input"
          style={{
            display: "flex",
            gap: 8,
            padding: 12,
            borderTop: "1px solid var(--line)",
          }}
        >
          <input
            className="input"
            placeholder="Type a message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="btn-primary" onClick={() => send()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
