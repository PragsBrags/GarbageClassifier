import "./detectionCanvas.css";

export default function DetectionCanvas({ image, detections }) {
  return (
    <div className="canvas-wrapper">
      <img src={image} className="base-image" />

      {detections.map((d, i) => (
        <div
          key={i}
          className="bbox"
          style={{
            left: d.bbox.x1,
            top: d.bbox.y1,
            width: d.bbox.x2 - d.bbox.x1,
            height: d.bbox.y2 - d.bbox.y1,
          }}
        >
          {d.class_name} {Math.round(d.confidence * 100)}%
        </div>
      ))}
    </div>
  );
}