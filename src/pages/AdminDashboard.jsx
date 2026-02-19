import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';

export default function AdminDashboard() {
    const { apiFetch } = useAuth();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('overview');
    const [announcement, setAnnouncement] = useState('');
    const [announceSent, setAnnounceSent] = useState(false);

    useEffect(() => { loadAdmin(); }, []);

    const loadAdmin = async () => {
        try {
            const [usersData, statsData] = await Promise.all([
                apiFetch('/admin/users').catch(() => []),
                apiFetch('/admin/stats').catch(() => null),
            ]);
            setUsers(Array.isArray(usersData) ? usersData : []);
            setStats(statsData);
        } catch (err) {
            console.error('Admin load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const sendAnnouncement = async () => {
        if (!announcement.trim()) return;
        try {
            await apiFetch('/admin/announcements', {
                method: 'POST',
                body: JSON.stringify({ title: 'Admin Announcement', message: announcement }),
            });
            setAnnounceSent(true);
            setAnnouncement('');
            setTimeout(() => setAnnounceSent(false), 3000);
        } catch (err) {
            console.error('Failed to send announcement:', err);
        }
    };

    const updateRole = async (userId, newRole) => {
        try {
            await apiFetch(`/admin/users/${userId}/role`, {
                method: 'PUT',
                body: JSON.stringify({ role: newRole }),
            });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            console.error('Failed to update role:', err);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="animate-fade-in">
            <Navbar title="Admin Panel" subtitle="Manage users, content, and platform settings" />

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {[
                    { key: 'overview', label: '📊 Overview' },
                    { key: 'users', label: '👥 Users' },
                    { key: 'announce', label: '📢 Announcements' },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.key ? 'bg-cyan/20 text-cyan border border-cyan/30' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Overview */}
            {tab === 'overview' && (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { icon: '👥', label: 'Total Users', value: stats?.total_users || users.length, color: 'text-cyan' },
                            { icon: '📚', label: 'Courses', value: stats?.total_courses || 0, color: 'text-amber' },
                            { icon: '📝', label: 'Tests', value: stats?.total_tests || 0, color: 'text-emerald-400' },
                            { icon: '🎯', label: 'Attempts', value: stats?.total_attempts || 0, color: 'text-purple-400' },
                        ].map((s, i) => (
                            <GlassCard key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-white/40 mb-1">{s.label}</p>
                                        <p className={`text-2xl font-sora font-bold ${s.color}`}>{s.value}</p>
                                    </div>
                                    <span className="text-3xl">{s.icon}</span>
                                </div>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Recent users */}
                    <GlassCard>
                        <h3 className="text-sm font-sora font-semibold mb-4">Recent Users</h3>
                        <div className="space-y-2">
                            {users.slice(0, 10).map(u => (
                                <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan/30 to-cyan/10 flex items-center justify-center text-xs font-bold">
                                            {u.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{u.name}</p>
                                            <p className="text-[10px] text-white/25">{u.email}</p>
                                        </div>
                                    </div>
                                    <span className={`badge-pill text-[10px] ${u.role === 'admin' ? 'bg-red-500/10 text-red-300' :
                                            u.role === 'instructor' ? 'bg-amber/10 text-amber' :
                                                'bg-cyan/10 text-cyan'
                                        }`}>{u.role}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Users management */}
            {tab === 'users' && (
                <GlassCard>
                    <h3 className="text-sm font-sora font-semibold mb-4">User Management ({users.length} users)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                                    <th className="pb-3 pr-4">User</th>
                                    <th className="pb-3 pr-4">Email</th>
                                    <th className="pb-3 pr-4">Role</th>
                                    <th className="pb-3 pr-4">Streak</th>
                                    <th className="pb-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                                                    {u.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <span className="text-sm">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4 text-sm text-white/40">{u.email}</td>
                                        <td className="py-3 pr-4">
                                            <select
                                                value={u.role}
                                                onChange={(e) => updateRole(u.id, e.target.value)}
                                                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan/50"
                                            >
                                                <option value="student">Student</option>
                                                <option value="instructor">Instructor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="py-3 pr-4 text-sm text-white/40">🔥 {u.streak || 0}</td>
                                        <td className="py-3">
                                            <span className="text-[10px] text-white/20">
                                                Joined {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            )}

            {/* Announcements */}
            {tab === 'announce' && (
                <GlassCard>
                    <h3 className="text-sm font-sora font-semibold mb-4">📢 Send Announcement</h3>
                    <textarea
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        className="input-field min-h-[120px] mb-4 resize-none"
                        placeholder="Type your announcement message..."
                    />
                    <div className="flex items-center gap-3">
                        <button onClick={sendAnnouncement} className="btn-primary !py-2.5 !px-5 text-sm">
                            📢 Send to All Users
                        </button>
                        {announceSent && (
                            <span className="text-emerald-400 text-sm animate-bounce-in">✅ Sent!</span>
                        )}
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
