import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await register(name, email, password);
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
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber/8 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-cyan/10 rounded-full blur-[100px]"></div>
                </div>
                <div className="relative text-center max-w-md px-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan to-cyan-700 flex items-center justify-center text-navy-900 font-bold text-3xl font-sora mx-auto mb-8 animate-float">
                        IQ
                    </div>
                    <h1 className="text-4xl font-sora font-bold mb-4">
                        Join <span className="text-gradient">AptIQ</span> Today
                    </h1>
                    <p className="text-white/40 text-lg font-dm">
                        Start your aptitude journey with structured courses, smart analytics, and competitive leaderboards.
                    </p>
                    <div className="mt-10 space-y-4 text-left">
                        {[
                            { icon: '✅', text: 'Free access to all courses and lessons' },
                            { icon: '📊', text: 'AI-powered performance analytics' },
                            { icon: '🏆', text: 'Real-time competitive leaderboards' },
                            { icon: '🛡️', text: 'Proctored tests with anti-cheat' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-white/50 text-sm">
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.text}</span>
                            </div>
                        ))}
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

                    <h2 className="text-3xl font-sora font-bold mb-2">Create Account</h2>
                    <p className="text-white/40 mb-8">Sign up to start your aptitude training</p>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm animate-scale-in">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                placeholder="John Doe"
                                required
                            />
                        </div>
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
                                placeholder="Minimum 6 characters"
                                required
                                minLength={6}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field"
                                placeholder="Re-enter your password"
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
                                    Creating account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-white/40">
                        Already have an account?{' '}
                        <Link to="/login" className="text-cyan hover:text-cyan-300 transition-colors font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
