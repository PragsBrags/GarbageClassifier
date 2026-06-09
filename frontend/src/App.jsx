import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnalyzePage from "./pages/AnalyzePage";
import ResultsPage from "./pages/ResultsPage";
import ChatbotPage from "./pages/ChatbotPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnalyzePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>
    </BrowserRouter>
  );
}