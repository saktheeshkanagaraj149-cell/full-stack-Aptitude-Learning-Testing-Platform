import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy-900 flex">
            {/* Left side - branding */}
            <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-amber/5 rounded-full blur-[100px]"></div>
                </div>
                <div className="relative text-center max-w-md px-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan to-cyan-700 flex items-center justify-center text-navy-900 font-bold text-3xl font-sora mx-auto mb-8 animate-float">
                        IQ
                    </div>
                    <h1 className="text-4xl font-sora font-bold mb-4">
                        Welcome back to <span className="text-gradient">AptIQ</span>
                    </h1>
                    <p className="text-white/40 text-lg font-dm">
                        Continue your aptitude journey. Track progress, take tests, and climb the leaderboard.
                    </p>
                    <div className="mt-12 flex items-center justify-center gap-8 text-white/20">
                        <div className="text-center">
                            <div className="text-2xl font-sora font-bold text-gradient">50+</div>
                            <div className="text-xs">Lessons</div>
                        </div>
                        <div className="w-px h-10 bg-white/10"></div>
                        <div className="text-center">
                            <div className="text-2xl font-sora font-bold text-gradient">300+</div>
                            <div className="text-xs">Questions</div>
                        </div>
                        <div className="w-px h-10 bg-white/10"></div>
                        <div className="text-center">
                            <div className="text-2xl font-sora font-bold text-gradient">10K+</div>
                            <div className="text-xs">Students</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-cyan-700 flex items-center justify-center text-navy-900 font-bold text-lg font-sora">IQ</div>
                        <span className="text-2xl font-sora font-bold text-gradient">AptIQ</span>
                    </div>

                    <h2 className="text-3xl font-sora font-bold mb-2">Sign In</h2>
                    <p className="text-white/40 mb-8">Enter your credentials to access your account</p>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm animate-scale-in">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full !py-3.5 text-center"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin"></span>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-white/40">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-cyan hover:text-cyan-300 transition-colors font-medium">
                            Create one free
                        </Link>
                    </div>

                    {/* Demo accounts */}
                    <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-[11px] text-white/30 mb-3 uppercase tracking-wider font-semibold">Demo Accounts</p>
                        <div className="space-y-2 text-xs text-white/40">
                            <div className="flex justify-between"><span>Student</span><code className="text-cyan/60">student@aptiq.com</code></div>
                            <div className="flex justify-between"><span>Instructor</span><code className="text-cyan/60">instructor@aptiq.com</code></div>
                            <div className="flex justify-between"><span>Admin</span><code className="text-cyan/60">admin@aptiq.com</code></div>
                            <p className="text-white/20 pt-1">Password: <code>password123</code></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
