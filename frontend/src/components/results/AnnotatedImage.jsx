export default function AnnotatedImage({ originalUrl, annotatedUrl }) {
  if (!originalUrl && !annotatedUrl) return null;

  return (
    <div className="table-section">
      <h3 className="section-title">Image Result</h3>

      <div className="image-result-grid">
        {originalUrl && (
          <div className="img-result-box">
            <div className="img-result-label">Original</div>
            <img
              src={originalUrl}
              alt="original"
              className="result-img"
            />
          </div>
        )}

        {annotatedUrl ? (
          <div className="img-result-box">
            <div className="img-result-label">Detected</div>

            <img
              src={annotatedUrl}
              alt="annotated"
              className="result-img"
            />

            <a
              href={annotatedUrl}
              download="annotated_result.jpg"
              className="btn-ghost btn-sm download-btn"
            >
              Download
            </a>
          </div>
        ) : (
          <div className="img-result-box placeholder-box">
            <div className="img-result-label">Detected</div>

            <div className="img-placeholder">
              Annotated image will appear after inference completes.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}