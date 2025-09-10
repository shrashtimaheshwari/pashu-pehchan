import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    if (file) {
      navigate("/result", { state: { image: preview } });
    } else {
      alert("Please upload an image first!");
    }
  };

  return (
    <div className="flex flex-col items-center mt-6 space-y-4">
      <h2 className="text-lg font-semibold">Upload Photo</h2>

      {/* Upload Box */}
      <div
        className="w-72 h-64 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-full rounded-md" />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 15a4 4 0 014-4h.586A1.5 1.5 0 019 10.5h6A1.5 1.5 0 0116.414 11H17a4 4 0 014 4v1H3v-1z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 15v2a2 2 0 002 2h6a2 2 0 002-2v-2"
              />
            </svg>
            <p>Click to Upload</p>
            <p>or Drag and Drop</p>
          </div>
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
      >
        Submit
      </button>
    </div>
  );
};

export default Home;
