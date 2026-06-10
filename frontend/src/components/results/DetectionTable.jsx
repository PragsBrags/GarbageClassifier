import { useState } from "react";

function buildTableRows(results) {
  const rows = [];
  results.forEach((result, snapIdx) => {
    const grouped = {};
    (result.detections || []).forEach((det) => {
      if (!grouped[det.class_name]) grouped[det.class_name] = { count: 0, confidences: [] };
      grouped[det.class_name].count++;
      grouped[det.class_name].confidences.push(det.confidence);
    });
    Object.entries(grouped).forEach(([cls, data]) => {
      const avg = data.confidences.reduce((a, b) => a + b, 0) / data.confidences.length;
      const max = Math.max(...data.confidences);
      rows.push({
        snapshot: result.snapshot_filename || `frame_${snapIdx}`,
        time: result.timestamp_seconds != null
          ? `${result.timestamp_seconds.toFixed(2)}s`
          : "-",
        cls,
        count: data.count,
        avgConf: (avg * 100).toFixed(1),
        maxConf: (max * 100).toFixed(1),
      });
    });
  });
  return rows;
}

export default function DetectionTable({ results }) {
  const [expanded, setExpanded] = useState(false);
  if (!results || results.length === 0) return null;

  const rows = buildTableRows(results);

  return (
    <div className="table-section">
      <div className="section-header">
        <h3 className="section-title">Detection Summary</h3>
        <button
          className="btn-ghost btn-sm"
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          {expanded ? "Hide" : "View"} Raw Detections
        </button>
      </div>

      <div className="table-wrap">
        <table className="det-table">
          <thead>
            <tr>
              <th>Snapshot</th>
              <th>Time</th>
              <th>Class</th>
              <th>Count</th>
              <th>Avg Conf</th>
              <th>Max Conf</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="mono">{r.snapshot}</td>
                <td>{r.time}</td>
                <td><span className="class-badge">{r.cls}</span></td>
                <td className="num">{r.count}</td>
                <td className="num conf">{r.avgConf}%</td>
                <td className="num conf">{r.maxConf}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {expanded && (
        <div className="raw-section">
          <div className="raw-title">Raw Detections</div>
          <div className="table-wrap">
            <table className="det-table raw-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Snapshot</th>
                  <th>Time</th>
                  <th>Class</th>
                  <th>Confidence</th>
                  <th>BBox</th>
                </tr>
              </thead>
              <tbody>
                {results.flatMap((result, sIdx) =>
                  (result.detections || []).map((det, dIdx) => (
                    <tr key={`${sIdx}-${dIdx}`}>
                      <td className="num">{dIdx + 1}</td>
                      <td className="mono">
                        {result.snapshot_filename || `frame_${sIdx}`}
                      </td>
                      <td>
                        {result.timestamp_seconds != null
                          ? `${result.timestamp_seconds.toFixed(2)}s`
                          : "-"}
                      </td>
                      <td><span className="class-badge">{det.class_name}</span></td>
                      <td className="num conf">
                        {(det.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="mono bbox">
                        {det.bbox
                          ? `x1=${det.bbox.x1} y1=${det.bbox.y1} x2=${det.bbox.x2} y2=${det.bbox.y2}`
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}