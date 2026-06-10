import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("analyze");

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-icon">♻</span>
          <span className="nav-title">WasteVision</span>
        </div>
        <div className="nav-links">
          <button
            className={`nav-link ${page === "analyze" ? "active" : ""}`}
            onClick={() => setPage("analyze")}
          >
            Analyze
          </button>
          <button
            className={`nav-link ${page === "chatbot" ? "active" : ""}`}
            onClick={() => setPage("chatbot")}
          >
            Assistant
          </button>
        </div>
      </nav>
      <main className="main-content">
        <Dashboard activePage={page} />
      </main>
    </div>
  );
}