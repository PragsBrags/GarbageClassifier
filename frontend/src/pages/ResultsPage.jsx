import { useLocation } from "react-router-dom";
import "../styles/results.css";
import DetectionCanvas from "../components/DetectionCanvas";
import SnapshotGallery from "../components/SnapshotGallery";

export default function ResultsPage() {
  const { state } = useLocation();

  if (!state) return <div>No results found</div>;

  const data = state;

  return (
    <div className="container">
      <h1>Results</h1>

      <div className="card">
        <b>Job ID:</b> {data.job_id}
      </div>

      {/* Image result */}
      {data.file_url && (
        <img src={data.file_url} className="result-image" />
      )}

      {/* Annotated image */}
      {data.annotated_image_url && (
        <img src={data.annotated_image_url} className="result-image" />
      )}

      {/* Snapshots */}
      {data.snapshots && (
        <SnapshotGallery snapshots={data.snapshots} />
      )}

      {/* Detection overlay (image) */}
      {data.results?.[0]?.detections && (
        <DetectionCanvas
          image={data.file_url}
          detections={data.results[0].detections}
        />
      )}
    </div>
  );
}