export default function ImagePreview({ src }) {
  if (!src) return null;

  return (
    <div className="preview">
      <img src={src} alt="preview" />
    </div>
  );
}