export default function SummaryCards({ summary }) {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {Object.entries(summary || {}).map(([key, val]) => (
        <div key={key} className="card">
          <h3>{key}</h3>
          <p>{val}</p>
        </div>
      ))}
    </div>
  );
}