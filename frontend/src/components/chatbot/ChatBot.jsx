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

  const send = (text) => {
    const userMsg = text || msg;
    if (!userMsg.trim()) return;
    setMsg("");
    setChat((prev) => [...prev, { type: "user", text: userMsg }]);
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        {
          type: "ai",
          text: "The chatbot backend is not connected yet. Once integrated, I'll answer questions about your detection results.",
          pending: true,
        },
      ]);
    }, 400);
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
        <span className="chatbot-icon">♻</span>
        <div>
          <div className="chatbot-title">Waste Assistant</div>
          <div className="chatbot-subtitle">
            Ask about detection results or recycling
          </div>
        </div>
        <div className="chatbot-status pending">Backend pending</div>
      </div>

      <div className="chat-messages">
        {chat.map((c, i) => (
          <div key={i} className={`chat-bubble ${c.type}`}>
            <div className="bubble-content">{c.text}</div>
            {c.sources && (
              <div className="bubble-sources">
                Sources: {c.sources.join(", ")}
              </div>
            )}
            {c.pending && (
              <div className="bubble-pending">
                ⚙ POST /api/chat/ — not connected
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