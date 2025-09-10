import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const image = location.state?.image;

  return (
    <div className="flex justify-center mt-6">
      {image ? (
        <div className="w-96 border border-gray-400 rounded-lg p-4 shadow-md bg-white">
          <h3 className="font-semibold text-sm mb-2">
            Predicted cow Breed Name with percentage
          </h3>
          <img src={image} alt="Uploaded Cow" className="w-full rounded-md mb-3" />

          {/* Breed Details */}
          <div className="text-sm space-y-1">
            <p>
              <span className="font-bold">Breed:</span> Likely Kankrej (Indian Desi Cow)
            </p>
            <p>
              <span className="font-bold">Life Expectancy:</span> 18–22 years
            </p>
            <p>
              <span className="font-bold">Region:</span> Gujarat, Rajasthan (India)
            </p>
            <p>
              <span className="font-bold">Food:</span> Green fodder, dry fodder, grains, mineral mix, clean water
            </p>
            <p>
              <span className="font-bold">Milk Yield:</span> 8–12 liters/day (A2 milk, ~4.5–5% fat)
            </p>
            <p>
              <span className="font-bold">Care:</span> Clean shelter, bathing, vaccination, deworming, stress-free handling
            </p>
            <p>
              <span className="font-bold">Medicine:</span> Vaccines (FMD, HS, BQ, Brucellosis), deworming, calcium & vitamin supplements
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">No image uploaded. Please go back and upload one.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Result;
