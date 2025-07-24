import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/ui/Spinner/Spinner'; // Import the Spinner component

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                // This endpoint should return the user data if a session is active.
                // It must be protected by your `requireAuth` middleware on the backend.
                const { data } = await axios.get('/api/auth/profile'); 
                setUser(data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUserSession();
    }, []);

    if (loading) {
        // Show the spinner while loading
        return (
            <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};