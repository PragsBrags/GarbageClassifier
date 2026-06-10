import { useRef } from "react";

export default function VideoPreview({ src, onFrame }) {
  const videoRef = useRef();

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    onFrame && onFrame(canvas.toDataURL("image/jpeg"));
  };

  if (!src) return null;

  return (
    <div className="preview-box">
      <video
        ref={videoRef}
        src={src}
        controls
        onLoadedData={captureFrame}
        className="preview-media"
      />
    </div>
  );
}