import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';

export default function InstructorDashboard() {
    const { user, apiFetch } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('courses');
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ title: '', category: 'Quantitative Aptitude', description: '', difficulty: 'beginner' });
    const [creating, setCreating] = useState(false);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const data = await apiFetch('/courses');
            setCourses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const createCourse = async () => {
        if (!form.title.trim()) return;
        setCreating(true);
        try {
            const newCourse = await apiFetch('/courses', {
                method: 'POST',
                body: JSON.stringify(form),
            });
            setCourses(prev => [newCourse, ...prev]);
            setShowCreate(false);
            setForm({ title: '', category: 'Quantitative Aptitude', description: '', difficulty: 'beginner' });
        } catch (err) {
            console.error('Failed to create course:', err);
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="animate-fade-in">
            <Navbar title="Instructor Panel" subtitle={`Welcome, ${user?.name || 'Instructor'}`} />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                    { icon: '📚', label: 'My Courses', value: courses.length, color: 'text-cyan' },
                    { icon: '📝', label: 'Total Chapters', value: courses.reduce((t, c) => t + (c.chapter_count || 0), 0), color: 'text-amber' },
                    { icon: '🎓', label: 'Total Lessons', value: courses.reduce((t, c) => t + (c.lesson_count || 0), 0), color: 'text-emerald-400' },
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

            {/* Action bar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    {[
                        { key: 'courses', label: '📚 Courses' },
                        { key: 'create', label: '➕ Create' },
                    ].map(t => (
                        <button
                            key={t.key}
                            onClick={() => { setTab(t.key); if (t.key === 'create') setShowCreate(true); }}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.key ? 'bg-cyan/20 text-cyan border border-cyan/30' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Create course form */}
            {showCreate && (
                <GlassCard className="mb-6 animate-scale-in">
                    <h3 className="text-sm font-sora font-semibold text-cyan mb-4">➕ Create New Course</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs text-white/40 mb-1">Title</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="input-field"
                                placeholder="Course title..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-white/40 mb-1">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="input-field"
                            >
                                <option>Quantitative Aptitude</option>
                                <option>Logical Reasoning</option>
                                <option>Verbal Ability</option>
                                <option>Data Interpretation</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs text-white/40 mb-1">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="input-field min-h-[80px] resize-none"
                                placeholder="Course description..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-white/40 mb-1">Difficulty</label>
                            <select
                                value={form.difficulty}
                                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                                className="input-field"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={createCourse} disabled={creating} className="btn-primary !py-2.5 !px-5 text-sm">
                            {creating ? 'Creating...' : '✅ Create Course'}
                        </button>
                        <button onClick={() => setShowCreate(false)} className="btn-secondary !py-2.5 !px-4 text-sm">Cancel</button>
                    </div>
                </GlassCard>
            )}

            {/* Courses list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course, i) => (
                    <GlassCard key={course.id} hover className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className="flex items-start justify-between mb-3">
                            <span className={`badge-pill text-[10px] ${course.is_published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                                {course.is_published ? '🟢 Published' : '📝 Draft'}
                            </span>
                            <span className="text-xs text-white/20">{course.chapter_count || 0} ch</span>
                        </div>
                        <h3 className="text-sm font-sora font-semibold mb-1 line-clamp-1">{course.title}</h3>
                        <p className="text-xs text-white/40 line-clamp-2 mb-3">{course.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="badge-pill bg-amber/10 text-amber text-[10px]">{course.category}</span>
                            <span className="text-[10px] text-white/20">{course.difficulty}</span>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {courses.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-4xl mb-4">📚</p>
                    <p className="text-white/40 mb-4">No courses yet. Create your first course!</p>
                    <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">➕ Create Course</button>
                </div>
            )}
        </div>
    );
}
