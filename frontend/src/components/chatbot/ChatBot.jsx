import { useState } from "react";

export default function ChatBot() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  const send = () => {
    if (!msg) return;

    const userMsg = msg;
    setMsg("");

    setChat((prev) => [...prev, { type: "user", text: userMsg }]);

    // simulate RAG thinking
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        {
          type: "ai",
          text:
            "Based on retrieved knowledge (RAG): Plastic waste can be recycled using sorting, cleaning, and reprocessing methods.",
          sources: ["Waste DB", "Recycling Guide"]
        }
      ]);
    }, 600);
  };

  return (
    <div>

      <h2>RAG Assistant</h2>

      <div className="chatBox">

        {chat.map((c, i) => (
          <div key={i} className={c.type}>
            <div>{c.text}</div>

            {c.sources && (
              <div style={{ fontSize: "10px", marginTop: "4px", color: "#ea580c" }}>
                Sources: {c.sources.join(", ")}
              </div>
            )}
          </div>
        ))}

      </div>

      <div className="inputRow">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Ask about waste, recycling, detection..."
        />
        <button onClick={send}>Send</button>
      </div>

    </div>
  );
}