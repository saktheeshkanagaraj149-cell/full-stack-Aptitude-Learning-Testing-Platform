import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import ProgressRing from '../components/ProgressRing';
import Badge from '../components/Badge';

export default function Profile() {
    const { user, apiFetch, fetchUser } = useAuth();
    const [stats, setStats] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(user?.name || '');

    useEffect(() => { loadProfile(); }, []);

    const loadProfile = async () => {
        try {
            const [statsData, attemptsData] = await Promise.all([
                apiFetch('/analytics/my-stats').catch(() => null),
                apiFetch('/attempts/my/list').catch(() => []),
            ]);
            setStats(statsData);
            setAttempts(Array.isArray(attemptsData) ? attemptsData : []);
            // Generate some badges based on stats
            const earnedBadges = [];
            if (attemptsData?.length > 0) earnedBadges.push({ name: 'First Test', type: 'first-test', tier: 'bronze', earned: true, description: 'Completed your first test' });
            if ((user?.streak || 0) >= 7) earnedBadges.push({ name: '7-Day Streak', type: 'streak-7', tier: 'silver', earned: true, description: '7 consecutive days of learning' });
            if (attemptsData?.some(a => a.percentage >= 100)) earnedBadges.push({ name: 'Perfect Score', type: 'perfect-score', tier: 'gold', earned: true, description: 'Scored 100% on a test' });
            // Unearned badges
            earnedBadges.push({ name: '30-Day Streak', type: 'streak-30', tier: 'gold', earned: (user?.streak || 0) >= 30, description: '30 consecutive days' });
            earnedBadges.push({ name: 'Speed Demon', type: 'speed-demon', tier: 'silver', earned: false, description: 'Complete a test in under half time' });
            earnedBadges.push({ name: 'Top 10', type: 'top-10', tier: 'platinum', earned: false, description: 'Reach top 10 on the leaderboard' });
            setBadges(earnedBadges);
        } catch (err) {
            console.error('Profile load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await apiFetch('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify({ name }),
            });
            await fetchUser();
            setEditMode(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="animate-fade-in">
            <Navbar title="My Profile" subtitle="Track your progress and achievements" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile card */}
                <GlassCard className="lg:col-span-1 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-transparent"></div>
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber to-amber-700 flex items-center justify-center text-navy-900 font-bold text-3xl font-sora mx-auto mb-4">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        {editMode ? (
                            <div className="space-y-3 mb-4">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field text-center"
                                />
                                <div className="flex gap-2 justify-center">
                                    <button onClick={handleSave} className="btn-primary !py-2 !px-4 text-xs">Save</button>
                                    <button onClick={() => setEditMode(false)} className="btn-secondary !py-2 !px-4 text-xs">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-sora font-bold mb-1">{user?.name}</h2>
                                <p className="text-sm text-white/40 mb-1">{user?.email}</p>
                                <span className="badge-pill bg-cyan/10 text-cyan capitalize mb-4 inline-block">{user?.role}</span>
                                <button onClick={() => setEditMode(true)} className="block mx-auto text-xs text-white/30 hover:text-white/50 transition-colors mt-2">
                                    ✏️ Edit Profile
                                </button>
                            </>
                        )}

                        <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-lg font-sora font-bold text-cyan">{stats?.total_tests || 0}</p>
                                <p className="text-[10px] text-white/30">Tests</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-sora font-bold text-amber">{user?.streak || 0}</p>
                                <p className="text-[10px] text-white/30">Streak</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-sora font-bold text-emerald-400">{(stats?.overall_accuracy || 0).toFixed(0)}%</p>
                                <p className="text-[10px] text-white/30">Accuracy</p>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Stats & badges */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Performance */}
                    <GlassCard>
                        <h3 className="text-sm font-sora font-semibold text-cyan mb-4">📊 Performance Overview</h3>
                        <div className="flex items-center gap-8">
                            <ProgressRing progress={stats?.overall_accuracy || 0} size={100} strokeWidth={8} />
                            <div className="flex-1 space-y-3">
                                {(stats?.section_stats || [
                                    { section: 'Quantitative', accuracy: 0 },
                                    { section: 'Logical', accuracy: 0 },
                                    { section: 'Verbal', accuracy: 0 },
                                ]).map((s, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-white/60">{s.section || s.category}</span>
                                            <span className="text-white/40">{(s.accuracy || 0).toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full bg-gradient-to-r from-cyan to-cyan-400 transition-all duration-1000" style={{ width: `${s.accuracy || 0}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GlassCard>

                    {/* Badges */}
                    <GlassCard>
                        <h3 className="text-sm font-sora font-semibold text-amber mb-4">🏅 Achievements</h3>
                        <div className="flex flex-wrap gap-4">
                            {badges.map((b, i) => (
                                <Badge key={i} {...b} />
                            ))}
                        </div>
                        {badges.length === 0 && (
                            <p className="text-sm text-white/20">No badges earned yet. Take some tests to start earning!</p>
                        )}
                    </GlassCard>

                    {/* Recent tests */}
                    <GlassCard>
                        <h3 className="text-sm font-sora font-semibold mb-4">📝 Recent Tests</h3>
                        <div className="space-y-2">
                            {attempts.slice(0, 8).map((a, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                    <div>
                                        <p className="text-sm font-medium">{a.test_title || 'Test'}</p>
                                        <p className="text-[10px] text-white/25">
                                            {a.submitted_at ? new Date(a.submitted_at).toLocaleDateString() : 'In progress'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-sm font-sora font-bold ${(a.percentage || 0) >= 80 ? 'text-emerald-400' :
                                                (a.percentage || 0) >= 50 ? 'text-amber' : 'text-red-400'
                                            }`}>
                                            {(a.percentage || 0).toFixed(0)}%
                                        </span>
                                        <p className="text-[10px] text-white/25">{a.score}/{a.total_marks}</p>
                                    </div>
                                </div>
                            ))}
                            {attempts.length === 0 && (
                                <p className="text-sm text-white/20 text-center py-4">No test attempts yet.</p>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
