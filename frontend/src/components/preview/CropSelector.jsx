import { useRef, useState, useEffect } from "react";

export default function CropSelector({ image, crop, setCrop }) {
  const canvasRef = useRef();
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const imgRef = useRef(new Image());

  useEffect(() => {
    if (!image) return;
    const img = imgRef.current;
    img.onload = () => drawCanvas(crop, img);
    img.src = image;
  }, [image]);

  useEffect(() => {
    if (imgRef.current.complete && imgRef.current.src) {
      drawCanvas(crop, imgRef.current);
    }
  }, [crop]);

  const drawCanvas = (c, img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.complete) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    if (c && c.width > 0 && c.height > 0) {
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.strokeRect(c.x, c.y, c.width, c.height);
      ctx.fillStyle = "rgba(34,197,94,0.08)";
      ctx.fillRect(c.x, c.y, c.width, c.height);
      ctx.fillStyle = "#22c55e";
      ctx.font = "11px monospace";
      ctx.fillText(
        `${Math.round(c.width)} × ${Math.round(c.height)}`,
        c.x + 4,
        c.y + 14
      );
    }
  };

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onMouseDown = (e) => { setStartPos(getPos(e)); setDrawing(true); };

  const onMouseMove = (e) => {
    if (!drawing || !startPos) return;
    const pos = getPos(e);
    setCrop({
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      width: Math.abs(pos.x - startPos.x),
      height: Math.abs(pos.y - startPos.y),
    });
  };

  const onMouseUp = () => setDrawing(false);

  const resetCrop = () => {
    const canvas = canvasRef.current;
    setCrop({ x: 0, y: 0, width: canvas.width, height: canvas.height });
  };

  if (!image) return null;

  return (
    <div className="form-field">
      <label className="form-label">
        Crop Region
        <span className="form-hint">draw over the conveyor belt area</span>
      </label>
      <div className="crop-container">
        <canvas
          ref={canvasRef}
          width={520}
          height={293}
          className="crop-canvas"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ cursor: "crosshair" }}
        />
      </div>
      {crop && crop.width > 0 && (
        <div className="crop-info">
          <span>x: {Math.round(crop.x)}</span>
          <span>y: {Math.round(crop.y)}</span>
          <span>w: {Math.round(crop.width)}</span>
          <span>h: {Math.round(crop.height)}</span>
        </div>
      )}
      <div className="crop-actions">
        <button className="btn-ghost btn-sm" type="button" onClick={resetCrop}>
          Use Full Frame
        </button>
        <button
          className="btn-ghost btn-sm"
          type="button"
          onClick={() => setCrop({ x: 0, y: 0, width: 0, height: 0 })}
        >
          Clear Crop
        </button>
      </div>
    </div>
  );
}