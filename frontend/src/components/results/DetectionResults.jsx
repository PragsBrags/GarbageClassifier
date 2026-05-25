export default function DetectionResults({ data }) {
  return (
    <div className="card">
      <h3>Detections</h3>

      {data?.map((d, i) => (
        <div className="row" key={i}>
          <span>{d.label}</span>
          <b>{d.count}</b>
        </div>
      ))}
    </div>
  );
}