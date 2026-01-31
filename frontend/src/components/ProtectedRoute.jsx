import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { createClient } from '../utils/client';
import Loading from './ui/Loading';

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            // Basic check: try to fetch user details or just check for cookie presence (server handles httpOnly).
            // Since cookies are httpOnly, we can't check document.cookie easily for 'access_token' if we want to be strict.
            // Best way is to make a request to /me or check if we can make an authenticated call.
            // For now, let's assume if there's no error on a simple ping, we are good.
            // Actually, let's just use the /accounts/me endpoint if it exists or just rely on the fact 
            // that if we are unauthorized, the API calls will fail.
            // But for route protection, we want to know upfront.

            try {
                const client = createClient('/api/accounts');
                await client.get('/me');
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
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
