import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const studentLinks = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/courses', icon: '📚', label: 'Courses' },
    { to: '/tests', icon: '📝', label: 'Tests' },
    { to: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { to: '/profile', icon: '👤', label: 'Profile' },
];

const instructorLinks = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/courses', icon: '📚', label: 'Courses' },
    { to: '/tests', icon: '📝', label: 'Tests' },
    { to: '/instructor', icon: '🎓', label: 'Instructor Panel' },
    { to: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { to: '/profile', icon: '👤', label: 'Profile' },
];

const adminLinks = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/courses', icon: '📚', label: 'Courses' },
    { to: '/tests', icon: '📝', label: 'Tests' },
    { to: '/admin', icon: '⚙️', label: 'Admin Panel' },
    { to: '/instructor', icon: '🎓', label: 'Instructor Panel' },
    { to: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { to: '/profile', icon: '👤', label: 'Profile' },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const links = user?.role === 'admin' ? adminLinks : user?.role === 'instructor' ? instructorLinks : studentLinks;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className="fixed left-0 top-0 w-64 h-screen bg-navy-950/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-40">
            {/* Logo */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-cyan-700 flex items-center justify-center text-navy-900 font-bold text-lg font-sora">
                        IQ
                    </div>
                    <div>
                        <h1 className="text-xl font-sora font-bold text-gradient">AptIQ</h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Intelligence Platform</p>
                    </div>
                </div>
            </div>

            {/* User info */}
            <div className="px-4 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber to-amber-700 flex items-center justify-center text-navy-900 font-bold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-[11px] text-white/40 capitalize">{user?.role} • 🔥 {user?.streak || 0}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {links.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            isActive ? 'sidebar-link-active' : 'sidebar-link'
                        }
                    >
                        <span className="text-lg">{link.icon}</span>
                        <span className="text-sm">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom controls */}
            <div className="p-3 border-t border-white/5 space-y-1">
                <button
                    onClick={toggleTheme}
                    className="sidebar-link w-full text-left"
                >
                    <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
                    <span className="text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="sidebar-link w-full text-left hover:!bg-red-500/10 hover:!text-red-400"
                >
                    <span className="text-lg">🚪</span>
                    <span className="text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
}
