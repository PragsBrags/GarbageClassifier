const MODELS = ["YOLO", "Faster R-CNN", "SSD"];

export default function ModelSelector({ value, onChange }) {
  return (
    <div className="card">
      <label>Model</label>
      <select value={value} onChange={onChange}>
        <option value="">Select model</option>
        {MODELS.map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>
    </div>
  );
}