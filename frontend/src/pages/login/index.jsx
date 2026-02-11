import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Loading from '../../components/ui/Loading';
import { createClient } from '../../utils/client';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const client = createClient('/api/accounts');
            await client.post('/login', { email, password });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen w-full bg-base-100 flex items-center justify-center relative overflow-hidden">
                {/* Background glow effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{
                        backgroundImage: `
                    linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                    }}
                />

                {/* Login Card */}
                <div className="relative">
                    {loading && <Loading fullScreen />}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">
                            Welcome back
                        </h1>
                        <p className="text-md text-base-content/60">
                            Enter your credentials to access your workspace.
                        </p>
                    </div>

                    {error && (
                        <div role="alert" className="alert alert-error mb-4 max-w-md mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="space-y-4 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label pt-0 pb-1.5">
                                <span className="label-text text-xs font-medium uppercase tracking-wider opacity-60">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="input w-full bg-base-200 border-transparent focus:border-primary/20 focus:bg-base-100 transition-all rounded-lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label pt-0 pb-1.5">
                                <span className="label-text text-xs font-medium uppercase tracking-wider opacity-60">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input w-full bg-base-200 border-transparent focus:border-primary/20 focus:bg-base-100 transition-all rounded-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="label pb-0">
                                <a href="#" className="label-text-alt link link-hover text-primary font-medium">Forgot password?</a>
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary w-full rounded-lg text-white mt-2" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="text-center mt-6 text-md opacity-60">
                        Don't have an account? <a href="/signup" className="link link-primary font-bold">Sign up</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
