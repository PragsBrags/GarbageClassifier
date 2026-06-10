import { useState } from "react";

const CLASS_COLORS = {
  METAL: "#94a3b8",
  PLASTIC: "#60a5fa",
  PAPER: "#fbbf24",
  GLASS: "#34d399",
  CARDBOARD: "#a78bfa",
  TRASH: "#f87171",
};

function groupDetections(detections) {
  const g = {};
  (detections || []).forEach((d) => {
    g[d.class_name] = (g[d.class_name] || 0) + 1;
  });
  return g;
}

function SnapshotModal({ snap, index, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Snapshot #{index}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {snap.snapshot_url && (
          <img
            src={snap.snapshot_url}
            alt={`snapshot ${index}`}
            className="modal-img"
          />
        )}
        <div className="modal-meta">
          <span>
            Timestamp:{" "}
            {snap.timestamp_seconds != null
              ? `${snap.timestamp_seconds.toFixed(2)}s`
              : "—"}
          </span>
          <span>{(snap.detections || []).length} detections</span>
        </div>
        <div className="modal-detections">
          {Object.entries(groupDetections(snap.detections)).map(([cls, count]) => (
            <div
              key={cls}
              className="modal-det-row"
              style={{ borderLeft: `3px solid ${CLASS_COLORS[cls] || "#6b7280"}` }}
            >
              <span>{cls}</span>
              <span>{count} {count === 1 ? "object" : "objects"}</span>
            </div>
          ))}
          {(snap.detections || []).length === 0 && (
            <div className="empty-state-sm">No objects detected</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SnapshotGrid({ snapshots }) {
  const [selected, setSelected] = useState(null);
  if (!snapshots || snapshots.length === 0) return null;

  return (
    <div className="table-section">
      <h3 className="section-title">Snapshots</h3>
      <div className="snapshot-grid">
        {snapshots.map((snap, i) => {
          const grouped = groupDetections(snap.detections);
          return (
            <div
              key={i}
              className="snapshot-card"
              onClick={() => setSelected(i)}
            >
              <div className="snap-header">
                <span className="snap-index">#{i}</span>
                <span className="snap-time">
                  {snap.timestamp_seconds != null
                    ? `${snap.timestamp_seconds.toFixed(2)}s`
                    : "—"}
                </span>
              </div>
              {snap.snapshot_url ? (
                <img
                  src={snap.snapshot_url}
                  alt={`snap ${i}`}
                  className="snap-img"
                />
              ) : (
                <div className="snap-placeholder">No preview</div>
              )}
              <div className="snap-footer">
                {Object.keys(grouped).length > 0 ? (
                  Object.entries(grouped).map(([cls, count]) => (
                    <div key={cls} className="snap-det">
                      <span
                        className="snap-dot"
                        style={{ background: CLASS_COLORS[cls] || "#6b7280" }}
                      />
                      <span>{cls}: {count}</span>
                    </div>
                  ))
                ) : (
                  <span className="no-det">No detections</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selected !== null && (
        <SnapshotModal
          snap={snapshots[selected]}
          index={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}