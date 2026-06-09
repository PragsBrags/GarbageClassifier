import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const uploadFile = (formData) => {
  return API.post("/api/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};