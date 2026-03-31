from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Response, status
from pydantic import BaseModel
import urllib.request
import numpy as np
import cv2
import threading

app = FastAPI()

class ImageURLRequest(BaseModel):
    image_url: str

from typing import Any

# Global variables for models
model: Any = None
yolo: Any = None
preprocess_input: Any = None
models_loaded = False

def load_models_in_bg():
    global model, yolo, preprocess_input, models_loaded
    try:
        import tensorflow as tf
        from ultralytics import YOLO
        from tensorflow.keras.applications.efficientnet import preprocess_input as tf_preprocess
        
        # Load models
        print("Loading models in background...")
        model = tf.keras.models.load_model("cattle_classifier.keras")
        yolo = YOLO("yolov8n.pt")
        preprocess_input = tf_preprocess
        models_loaded = True
        print("Models loaded successfully!")
    except Exception as e:
        print(f"Error loading models: {e}")

@app.on_event("startup")
async def startup_event():
    # Start loading models in a background thread so uvicorn binds to port immediately
    thread = threading.Thread(target=load_models_in_bg)
    thread.daemon = True
    thread.start()

IMG_SIZE = 300

import json
import os

breed_names_path = "breed_names.json"
if os.path.exists(breed_names_path):
    with open(breed_names_path, "r", encoding="utf-8") as f:
        breed_names = json.load(f)
else:
    breed_names = [
        "Jaffrabadi", "Mehsana", "Murrah", "Nili_Ravi",
        "Alambadi", "Himachali Pahari", "Kangayam", "Kasargod",
        "Kenkatha", "Umblachery", "Gir", "Khariar", "Kosali",
        "motu", "Nimari", "Red kandhari", "Vechur", "Bargur",
        "Guernsey", "Poda Thirupu", "Rathi", "Dangi", "ponwar",
        "siri", "Amritmahal", "dagri", "gangatari", "Hariana",
        "nagori", "ongole"
    ]

@app.post("/predict")
async def predict(response: Response, file: UploadFile = File(...)):
    if not models_loaded:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {"error": "Models are still loading. Please try again in a few minutes."}

    contents = await file.read()

    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # YOLO detection - lower conf to 0.15 to avoid false negatives on cows with accessories or buffalos
    results = yolo(img_rgb, conf=0.15)

    cropped = img_rgb

    found_bovine = False
    # Expand allowed classes to prevent rejecting buffaloes (which COCO YOLO often misclassifies as elephant/bear) or disguised cows
    allowed_labels = ["cow", "buffalo", "elephant", "bear", "sheep", "horse"]

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            label = yolo.names[cls]

            if label in allowed_labels:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cropped = img_rgb[y1:y2, x1:x2]
                found_bovine = True
                break
        if found_bovine:
            break
            
    if not found_bovine:
        return {"error": "Not a cow or buffalo"}

    cropped = cv2.resize(cropped,(IMG_SIZE,IMG_SIZE))
    cropped = preprocess_input(cropped.astype(np.float32))

    input_img = np.expand_dims(cropped,axis=0)

    preds = model.predict(input_img)
    if isinstance(preds, dict):
        species_pred = preds["species"]
        group_pred = preds["group"]
        breed_pred = preds["breed"]
    else:
        species_pred, group_pred, breed_pred = preds

    breed_id = np.argmax(breed_pred)

    breed_pred_arr = breed_pred[0]
    top3_indices = np.argsort(breed_pred_arr)[-3:][::-1]
    
    probabilities = []
    for idx in top3_indices:
        probabilities.append({
            "breed": breed_names[idx],
            "score": f"{float(breed_pred_arr[idx]):.2f}"
        })

    return {
        "breed": breed_names[breed_id],
        "confidence": float(np.max(breed_pred)) * 100,
        "probabilities": probabilities,
        "blurWarning": False,
        "info_card": {
            "origin": "India",
            "milk_yield": "Depends on Breed",
            "characteristics": "AI verified"
        }
    }


@app.post("/predict_url")
async def predict_url(req: ImageURLRequest, response: Response):
    if not models_loaded:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {"error": "Models are still loading. Please try again in a few minutes."}
        
    try:
        req_obj = urllib.request.Request(req.image_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req_obj) as resp:
            nparr = np.asarray(bytearray(resp.read()), dtype="uint8")
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return {"error": "Failed to decode image from URL"}

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # YOLO detection - lower conf to 0.15 to avoid false negatives on cows with accessories or buffalos
        results = yolo(img_rgb, conf=0.15)

        cropped = img_rgb

        found_bovine = False
        allowed_labels = ["cow", "buffalo", "elephant", "bear", "sheep", "horse"]

        for r in results:
            for box in r.boxes:
                cls = int(box.cls[0])
                label = yolo.names[cls]

                if label in allowed_labels:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    cropped = img_rgb[y1:y2, x1:x2]
                    found_bovine = True
                    break
            if found_bovine:
                break
                
        if not found_bovine:
            return {"error": "Not a cow or buffalo"}

        cropped = cv2.resize(cropped, (IMG_SIZE, IMG_SIZE))
        cropped = preprocess_input(cropped.astype(np.float32))

        input_img = np.expand_dims(cropped, axis=0)

        preds = model.predict(input_img)
        if isinstance(preds, dict):
            breed_pred = preds["breed"]
        else:
            if len(preds) == 3:
                species_pred, group_pred, breed_pred = preds
            else:
                breed_pred = preds

        breed_id = np.argmax(breed_pred)

        breed_pred_arr = breed_pred[0]
        top3_indices = np.argsort(breed_pred_arr)[-3:][::-1]
        
        probabilities = []
        for idx in top3_indices:
            probabilities.append({
                "breed": breed_names[idx],
                "score": f"{float(breed_pred_arr[idx]):.2f}"
            })

        return {
            "breed": breed_names[breed_id],
            "confidence": float(np.max(breed_pred)) * 100,
            "probabilities": probabilities,
            "blurWarning": False,
            "info_card": {
                "origin": "India",
                "milk_yield": "Depends on Breed",
                "characteristics": "AI verified"
            }
        }
    except Exception as e:
        return {"error": str(e)}