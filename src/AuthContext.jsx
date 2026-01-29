import React, { createContext, useContext, useState, useEffect } from 'react';

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
            const res = await axios.get('http://localhost:5000/api/auth/me'); // Create this route
            setUser(res.data.user); // Update context with fresh DB data
        } catch (err) {
            console.error("Could not refresh user state");
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
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);