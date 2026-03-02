import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || sessionStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Fetch profile if token exists
    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await api.get('/auth/profile');
                    setUser(res.data);
                } catch (error) {
                    console.error("Token invalid/expired");
                    logout();
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    // Handle global auto-logout events from axios interceptor
    useEffect(() => {
        const handleUnauthorized = () => {
            logout();
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, []);

    const login = async (email, password, rememberMe = true) => {
        const res = await api.post('/auth/login', { email, password });
        const { token: newToken, user: userData } = res.data;
        if (rememberMe) {
            localStorage.setItem('token', newToken);
            sessionStorage.removeItem('token');
        } else {
            sessionStorage.setItem('token', newToken);
            localStorage.removeItem('token');
        }
        setToken(newToken);
        setUser(userData);
    };

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = { user, token, loading, login, register, logout };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
