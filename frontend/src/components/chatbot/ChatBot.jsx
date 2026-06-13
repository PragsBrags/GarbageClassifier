import { useState, useRef, useEffect } from "react";

const SAMPLE_QUESTIONS = [
  "How many metal items were detected?",
  "Which garbage type appeared most?",
  "What does confidence score mean?",
  "Is plastic recyclable?",
];

export default function ChatBot() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([
    {
      type: "ai",
      text: "Hi! I'm your waste analysis assistant. Ask me about detection results or general recycling questions.",
    },
  ]);

  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const send = async (text) => {
    const userMsg = text || msg;
    if (!userMsg.trim()) return;

    setMsg("");

    
    setChat((prev) => [...prev, { type: "user", text: userMsg }]);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMsg,
          job_id: null, 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      
      setChat((prev) => [
        ...prev,
        {
          type: "ai",
          text: data.answer,
          job_id: data.job_id,
          scope: data.scope,
        },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          type: "ai",
          text: "Error: unable to connect to backend.",
          pending: true,
        },
      ]);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-header">
        <span className="chatbot-icon"></span>

        <div>
          <div className="chatbot-title">Waste Assistant</div>
          <div className="chatbot-subtitle">
            Ask about detection results or recycling
          </div>
        </div>

        <div className="chatbot-status pending"></div>
      </div>

      <div className="chat-messages">
        {chat.map((c, i) => (
          <div key={i} className={`chat-bubble ${c.type}`}>
            <div className="bubble-content">{c.text}</div>

            {c.scope && (
              <div className="bubble-sources">
                Scope: {c.scope}
              </div>
            )}

            {c.pending && (
              <div className="bubble-pending">
                ⚠ Backend connection issue
              </div>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="chat-suggestions">
        {SAMPLE_QUESTIONS.map((q) => (
          <button
            key={q}
            className="suggestion-btn"
            onClick={() => send(q)}
            type="button"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about waste, recycling, or detection results..."
        />

        <button className="chat-send" onClick={() => send()} type="button">
          Send
        </button>
      </div>
    </div>
  );
}
