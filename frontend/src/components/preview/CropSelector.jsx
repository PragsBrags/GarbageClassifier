import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function CropSelector({
  image,
  crop,
  setCrop
}) {
  if (!image) return null;

  return (
    <div className="card">
      <ReactCrop crop={crop} onChange={setCrop}>
        <img src={image} alt="crop" />
      </ReactCrop>
    </div>
  );
}   