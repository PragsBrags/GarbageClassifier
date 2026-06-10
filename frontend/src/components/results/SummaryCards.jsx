const CLASS_COLORS = {
  METAL: "#94a3b8",
  PLASTIC: "#60a5fa",
  PAPER: "#fbbf24",
  GLASS: "#34d399",
  CARDBOARD: "#a78bfa",
  TRASH: "#f87171",
};

export default function SummaryCards({ summary, totalDetections }) {
  if (!summary || Object.keys(summary).length === 0) return null;

  return (
    <div className="summary-section">
      <div className="summary-cards">
        <div className="summary-card total-card">
          <div className="summary-number">{totalDetections || 0}</div>
          <div className="summary-label">Total Detections</div>
        </div>
        {Object.entries(summary).map(([cls, count]) => (
          <div
            key={cls}
            className="summary-card"
            style={{
              borderTop: `3px solid ${CLASS_COLORS[cls?.toUpperCase()] || "#6b7280"}`,
            }}
          >
            <div
              className="summary-number"
              style={{ color: CLASS_COLORS[cls?.toUpperCase()] || "#6b7280" }}
            >
              {count}
            </div>
            <div className="summary-label">{cls}</div>
          </div>
        ))}
      </div>
    </div>
  );
}