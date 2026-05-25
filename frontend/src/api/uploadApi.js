import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const uploadImage = async (file, modelType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("input_type", "image");
  formData.append("model_type", modelType);

  const res = await axios.post(`${API_BASE_URL}/upload/`, formData);
  return res.data;
};

export const uploadVideo = async (
  file,
  modelType,
  intervalSeconds,
  crop
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("input_type", "video");
  formData.append("model_type", modelType);
  formData.append("interval_seconds", intervalSeconds);

  if (crop) {
    Object.entries(crop).forEach(([k, v]) =>
      formData.append(k, v)
    );
  }

  const res = await axios.post(`${API_BASE_URL}/upload/`, formData);
  return res.data;
};