export default function FileInput({ type, onChange }) {
  return (
    <div className="card">
      <label>Upload {type}</label>
      <input
        type="file"
        accept={type === "image" ? "image/*" : "video/*"}
        onChange={onChange}
      />
    </div>
  );
}