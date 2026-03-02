import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef(null);
    const { user, logout } = useAuth();
    const {
        addToast,
        selectedFile: file, setSelectedFile: setFile,
        previewUrl: preview, setPreviewUrl: setPreview
    } = useUI();
    const navigate = useNavigate();

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const processFile = (selectedFile) => {
        if (!selectedFile) return;

        // Validate type
        if (!selectedFile.type.startsWith('image/')) {
            addToast('Please upload a valid image file.', 'error');
            return;
        }

        // Validate size (5MB = 5 * 1024 * 1024 bytes)
        if (selectedFile.size > 5 * 1024 * 1024) {
            addToast('File size exceeds the 5MB limit.', 'error');
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        processFile(droppedFile);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        processFile(selectedFile);
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.post('/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { blurWarning } = response.data;
            if (blurWarning) {
                addToast('Low image clarity may affect accuracy.', 'info');
            }

            // Pass result to Prediction Result screen
            navigate('/result', { state: { result: response.data, preview } });
        } catch (error) {
            addToast(error.response?.data?.message || 'Error communicating with ML API. Please try again.', 'error');
        } finally {
            setIsUploading(false);
        }
    };



    return (
        <div className="flex bg-slate-50 min-h-screen">
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">New Cattle Scan</h1>
                    <p className="text-slate-500 text-lg">Upload an image of a cattle or buffalo to classify its breed.</p>
                </header>

                <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

                    {!preview ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
                ${isDragging ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-primary/50 hover:bg-slate-50'}`}
                        >
                            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                                <UploadCloud className="w-8 h-8 text-secondary" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">Drag & Drop Image Here</h3>
                            <p className="text-slate-500 mb-6">or click to browse from your computer</p>

                            <p className="text-xs text-slate-400 font-medium bg-slate-100 px-3 py-1 rounded-full">
                                Supported: JPEG, PNG • Max size: 5MB
                            </p>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <div className="animate-in fade-in zoom-in duration-300">
                            <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100 flex justify-center h-80 mb-6 group">
                                <img src={preview} alt="Cattle upload preview" className="h-full object-contain" />

                                {!isUploading && (
                                    <button
                                        onClick={removeFile}
                                        className="absolute top-4 right-4 bg-white/90 hover:bg-red-50 text-slate-700 hover:text-red-500 p-2 rounded-full shadow-md transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <ImageIcon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-700 truncate max-w-xs">{file.name}</p>
                                        <p className="text-sm text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={removeFile}
                                    disabled={isUploading}
                                    className="px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isUploading}
                                    className="px-8 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-light shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Image...
                                        </>
                                    ) : 'Analyze'}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
