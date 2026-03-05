import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { createClient } from '../utils/client';
import Loading from './ui/Loading';

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const client = createClient('/api/accounts');
                await client.get('/me');
                setIsAuthenticated(true);
            } catch (error) {
                // Check if it's a 401 unauthorized error
                if (error.response?.status === 401) {
                    setIsAuthenticated(false);
                } else {
                    // For other errors, we'll try to check if we can access protected data
                    try {
                        const projectsClient = createClient('/api/projects');
                        await projectsClient.get('/');
                        setIsAuthenticated(true);
                    } catch (projectsError) {
                        if (projectsError.response?.status === 401) {
                            setIsAuthenticated(false);
                        } else {
                            // For network errors or server issues, assume unauthenticated for safety
                            setIsAuthenticated(false);
                        }
                    }
                }
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <Loading fullScreen />;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
