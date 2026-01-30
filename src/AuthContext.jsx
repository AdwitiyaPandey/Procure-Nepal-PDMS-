import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const refreshUser = async () => {
        try {
            
            const res = await axios.get('http://localhost:5000/api/auth/me'); 
            const updatedUser = res.data.user;
            
            setUser(updatedUser); 
            localStorage.setItem('user', JSON.stringify(updatedUser)); 
            return updatedUser;
        } catch (err) {
            console.error("Could not refresh user state", err);
        }
    };

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
       
        <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);