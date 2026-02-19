import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import ProgressRing from '../components/ProgressRing';

export default function StudentDashboard() {
    const { user, apiFetch } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentCourses, setRecentCourses] = useState([]);
    const [recentAttempts, setRecentAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [statsData, coursesData] = await Promise.all([
                apiFetch('/analytics/my-stats').catch(() => null),
                apiFetch('/courses').catch(() => []),
            ]);
            setStats(statsData);
            setRecentCourses(Array.isArray(coursesData) ? coursesData.slice(0, 4) : []);
            // Try to get recent attempts
            try {
                const attempts = await apiFetch('/attempts/history');
                setRecentAttempts(Array.isArray(attempts) ? attempts.slice(0, 5) : []);
            } catch { setRecentAttempts([]); }
        } catch (err) {
            console.error('Dashboard load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const overallAccuracy = stats?.overall_accuracy || 0;
    const testsCompleted = stats?.total_tests || 0;
    const avgScore = stats?.avg_score || 0;

    return (
        <div className="animate-fade-in">
            <Navbar
                title={`${greeting()}, ${user?.name?.split(' ')[0] || 'Student'} 👋`}
                subtitle="Here's your learning progress overview"
            />

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { icon: '🎯', label: 'Tests Taken', value: testsCompleted, color: 'text-cyan' },
                    { icon: '📊', label: 'Avg Score', value: `${avgScore.toFixed(1)}%`, color: 'text-amber' },
                    { icon: '✅', label: 'Accuracy', value: `${overallAccuracy.toFixed(1)}%`, color: 'text-emerald-400' },
                    { icon: '🔥', label: 'Streak', value: `${user?.streak || 0} days`, color: 'text-orange-400' },
                ].map((stat, i) => (
                    <GlassCard key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/40 mb-1">{stat.label}</p>
                                <p className={`text-2xl font-sora font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                            <span className="text-3xl">{stat.icon}</span>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Progress overview */}
                <GlassCard className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-sora font-semibold">Overall Progress</h2>
                        <Link to="/courses" className="text-xs text-cyan hover:text-cyan-300 transition-colors">View All →</Link>
                    </div>
                    <div className="flex items-center gap-8 mb-6">
                        <ProgressRing progress={overallAccuracy} size={100} strokeWidth={8} />
                        <div className="flex-1">
                            <p className="text-sm text-white/50 mb-3">Your section-wise performance</p>
                            <div className="space-y-3">
                                {(stats?.section_stats || [
                                    { section: 'Quantitative', accuracy: 0 },
                                    { section: 'Logical', accuracy: 0 },
                                    { section: 'Verbal', accuracy: 0 },
                                ]).slice(0, 4).map((s, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-white/60">{s.section || s.category || `Section ${i + 1}`}</span>
                                            <span className="text-white/40">{(s.accuracy || 0).toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-cyan to-cyan-400 transition-all duration-1000"
                                                style={{ width: `${s.accuracy || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Quick actions */}
                <GlassCard>
                    <h2 className="text-lg font-sora font-semibold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link to="/courses" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-cyan/10 border border-white/5 hover:border-cyan/20 transition-all group">
                            <span className="text-2xl">📚</span>
                            <div>
                                <p className="text-sm font-medium group-hover:text-cyan transition-colors">Browse Courses</p>
                                <p className="text-[11px] text-white/30">Explore all categories</p>
                            </div>
                        </Link>
                        <Link to="/leaderboard" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-amber/10 border border-white/5 hover:border-amber/20 transition-all group">
                            <span className="text-2xl">🏆</span>
                            <div>
                                <p className="text-sm font-medium group-hover:text-amber transition-colors">Leaderboard</p>
                                <p className="text-[11px] text-white/30">Check your ranking</p>
                            </div>
                        </Link>
                        <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                            <span className="text-2xl">👤</span>
                            <div>
                                <p className="text-sm font-medium">My Profile</p>
                                <p className="text-[11px] text-white/30">View badges & stats</p>
                            </div>
                        </Link>
                    </div>
                </GlassCard>
            </div>

            {/* Recent courses */}
            {recentCourses.length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-sora font-semibold">Continue Learning</h2>
                        <Link to="/courses" className="text-xs text-cyan hover:text-cyan-300 transition-colors">See All →</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recentCourses.map(course => (
                            <Link key={course.id} to={`/courses/${course.id}`}>
                                <GlassCard hover className="!p-5 h-full">
                                    <div className="text-3xl mb-3">{course.icon || '📚'}</div>
                                    <h3 className="text-sm font-sora font-semibold mb-1 line-clamp-1">{course.title}</h3>
                                    <p className="text-xs text-white/40 line-clamp-2">{course.description}</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-cyan rounded-full" style={{ width: `${course.progress || 0}%` }}></div>
                                        </div>
                                        <span className="text-[10px] text-white/40">{course.progress || 0}%</span>
                                    </div>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent activity */}
            {recentAttempts.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-sora font-semibold mb-4">Recent Activity</h2>
                    <GlassCard>
                        <div className="space-y-3">
                            {recentAttempts.map((attempt, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{attempt.score >= 80 ? '🎉' : attempt.score >= 50 ? '👍' : '📝'}</span>
                                        <div>
                                            <p className="text-sm font-medium">{attempt.test_title || 'Test'}</p>
                                            <p className="text-[11px] text-white/30">
                                                {new Date(attempt.submitted_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-sora font-bold ${attempt.score >= 80 ? 'text-emerald-400' :
                                            attempt.score >= 50 ? 'text-amber' : 'text-red-400'
                                        }`}>
                                        {attempt.score}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
}
