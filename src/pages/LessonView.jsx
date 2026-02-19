import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';

export default function LessonView() {
    const { id } = useParams();
    const { apiFetch } = useAuth();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);

    useEffect(() => { loadLesson(); }, [id]);

    const loadLesson = async () => {
        try {
            const data = await apiFetch(`/courses/lessons/${id}`);
            setLesson(data);
        } catch (err) {
            console.error('Failed to load lesson:', err);
        } finally {
            setLoading(false);
        }
    };

    const markComplete = async () => {
        try {
            await apiFetch('/progress/complete', {
                method: 'POST',
                body: JSON.stringify({ lesson_id: id }),
            });
            setCompleted(true);
        } catch (err) {
            console.error('Error marking complete:', err);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!lesson) {
        return <div className="text-center py-20"><p className="text-4xl mb-4">📄</p><p className="text-white/40">Lesson not found</p></div>;
    }

    return (
        <div className="animate-fade-in max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-white/30 mb-4">
                <Link to="/courses" className="hover:text-white/50 transition-colors">Courses</Link>
                <span>›</span>
                <Link to={`/courses/${lesson.course_id}`} className="hover:text-white/50 transition-colors">{lesson.chapter_title || 'Chapter'}</Link>
                <span>›</span>
                <span className="text-white/50">{lesson.title}</span>
            </div>

            <Navbar title={lesson.title} subtitle={`${lesson.chapter_title || ''} • ${lesson.duration_minutes || 10} min read`} />

            {/* Lesson content */}
            <GlassCard className="mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">
                        {lesson.type === 'video' ? '🎬' : lesson.type === 'quiz' ? '📝' : '📄'}
                    </span>
                    <span className="badge-pill bg-cyan/10 text-cyan capitalize">{lesson.type || 'text'}</span>
                    {lesson.duration_minutes && (
                        <span className="badge-pill bg-white/5 text-white/40">⏱️ {lesson.duration_minutes} min</span>
                    )}
                </div>

                {/* Video embed */}
                {lesson.type === 'video' && lesson.video_url && (
                    <div className="mb-6 rounded-xl overflow-hidden bg-navy-950 aspect-video flex items-center justify-center">
                        <iframe
                            src={lesson.video_url}
                            className="w-full h-full"
                            allowFullScreen
                            title={lesson.title}
                        />
                    </div>
                )}

                {/* Text content */}
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed whitespace-pre-wrap">
                    {lesson.content || 'No content available for this lesson yet.'}
                </div>
            </GlassCard>

            {/* Actions */}
            <div className="flex items-center justify-between">
                <div className="flex gap-3">
                    {lesson.prev_lesson_id && (
                        <Link to={`/lessons/${lesson.prev_lesson_id}`} className="btn-secondary !py-2.5 !px-4 text-sm">
                            ← {lesson.prev_lesson_title || 'Previous'}
                        </Link>
                    )}
                </div>
                <div className="flex gap-3 items-center">
                    {!completed ? (
                        <button onClick={markComplete} className="btn-primary !py-2.5 !px-5 text-sm">
                            ✅ Mark Complete
                        </button>
                    ) : (
                        <span className="text-emerald-400 text-sm font-medium animate-bounce-in">✅ Completed!</span>
                    )}
                    {lesson.next_lesson_id && (
                        <Link to={`/lessons/${lesson.next_lesson_id}`} className="btn-primary !py-2.5 !px-5 text-sm">
                            {lesson.next_lesson_title || 'Next'} →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
