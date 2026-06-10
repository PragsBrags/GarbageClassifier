export default function IntervalInput({ value, onChange }) {
  return (
    <div className="form-field">
      <label className="form-label">
        Snapshot Interval
        <span className="form-hint">seconds between frames</span>
      </label>
      <div className="interval-row">
        <input
          type="number"
          className="form-input interval-input"
          value={value}
          min="0.5"
          max="10"
          step="0.1"
          onChange={onChange}
        />
        <span className="interval-unit">sec</span>
      </div>
      <input
        type="range"
        className="range-slider"
        value={value}
        min="0.5"
        max="10"
        step="0.5"
        onChange={onChange}
      />
      <div className="range-labels">
        <span>0.5s</span>
        <span>10s</span>
      </div>
    </div>
  );
}