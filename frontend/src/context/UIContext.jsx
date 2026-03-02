import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [serviceHealth, setServiceHealth] = useState('online'); // online, offline

    // Global state for uploaded file to persist across tabs
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <UIContext.Provider value={{
            toasts, addToast, removeToast,
            serviceHealth, setServiceHealth,
            selectedFile, setSelectedFile,
            previewUrl, setPreviewUrl
        }}>
            {children}
            {/* Global Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`px-4 py-2 rounded-xl shadow-md text-white transition-all duration-300 ${toast.type === 'error' ? 'bg-red-500' :
                            toast.type === 'success' ? 'bg-green-500' : 'bg-slate-800'
                            }`}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </UIContext.Provider>
    );
};
