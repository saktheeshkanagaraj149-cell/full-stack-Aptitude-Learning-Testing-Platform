import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar({ title, subtitle }) {
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <header className="flex items-center justify-between mb-8">
            <div>
                <h1 className="section-title">{title}</h1>
                {subtitle && <p className="section-subtitle">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                    {isDark ? '☀️' : '🌙'}
                </button>
                <div className="flex items-center gap-3 glass-card !p-3 !rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber to-amber-700 flex items-center justify-center text-navy-900 font-bold text-xs">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-[10px] text-white/40 capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
