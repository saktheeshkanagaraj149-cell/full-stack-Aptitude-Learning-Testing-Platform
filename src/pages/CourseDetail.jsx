import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';

export default function CourseDetail() {
    const { id } = useParams();
    const { apiFetch } = useAuth();
    const [course, setCourse] = useState(null);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedChapter, setExpandedChapter] = useState(null);

    useEffect(() => { loadCourse(); }, [id]);

    const loadCourse = async () => {
        try {
            const [data, testsData] = await Promise.all([
                apiFetch(`/courses/${id}`),
                apiFetch(`/tests?course_id=${id}`).catch(() => []),
            ]);
            setCourse(data);
            setTests(Array.isArray(testsData) ? testsData : []);
            if (data.chapters?.length) setExpandedChapter(data.chapters[0].id);
        } catch (err) {
            console.error('Failed to load course:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!course) {
        return <div className="text-center py-20"><p className="text-4xl mb-4">😕</p><p className="text-white/40">Course not found</p><Link to="/courses" className="text-cyan text-sm mt-4 inline-block">← Back to courses</Link></div>;
    }

    const totalLessons = (course.chapters || []).reduce((t, ch) => t + (ch.lessons?.length || 0), 0);

    return (
        <div className="animate-fade-in">
            <Navbar title={course.title} subtitle={`By ${course.instructor_name || 'AptIQ'}`} />

            {/* Course header */}
            <GlassCard className="mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan/5 to-amber/5"></div>
                <div className="relative flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="badge-pill bg-cyan/10 text-cyan">{course.category}</span>
                            <span className="badge-pill bg-amber/10 text-amber">{course.difficulty || 'Beginner'}</span>
                        </div>
                        <p className="text-white/50 mb-6 leading-relaxed">{course.description}</p>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-xl font-sora font-bold text-cyan">{(course.chapters || []).length}</p>
                                <p className="text-[11px] text-white/30">Chapters</p>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div className="text-center">
                                <p className="text-xl font-sora font-bold text-amber">{totalLessons}</p>
                                <p className="text-[11px] text-white/30">Lessons</p>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div className="text-center">
                                <p className="text-xl font-sora font-bold text-emerald-400">{course.test_count || 0}</p>
                                <p className="text-[11px] text-white/30">Tests</p>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Chapters accordion */}
            <h2 className="text-lg font-sora font-semibold mb-4">Course Content</h2>
            <div className="space-y-3">
                {(course.chapters || []).map((chapter, ci) => (
                    <GlassCard key={chapter.id} className="!p-0 overflow-hidden">
                        <button
                            onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                            className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-cyan/10 text-cyan flex items-center justify-center text-sm font-sora font-bold">
                                    {ci + 1}
                                </span>
                                <div>
                                    <h3 className="text-sm font-semibold">{chapter.title}</h3>
                                    <p className="text-[11px] text-white/30">{chapter.lessons?.length || 0} lessons</p>
                                </div>
                            </div>
                            <span className={`text-white/30 transition-transform ${expandedChapter === chapter.id ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </button>
                        {expandedChapter === chapter.id && (
                            <div className="border-t border-white/5 animate-slide-up">
                                {(chapter.lessons || []).map((lesson, li) => (
                                    <Link
                                        key={lesson.id}
                                        to={`/lessons/${lesson.id}`}
                                        className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <span className="text-lg">
                                            {lesson.type === 'video' ? '🎬' : lesson.type === 'quiz' ? '📝' : '📄'}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm truncate">{lesson.title}</p>
                                            <p className="text-[10px] text-white/25">
                                                {lesson.duration_minutes ? `${lesson.duration_minutes} min` : ''}
                                                {lesson.type ? ` • ${lesson.type}` : ''}
                                            </p>
                                        </div>
                                        <span className="text-white/20 text-xs">→</span>
                                    </Link>
                                ))}
                                {(!chapter.lessons || chapter.lessons.length === 0) && (
                                    <p className="px-5 py-4 text-sm text-white/20">No lessons yet</p>
                                )}
                            </div>
                        )}
                    </GlassCard>
                ))}
            </div>

            {(course.chapters || []).length === 0 && (
                <div className="text-center py-12">
                    <p className="text-3xl mb-2">📋</p>
                    <p className="text-white/30 text-sm">No chapters added to this course yet.</p>
                </div>
            )}

            {/* Tests section */}
            {tests.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-sora font-semibold mb-4">📝 Available Tests</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {tests.map((test, i) => (
                            <GlassCard key={test.id} hover className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">📝</span>
                                        <h3 className="text-sm font-sora font-semibold">{test.title}</h3>
                                    </div>
                                    <span className="badge-pill bg-cyan/10 text-cyan text-[10px]">
                                        {test.question_count || 0} Q
                                    </span>
                                </div>
                                {test.description && (
                                    <p className="text-xs text-white/40 mb-4 line-clamp-2">{test.description}</p>
                                )}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="badge-pill bg-white/5 text-white/50 text-[10px]">⏱️ {test.time_limit_minutes || 30} min</span>
                                    <span className="badge-pill bg-white/5 text-white/50 text-[10px]">📊 {test.total_marks || 0} marks</span>
                                    {test.negative_marking > 0 && (
                                        <span className="badge-pill bg-amber/10 text-amber text-[10px]">⚠️ Negative marking</span>
                                    )}
                                </div>
                                <Link to={`/tests/${test.id}/instructions`} className="btn-primary !py-2.5 !px-4 text-xs w-full text-center block">
                                    🚀 Start Test
                                </Link>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
