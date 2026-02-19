import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';

export default function TestsPage() {
    const { apiFetch } = useAuth();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { loadTests(); }, []);

    const loadTests = async () => {
        try {
            const data = await apiFetch('/tests');
            setTests(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load tests:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = tests.filter(t =>
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.course_title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <Navbar title="Tests" subtitle="Take tests and track your progress" />

            {/* Search */}
            <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field !pl-11"
                    placeholder="Search tests..."
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((test, i) => (
                        <GlassCard key={test.id} hover className="animate-slide-up flex flex-col" style={{ animationDelay: `${i * 60}ms` }}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl">📝</span>
                                <span className="badge-pill bg-cyan/10 text-cyan text-[10px]">
                                    {test.question_count || 0} Questions
                                </span>
                            </div>
                            <h3 className="text-sm font-sora font-semibold mb-1 line-clamp-2">{test.title}</h3>
                            <p className="text-xs text-white/40 line-clamp-2 mb-4 flex-1">{test.description}</p>

                            {/* Test meta */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="badge-pill bg-white/5 text-white/50 text-[10px]">⏱️ {test.time_limit_minutes || 30} min</span>
                                <span className="badge-pill bg-white/5 text-white/50 text-[10px]">📊 {test.total_marks || 0} marks</span>
                                {test.negative_marking > 0 && (
                                    <span className="badge-pill bg-amber/10 text-amber text-[10px]">⚠️ -{test.negative_marking}</span>
                                )}
                            </div>

                            {test.course_title && (
                                <p className="text-[10px] text-white/25 mb-3">📚 {test.course_title}</p>
                            )}

                            {/* Stats */}
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <span className="text-[10px] text-white/25">
                                    {test.attempt_count || 0} attempts
                                </span>
                                <Link to={`/tests/${test.id}/instructions`} className="btn-primary !py-2 !px-4 text-xs">
                                    Start Test →
                                </Link>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-4xl mb-4">📝</p>
                    <p className="text-white/40">{search ? 'No tests match your search.' : 'No tests available yet.'}</p>
                </div>
            )}
        </div>
    );
}
