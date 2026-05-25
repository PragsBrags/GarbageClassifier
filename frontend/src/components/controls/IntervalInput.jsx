export default function IntervalInput({ value, onChange }) {
  return (
    <div className="card">
      <label>Video Interval (sec)</label>
      <input
        type="number"
        value={value}
        min="0.1"
        step="0.1"
        onChange={onChange}
      />
    </div>
  );
}