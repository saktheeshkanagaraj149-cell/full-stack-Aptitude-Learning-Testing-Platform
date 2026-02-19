import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/GlassCard';
import ScoreReveal from '../components/ScoreReveal';
import ConfettiEffect from '../components/ConfettiEffect';

export default function Results() {
    const { id, attemptId } = useParams();
    const location = useLocation();
    const { apiFetch } = useAuth();
    const [result, setResult] = useState(location.state?.result || null);
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(!result);
    const [showReview, setShowReview] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [loadingReview, setLoadingReview] = useState(false);

    useEffect(() => {
        if (!result) loadResult();
        else if (result.percentage >= 70) setShowConfetti(true);
    }, []);

    const loadResult = async () => {
        try {
            const data = await apiFetch(`/attempts/${attemptId}/review`);
            setResult({
                score: data.attempt?.score || 0,
                total_marks: data.attempt?.total_marks || 0,
                percentage: data.attempt?.percentage || 0,
                breakdown: data.attempt?.breakdown || {},
            });
            setReview(data);
            if ((data.attempt?.percentage || 0) >= 70) setShowConfetti(true);
        } catch (err) {
            console.error('Failed to load results:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadReview = async () => {
        if (review) { setShowReview(true); return; }
        setLoadingReview(true);
        try {
            const data = await apiFetch(`/attempts/${attemptId}/review`);
            setReview(data);
            setShowReview(true);
        } catch (err) {
            console.error('Failed to load review:', err);
        } finally {
            setLoadingReview(false);
        }
    };

    // Helper: normalize answer for comparison display
    const getAnswerDisplay = (answer) => {
        if (answer === null || answer === undefined) return null;
        if (typeof answer === 'string') return answer;
        if (typeof answer === 'object') return JSON.stringify(answer);
        return String(answer);
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <ConfettiEffect active={showConfetti} />

            {/* Score reveal */}
            <GlassCard className="mb-8 py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-amber/5"></div>
                <div className="relative">
                    <ScoreReveal
                        score={result?.score || 0}
                        total={result?.total_marks || 0}
                        percentage={result?.percentage || 0}
                    />
                </div>
            </GlassCard>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Score', value: `${result?.score || 0}/${result?.total_marks || 0}`, icon: '📊', color: 'text-cyan' },
                    { label: 'Percentage', value: `${(result?.percentage || 0).toFixed(1)}%`, icon: '🎯', color: 'text-amber' },
                    { label: 'Questions', value: result?.total_questions || review?.questions?.length || '–', icon: '❓', color: 'text-purple-400' },
                    { label: 'Answered', value: result?.answered || '–', icon: '✍️', color: 'text-emerald-400' },
                ].map((s, i) => (
                    <GlassCard key={i} className="text-center !py-4">
                        <p className="text-xl mb-1">{s.icon}</p>
                        <p className={`text-lg font-sora font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-[10px] text-white/30">{s.label}</p>
                    </GlassCard>
                ))}
            </div>

            {/* Section breakdown */}
            {result?.breakdown && Object.keys(result.breakdown).length > 0 && (
                <GlassCard className="mb-6">
                    <h3 className="text-sm font-sora font-semibold text-cyan mb-4">📊 Section Breakdown</h3>
                    <div className="space-y-4">
                        {Object.entries(result.breakdown).map(([section, data]) => {
                            const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
                            return (
                                <div key={section}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-white/70 capitalize">{section}</span>
                                        <span className="text-xs text-white/40">
                                            {data.correct}/{data.total} correct • {accuracy.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${accuracy >= 80 ? 'bg-emerald-400' :
                                                    accuracy >= 50 ? 'bg-amber' : 'bg-red-400'
                                                }`}
                                            style={{ width: `${accuracy}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
                <button onClick={loadReview} disabled={loadingReview} className="btn-primary text-sm">
                    {loadingReview ? '⏳ Loading...' : showReview ? '📝 Hide Answers' : '📝 View Correct Answers'}
                </button>
                <Link to="/leaderboard" className="btn-secondary text-sm">
                    🏆 View Leaderboard
                </Link>
                <Link to="/tests" className="btn-secondary text-sm">
                    📝 More Tests
                </Link>
                <Link to="/dashboard" className="btn-secondary text-sm">
                    📊 Dashboard
                </Link>
            </div>

            {/* Detailed answer review */}
            {showReview && review?.questions && (
                <div className="space-y-4 mb-8">
                    <h3 className="text-lg font-sora font-semibold flex items-center gap-2">
                        📋 Answer Review
                        <span className="text-xs text-white/30 font-normal">({review.questions.length} questions)</span>
                    </h3>
                    {review.questions.map((q, i) => {
                        const studentAns = getAnswerDisplay(q.student_answer);
                        const correctAns = getAnswerDisplay(q.correct_answer);

                        return (
                            <GlassCard key={i} className={`!p-5 border-l-4 ${q.is_correct ? 'border-l-emerald-400' : studentAns ? 'border-l-red-400' : 'border-l-white/10'
                                }`}>
                                {/* Question header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                        {q.section && <span className="badge-pill bg-white/5 text-white/40 text-[10px]">{q.section}</span>}
                                        <span className="badge-pill bg-white/5 text-white/30 text-[10px]">{q.marks} marks</span>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${q.is_correct ? 'bg-emerald-500/10 text-emerald-400' :
                                            studentAns ? 'bg-red-500/10 text-red-400' :
                                                'bg-white/5 text-white/20'
                                        }`}>
                                        {q.is_correct ? '✅ Correct' : studentAns ? '❌ Wrong' : '⏭ Skipped'}
                                    </span>
                                </div>

                                {/* Question text */}
                                <p className="text-sm text-white/80 mb-4 leading-relaxed">{q.question_text}</p>

                                {/* Options with answer highlighting */}
                                {q.options && Array.isArray(q.options) && q.options.length > 0 && (
                                    <div className="space-y-2 mb-4">
                                        {q.options.map((opt, oi) => {
                                            const optText = typeof opt === 'object' ? opt.text : String(opt);
                                            const optLetter = String.fromCharCode(65 + oi);
                                            const isCorrectOption = optText === correctAns || optLetter === correctAns;
                                            const isStudentPick = optText === studentAns || optLetter === studentAns;

                                            let bgClass = 'bg-white/5 text-white/40';
                                            let icon = '';

                                            if (isCorrectOption && isStudentPick) {
                                                bgClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
                                                icon = '✅';
                                            } else if (isCorrectOption) {
                                                bgClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
                                                icon = '✅ Correct Answer';
                                            } else if (isStudentPick) {
                                                bgClass = 'bg-red-500/10 text-red-400 border border-red-500/30';
                                                icon = '❌ Your Answer';
                                            }

                                            return (
                                                <div key={oi} className={`flex items-center gap-3 p-3 rounded-xl text-sm ${bgClass}`}>
                                                    <span className="font-bold text-xs w-6 shrink-0">{optLetter}.</span>
                                                    <span className="flex-1">{optText}</span>
                                                    {icon && <span className="text-xs shrink-0">{icon}</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Your answer / correct answer summary (for non-MCQ or fallback) */}
                                {(!q.options || q.options.length === 0) && (
                                    <div className="space-y-2 mb-4">
                                        <div className="flex gap-2 text-sm">
                                            <span className="text-white/30">Your answer:</span>
                                            <span className={studentAns ? 'text-white/70' : 'text-white/20 italic'}>{studentAns || 'Not answered'}</span>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <span className="text-white/30">Correct answer:</span>
                                            <span className="text-emerald-400 font-medium">{correctAns}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Explanation */}
                                {q.explanation && (
                                    <div className="bg-cyan/5 border border-cyan/10 rounded-xl p-3 mt-2">
                                        <p className="text-xs text-cyan/70 font-semibold mb-1">💡 Explanation:</p>
                                        <p className="text-xs text-white/50 leading-relaxed">{q.explanation}</p>
                                    </div>
                                )}
                            </GlassCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
