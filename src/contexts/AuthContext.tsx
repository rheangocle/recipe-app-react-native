import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isAuthenticated, getUserProfile } from '../services/api';
import { UserProfile } from '../types/api';

interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (userData: UserProfile) => void;
    logout: () => void;
    updateUser: (userData: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const authenticated = await isAuthenticated();
            if (authenticated) {
                const userProfile = await getUserProfile();
                setUser(userProfile);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData: UserProfile) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const updateUser = (userData: Partial<UserProfile>) => {
        if (user) {
            setUser({ ...user, ...userData });
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 