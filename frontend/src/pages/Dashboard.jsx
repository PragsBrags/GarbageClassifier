import { useState } from "react";
import ModelSelector from "../components/controls/ModelSelector";
import IntervalInput from "../components/controls/IntervalInput";
import VideoPreview from "../components/preview/VideoPreview";
import CropSelector from "../components/preview/CropSelector";
import SummaryCards from "../components/results/SummaryCards";
import DetectionTable from "../components/results/DetectionTable";
import SnapshotGrid from "../components/results/SnapshotGrid";
import JobInfo from "../components/results/JobInfo";
import AnnotatedImage from "../components/results/AnnotatedImage";
import ChatBot from "../components/chatbot/ChatBot";

const MODEL_MAP = {
  yolo: "YOLO",
  faster_rcnn: "Faster R-CNN",
  ssd: "SSD",
};

const STATUS_STEPS = [
  "Uploading file...",
  "Extracting snapshots...",
  "Running inference...",
  "Preparing results...",
  "Completed.",
];

function buildSummary(results) {
  const summary = {};
  let total = 0;
  (results || []).forEach((r) => {
    (r.detections || []).forEach((d) => {
      summary[d.class_name] = (summary[d.class_name] || 0) + 1;
      total++;
    });
  });
  return { summary, total };
}

export default function Dashboard({ activePage }) {
  const [inputType, setInputType] = useState("image");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [firstFrame, setFirstFrame] = useState(null);
  const [model, setModel] = useState("");
  const [interval, setInterval] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState(0);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setFirstFrame(null);
    setModel("");
    setInterval(1);
    setCrop({ x: 0, y: 0, width: 0, height: 0 });
    setResponse(null);
    setError(null);
    setLoading(false);
    setStatusStep(0);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResponse(null);
    setError(null);
  };

  const submit = async () => {
    if (!file) { setError("Please select a file."); return; }
    if (!model) { setError("Please select a model."); return; }
    if (inputType === "video" && interval <= 0) {
      setError("Please enter a valid snapshot interval.");
      return;
    }

    setError(null);
    setLoading(true);
    setStatusStep(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("input_type", inputType);
    formData.append("model_type", model);

    if (inputType === "video") {
      formData.append("interval_seconds", interval);
      if (crop.width > 0) {
        formData.append("crop_x", Math.round(crop.x));
        formData.append("crop_y", Math.round(crop.y));
        formData.append("crop_width", Math.round(crop.width));
        formData.append("crop_height", Math.round(crop.height));
      }
    }

    try {
      // Simulate status ticks while waiting for backend
      const tick = (step, delay) =>
        new Promise((res) => setTimeout(() => { setStatusStep(step); res(); }, delay));

      await tick(1, 600);
      if (inputType === "video") await tick(2, 900);
      await tick(3, 600);

      const res = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      await tick(4, 400);
      setResponse(data);
    } catch (err) {
      setError(
        err.message.includes("fetch")
          ? "Could not connect to backend. Please check if Django is running at http://127.0.0.1:8000."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Normalize results from both image and video response shapes
  const resultsData = response?.results
    ? response.results
    : response?.snapshots
    ? response.snapshots.map((s) => ({
        snapshot_filename: s.filename,
        timestamp_seconds: s.timestamp_seconds,
        snapshot_url: s.snapshot_url,
        detections: s.detections || [],
      }))
    : [];

  const { summary, total } = buildSummary(resultsData);

  if (activePage === "chatbot") return <ChatBot />;

  return (
    <div className="analyze-layout">
      {/* LEFT PANEL */}
      <aside className="control-panel">
        <div className="panel-section">

          <div className="form-field">
            <label className="form-label">Input Type</label>
            <div className="type-toggle">
              <button
                className={`type-btn ${inputType === "image" ? "active" : ""}`}
                onClick={() => { setInputType("image"); reset(); }}
                type="button"
              >
                🖼 Image
              </button>
              <button
                className={`type-btn ${inputType === "video" ? "active" : ""}`}
                onClick={() => { setInputType("video"); reset(); }}
                type="button"
              >
                🎞 Video
              </button>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">
              {inputType === "image" ? "Image File" : "Video File"}
              <span className="form-hint">
                {inputType === "image" ? "jpg, jpeg, png" : "mp4, avi, mov"}
              </span>
            </label>
            <label className="file-upload-area">
              <input
                type="file"
                accept={
                  inputType === "image"
                    ? "image/jpeg,image/png,image/jpg"
                    : "video/mp4,video/avi,video/quicktime"
                }
                onChange={handleFile}
                className="file-input-hidden"
              />
              {file ? (
                <div className="file-selected">
                  <span className="file-icon">
                    {inputType === "image" ? "🖼" : "🎞"}
                  </span>
                  <div>
                    <div className="file-name">{file.name}</div>
                    <div className="file-meta">
                      {(file.size / 1024).toFixed(0)} KB · {file.type}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="file-prompt">
                  <span className="file-upload-icon">↑</span>
                  <span>Choose file</span>
                </div>
              )}
            </label>
          </div>

          <ModelSelector value={model} onChange={setModel} />

          {inputType === "video" && (
            <IntervalInput
              value={interval}
              onChange={(e) => setInterval(parseFloat(e.target.value))}
            />
          )}
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="panel-actions">
          <button
            className="btn-primary"
            onClick={submit}
            disabled={loading}
            type="button"
          >
            {loading
              ? "Processing..."
              : `Analyze ${inputType === "image" ? "Image" : "Video"}`}
          </button>
          <button
            className="btn-ghost"
            onClick={reset}
            disabled={loading}
            type="button"
          >
            Reset
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="main-area">

        {/* Loading overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-box">
              <div className="spinner" />
              <div className="loading-step">{STATUS_STEPS[statusStep]}</div>
              <div className="loading-substeps">
                {STATUS_STEPS.slice(0, statusStep + 1).map((s, i) => (
                  <div
                    key={i}
                    className={`substep ${i === statusStep ? "active" : "done"}`}
                  >
                    {i < statusStep ? "✓" : "›"} {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !response && !preview && (
          <div className="empty-state">
            <div className="empty-icon">♻</div>
            <div className="empty-title">Upload a file to begin</div>
            <div className="empty-body">
              Select an image or video, choose a model, and click Analyze.
            </div>
          </div>
        )}

        {/* Preview — shown before submission */}
        {!loading && !response && preview && (
          <div className="preview-section">
            <h2 className="section-title">Preview</h2>
            {inputType === "image" ? (
              <div className="preview-box">
                <img src={preview} alt="preview" className="preview-media" />
              </div>
            ) : (
              <>
                <VideoPreview
                  src={preview}
                  onFrame={(frame) => setFirstFrame(frame)}
                />
                {firstFrame && (
                  <CropSelector
                    image={firstFrame}
                    crop={crop}
                    setCrop={setCrop}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Results */}
        {!loading && response && (
          <div className="results-area">
            <div className="results-header">
              <h2 className="results-title">Results</h2>
              <div className="results-model-badge">
                {MODEL_MAP[response.model_type] || response.model_type}
              </div>
            </div>

            <JobInfo
              data={{
                ...response,
                crop: crop.width > 0 ? crop : null,
              }}
            />

            <SummaryCards summary={summary} totalDetections={total} />

            {response.input_type === "image" && (
              <AnnotatedImage
                originalUrl={response.file_url}
                annotatedUrl={response.annotated_image_url}
              />
            )}

            {response.input_type === "video" && resultsData.length > 0 && (
              <SnapshotGrid snapshots={resultsData} />
            )}

            {resultsData.length > 0 && (
              <DetectionTable results={resultsData} />
            )}

            {resultsData.length === 0 && (
              <div className="empty-state-sm">No objects detected.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}