import "./snapshot.css";

export default function SnapshotGallery({ snapshots }) {
  return (
    <div className="gallery">
      {snapshots.map((s, i) => (
        <div key={i} className="snap-card">
          <img src={s.snapshot_url} />
          <p>Time: {s.timestamp}s</p>
        </div>
      ))}
    </div>
  );
}