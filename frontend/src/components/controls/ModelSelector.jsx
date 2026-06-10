const MODELS = [
  { label: "YOLO", value: "yolo" },
  { label: "Faster R-CNN", value: "faster_rcnn" },
  { label: "SSD", value: "ssd" },
];

export default function ModelSelector({ value, onChange }) {
  return (
    <div className="form-field">
      <label className="form-label">Model</label>
      <div className="model-options">
        {MODELS.map((m) => (
          <button
            key={m.value}
            className={`model-btn ${value === m.value ? "selected" : ""}`}
            onClick={() => onChange(m.value)}
            type="button"
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}