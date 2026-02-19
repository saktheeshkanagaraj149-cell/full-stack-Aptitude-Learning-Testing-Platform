import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

// Safely parse JSON — returns null if response is empty or not JSON (e.g. HTML error pages)
async function safeJson(res) {
    const text = await res.text();
    if (!text || !text.trim()) return {};
    try {
        return JSON.parse(text);
    } catch {
        console.error('Non-JSON response from server:', text.slice(0, 200));
        throw new Error('Server returned an unexpected response. The backend may be starting up — please try again in a moment.');
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('aptiq_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const res = await fetch(`${API}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await safeJson(res);
                setUser(data);
            } else {
                logout();
            }
        } catch {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.error || 'Login failed. Backend may be waking up — try again.');
        localStorage.setItem('aptiq_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const register = async (name, email, password) => {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.error || 'Registration failed. Backend may be waking up — try again.');
        localStorage.setItem('aptiq_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('aptiq_token');
        setToken(null);
        setUser(null);
    };

    const apiFetch = async (url, options = {}) => {
        const res = await fetch(`${API}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        });
        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.error || 'Request failed. Backend may be waking up — try again.');
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, apiFetch, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
