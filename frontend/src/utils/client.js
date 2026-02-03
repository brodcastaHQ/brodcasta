import axios from 'axios';

/**
 * Creates an axios client instance with a specific prefix.
 * @param {string} prefix - The URL prefix for the client (e.g., '/api/v1').
 * @returns {import('axios').AxiosInstance} The configured axios instance.
 */
export const createClient = (prefix = '') => {
    // Use environment variable for base URL if available, otherwise default to relative path
    // In development, Vite proxy might handle the host 
    // But generally sticking to /api/... is good if proxy is set up.
    // Assuming the user runs server on a different port, usually we want a base URL.
    // However, often in vite dev, we proxy. 
    // For now, let's assume relative path /api is proxied or we just use the prefix.
    // If the user didn't specify a base URL, we might default to '' and let the browser resolve it (same origin).

    const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:6494') + prefix;

    const client = axios.create({
        baseURL,
        withCredentials: true,
    });

    // Add response interceptor for global error handling if needed later
    client.interceptors.response.use(
        (response) => response,
        (error) => {
            return Promise.reject(error);
        }
    );

    return client;
};
