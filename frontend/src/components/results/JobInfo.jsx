export default function JobInfo({ data }) {
  if (!data) return null;
  const { job_id, input_type, model_type, status, video_metadata, crop } = data;

  return (
    <div className="job-info">
      <div className="job-row">
        <span className="job-key">Job ID</span>
        <span className="job-val mono">{job_id || "—"}</span>
      </div>
      <div className="job-row">
        <span className="job-key">Input Type</span>
        <span className="job-val">{input_type || "—"}</span>
      </div>
      <div className="job-row">
        <span className="job-key">Model</span>
        <span className="job-val">{model_type || "—"}</span>
      </div>
      <div className="job-row">
        <span className="job-key">Status</span>
        <span className={`job-status ${status === "completed" ? "ok" : "pending"}`}>
          {status || "completed"}
        </span>
      </div>
      {video_metadata && (
        <>
          <div className="job-row">
            <span className="job-key">Duration</span>
            <span className="job-val">{video_metadata.duration_seconds?.toFixed(2)}s</span>
          </div>
          <div className="job-row">
            <span className="job-key">FPS</span>
            <span className="job-val">{video_metadata.fps}</span>
          </div>
          <div className="job-row">
            <span className="job-key">Total Frames</span>
            <span className="job-val">{video_metadata.total_frames}</span>
          </div>
        </>
      )}
      {crop && crop.width > 0 && (
        <div className="job-row">
          <span className="job-key">Crop</span>
          <span className="job-val mono">
            x={Math.round(crop.x)}, y={Math.round(crop.y)},
            w={Math.round(crop.width)}, h={Math.round(crop.height)}
          </span>
        </div>
      )}
    </div>
  );
}