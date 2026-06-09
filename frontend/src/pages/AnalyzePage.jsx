import { useState } from "react";
import { uploadFile } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/analyze.css";

export default function AnalyzePage() {
  const [file, setFile] = useState(null);
  const [inputType, setInputType] = useState("image");
  const [model, setModel] = useState("yolo");
  const [interval, setInterval] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!file) return alert("Please select a file");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("input_type", inputType);
    formData.append("model_type", model);

    if (inputType === "video") {
      formData.append("interval_seconds", interval);
      formData.append("crop_x", crop.x);
      formData.append("crop_y", crop.y);
      formData.append("crop_width", crop.width);
      formData.append("crop_height", crop.height);
    }

    try {
      const res = await uploadFile(formData);
      navigate("/results", { state: res.data });
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Garbage Classification System</h1>

      {/* Input Type */}
      <label>Input Type</label>
      <select onChange={(e) => setInputType(e.target.value)}>
        <option value="image">Image</option>
        <option value="video">Video</option>
      </select>

      {/* File */}
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      {/* Model */}
      <label>Model</label>
      <select onChange={(e) => setModel(e.target.value)}>
        <option value="yolo">YOLO</option>
        <option value="faster_rcnn">Faster R-CNN</option>
        <option value="ssd">SSD</option>
      </select>

      {/* Video Options */}
      {inputType === "video" && (
        <>
          <label>Snapshot Interval (sec)</label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          />

          <h3>Crop (x, y, w, h)</h3>
          <input placeholder="x"
            onChange={(e) => setCrop({ ...crop, x: +e.target.value })} />

          <input placeholder="y"
            onChange={(e) => setCrop({ ...crop, y: +e.target.value })} />

          <input placeholder="width"
            onChange={(e) => setCrop({ ...crop, width: +e.target.value })} />

          <input placeholder="height"
            onChange={(e) => setCrop({ ...crop, height: +e.target.value })} />
        </>
      )}

      <button onClick={handleSubmit}>
        {loading ? "Processing..." : "Analyze"}
      </button>
    </div>
  );
}