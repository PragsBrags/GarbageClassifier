import { useState } from "react";

import FileInput from "../components/controls/FileInput";
import ModelSelector from "../components/controls/ModelSelector";
import IntervalInput from "../components/controls/IntervalInput";

import ImagePreview from "../components/preview/ImagePreview";
import VideoPreview from "../components/preview/VideoPreview";

import DetectionResults from "../components/results/DetectionResults";
import ChatBot from "../components/chatbot/ChatBot";

export default function Dashboard() {
  const [type, setType] = useState("image");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [model, setModel] = useState("");
  const [interval, setInterval] = useState(1);

  const [results, setResults] = useState([]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const runDetection = async () => {
    
    // const response = await uploadImage/file/video API

    console.log("Sending to backend:", {
      file,
      model,
      type
    });

    // MOCK RESPONSE (replace later with API response)
    setResults([
      { label: "Plastic", count: 3 },
      { label: "Paper", count: 5 },
      { label: "Glass", count: 2 }
    ]);
  };

  return (
       
    <div className="dashboard">

      {/* LEFT */}
      <div className="left">
        <h2>Controls</h2>

        <label>Input Type</label>
        <select onChange={(e) => setType(e.target.value)}>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>

        <FileInput type={type} onChange={handleFile} />

        <ModelSelector
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        {type === "video" && (
          <IntervalInput
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          />
        )}

        <button onClick={runDetection}>
          Run Detection
        </button>
      </div>

      {/* MIDDLE */}
      <div className="middle">
        <h2>Detection View</h2>

        {type === "image" ? (
          <ImagePreview src={preview} />
        ) : (
          <VideoPreview src={preview} />
        )}

        <DetectionResults data={results} />
      </div>

      {/* RIGHT */}
      <div className="right">
        <ChatBot />
      </div>

    </div>
  );
}