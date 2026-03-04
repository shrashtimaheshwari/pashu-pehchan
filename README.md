# Pashu Pehchan - AI-Powered Cattle Breed Identification

Pashu Pehchan is a web application designed for government field workers to identify cattle breeds (cows and buffaloes) using AI. 

## 🚀 Key Features

### 📸 AI-Powered Image Prediction (The Core Feature)
* **Drag & Drop Upload**: Users can easily upload photos of cattle (JPEG/PNG, max 5MB).
* **Cloud Storage**: Images are uploaded to **Cloudinary** and auto-resized to optimize bandwidth.
* **AI Analysis via Embedded CNN Model**: The application utilizes an embedded deep learning-based Convolutional Neural Network (CNN) built using **YOLOv8** and **EfficientNetB0**. This robust architecture reliably identifies breeds (e.g., Gir, Sahiwal, Red Sindhi, Tharparkar, Murrah, Jafarabadi, etc.) and returns detailed probability distributions and confidence scores.
* **Quality Detection (Blur Warning)**: The ML pipeline evaluates image quality before prediction, actively flagging images that are too blurry or lack sufficient detail to analyze effectively.
* **Rate Limiting**: Protected with a limit of 5 predictions per minute per IP to prevent API abuse.

### 🔐 Authentication & Security
* **JWT Authentication**: Secure login system issuing JWT tokens stored in localStorage or sessionStorage.
* **Password Encryption**: Passwords are encrypted using `bcrypt` before hitting MongoDB.
* **Complete Forgot Password Flow**: Secure 3-step process using 6-digit email verification codes.
* **Auto-Logout**: Global Axios interceptors catch 401 Unauthorized responses to automatically log users out if their session expires.

### 📋 Scan History & Management
* **Personalized Dashboard**: Users can view all their past scans, sorted chronologically.
* **Search & Filter**: Easily search past scans by breed name.
* **Data Control**: Users (and Admins) can delete specific records from the database.

### 📄 Dynamic PDF Reports
* **One-Click Download**: Users can download detailed PDF reports of any scan.
* **Dynamic Generation**: Backend generates reports on-the-fly using `PDFKit`.
* **Rich Content**: PDFs include field worker details, scan date, AI confidence scores, blur warnings, and the actual embedded cattle image fetched from Cloudinary.

### 📊 Analytics Dashboard
* **Visual Insights**: Interactive charts built with `Recharts` (Bar and Donut charts).
* **Key Metrics**: Displays total scans, average confidence scores, and most common breeds.
* **Powerful Queries**: Driven by MongoDB aggregation pipelines.

### 🧭 UI/UX & System Health
* **Sidebar Navigation**: Clean, persistent sidebar layout for authenticated pages.
* **Global Notifications**: A robust context-based Toast system for instant user feedback (success/error/info).
* **Health Monitoring**: Background polling pings the backend health check endpoint every 30 seconds to monitor the overall system uptime.

## 🛠️ Tech Stack

* **Frontend**: React.js, Vite, Tailwind CSS, Recharts, Lucide React, Axios
* **Backend**: Node.js, Express.js
* **Machine Learning**: YOLOv8, EfficientNetB0, TensorFlow, Keras, Python Libraries, FastAPI or Flask
* **Database**: MongoDB
* **Authentication**: JSON Web Tokens (JWT), bcrypt
* **File Uploads**: Multer, Cloudinary
* **PDF Generation**: PDFKit

## 📂 Project Structure

The project is structured as a monorepo consisting of two main components:

* `/frontend` - The React user interface
* `/backend` - The Node.js/Express API server (integrates the embedded YOLOv8 and EfficientNetB0 ML model)

---
*Built to empower field workers with accessible AI technology.*
