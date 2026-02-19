import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/GlassCard';
import QuestionPalette from '../components/QuestionPalette';
import Calculator from '../components/Calculator';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function TestTaking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { apiFetch } = useAuth();

    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [attemptId, setAttemptId] = useState(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [flagged, setFlagged] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showCalc, setShowCalc] = useState(false);
    const [warnings, setWarnings] = useState(0);
    const [warningMsg, setWarningMsg] = useState('');
    const maxWarnings = 3;
    const timerRef = useRef(null);
    const startTimeRef = useRef(Date.now());

    // Start test attempt
    useEffect(() => {
        startAttempt();
        return () => clearInterval(timerRef.current);
    }, []);

    const startAttempt = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/attempts/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('aptiq_token')}`,
                },
                body: JSON.stringify({ test_id: id }),
            });
            const data = await res.json();

            if (res.status === 409 && data.attempt_id) {
                // Existing attempt — abandon it and retry
                await fetch(`${API_BASE}/api/attempts/${data.attempt_id}/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('aptiq_token')}`,
                    },
                    body: JSON.stringify({ answers: {}, time_taken_seconds: 0 }),
                });
                // Retry starting fresh
                const res2 = await fetch(`${API_BASE}/api/attempts/start`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('aptiq_token')}`,
                    },
                    body: JSON.stringify({ test_id: id }),
                });
                const data2 = await res2.json();
                if (res2.ok) {
                    setTest(data2.test);
                    setQuestions(data2.questions || []);
                    setAttemptId(data2.attempt?.id);
                    setTimeLeft((data2.test?.time_limit_minutes || 5) * 60);
                    startTimeRef.current = Date.now();
                }
            } else if (res.ok) {
                setTest(data.test);
                setQuestions(data.questions || []);
                setAttemptId(data.attempt?.id);
                setTimeLeft((data.test?.time_limit_minutes || 5) * 60);
                startTimeRef.current = Date.now();
            } else {
                console.error('Start attempt error:', data.error);
            }
        } catch (err) {
            console.error('Failed to start test:', err);
        } finally {
            setLoading(false);
        }
    };

    // Timer
    useEffect(() => {
        if (!test || timeLeft <= 0) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [test]);

    // Anti-cheat: visibility change
    useEffect(() => {
        const handleVisibility = () => {
            if (document.hidden) addWarning('Tab switch detected');
        };
        const handleBlur = () => addWarning('Window focus lost');
        const handleKeyDown = (e) => {
            // Block F12, Ctrl+Shift+I, Ctrl+U, Ctrl+C, Ctrl+V
            if (e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.key === 'u') ||
                (e.ctrlKey && e.key === 'c') ||
                (e.ctrlKey && e.key === 'v')) {
                e.preventDefault();
                addWarning('Blocked keyboard shortcut: ' + e.key);
            }
        };
        const handleContextMenu = (e) => { e.preventDefault(); };

        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('contextmenu', handleContextMenu);

        // Try fullscreen
        try { document.documentElement.requestFullscreen?.(); } catch { }

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('contextmenu', handleContextMenu);
            try { document.exitFullscreen?.(); } catch { }
        };
    }, []);

    const addWarning = useCallback(async (type) => {
        setWarnings(prev => {
            const newCount = prev + 1;
            setWarningMsg(`⚠️ Warning ${newCount}/${maxWarnings}: ${type}`);
            setTimeout(() => setWarningMsg(''), 3000);
            if (newCount >= maxWarnings) {
                handleSubmit(true);
            }
            return newCount;
        });
        if (attemptId) {
            try {
                await apiFetch(`/attempts/${attemptId}/warning`, {
                    method: 'PUT',
                    body: JSON.stringify({ type, details: type }),
                });
            } catch { }
        }
    }, [attemptId]);

    const selectAnswer = (questionIdx, answer) => {
        const q = questions[questionIdx];
        setAnswers(prev => ({ ...prev, [q.id]: answer }));
        // Save to server
        if (attemptId) {
            apiFetch(`/attempts/${attemptId}/answer`, {
                method: 'PUT',
                body: JSON.stringify({ question_id: q.id, answer }),
            }).catch(() => { });
        }
    };

    const toggleFlag = (idx) => {
        setFlagged(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    };

    const handleSubmit = async (auto = false) => {
        if (submitting) return;
        setSubmitting(true);
        clearInterval(timerRef.current);

        try {
            const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
            const result = await apiFetch(`/attempts/${attemptId}/submit`, {
                method: 'POST',
                body: JSON.stringify({
                    answers,
                    time_taken_seconds: timeTaken,
                }),
            });
            try { document.exitFullscreen?.(); } catch { }
            navigate(`/tests/${id}/results/${attemptId}`, { state: { result } });
        } catch (err) {
            console.error('Submit error:', err);
            setSubmitting(false);
        }
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-navy-900 flex items-center justify-center z-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/50">Loading test...</p>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIdx];
    const isUrgent = timeLeft < 300;

    return (
        <div className="fixed inset-0 bg-navy-950 z-50 flex flex-col select-none">
            {/* Warning banner */}
            {warningMsg && (
                <div className="absolute top-0 left-0 right-0 bg-red-500/90 text-white text-center py-2 text-sm font-medium z-50 animate-slide-up">
                    {warningMsg}
                </div>
            )}

            {/* Top bar */}
            <header className="flex items-center justify-between px-6 py-3 bg-navy-900/80 backdrop-blur border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-cyan-700 flex items-center justify-center text-navy-900 font-bold text-xs font-sora">IQ</div>
                    <div>
                        <h1 className="text-sm font-sora font-semibold">{test?.title || 'Test'}</h1>
                        <p className="text-[10px] text-white/30">Question {currentIdx + 1} of {questions.length}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-xl font-sora font-bold text-lg ${isUrgent ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-cyan'
                        }`}>
                        ⏱️ {formatTime(timeLeft)}
                    </div>
                    <button onClick={() => setShowCalc(!showCalc)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-lg" title="Calculator">
                        🧮
                    </button>
                    {warnings > 0 && (
                        <div className="badge-pill bg-red-500/20 text-red-300">
                            ⚠️ {warnings}/{maxWarnings}
                        </div>
                    )}
                </div>
            </header>

            {/* Main content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Question area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {currentQ ? (
                        <div className="max-w-3xl mx-auto animate-fade-in" key={currentIdx}>
                            {/* Question header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-cyan/10 text-cyan flex items-center justify-center text-sm font-sora font-bold">
                                        {currentIdx + 1}
                                    </span>
                                    {currentQ.section && (
                                        <span className="badge-pill bg-white/5 text-white/40">{currentQ.section}</span>
                                    )}
                                    {currentQ.marks && (
                                        <span className="badge-pill bg-amber/10 text-amber">{currentQ.marks} marks</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => toggleFlag(currentIdx)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${flagged.includes(currentIdx) ? 'bg-amber/20 text-amber' : 'bg-white/5 text-white/40 hover:bg-white/10'
                                        }`}
                                >
                                    {flagged.includes(currentIdx) ? '🚩 Flagged' : '🏳️ Flag'}
                                </button>
                            </div>

                            {/* Question text */}
                            <div className="text-lg text-white/90 mb-8 leading-relaxed">
                                {currentQ.question_text}
                            </div>

                            {/* Options */}
                            {currentQ.question_type === 'mcq' && currentQ.options && (
                                <div className="space-y-3">
                                    {(Array.isArray(currentQ.options) ? currentQ.options : []).map((opt, oi) => {
                                        const optLetter = String.fromCharCode(65 + oi);
                                        const isSelected = answers[currentQ.id] === optLetter;
                                        return (
                                            <button
                                                key={oi}
                                                onClick={() => selectAnswer(currentIdx, optLetter)}
                                                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${isSelected
                                                    ? 'bg-cyan/10 border-cyan/40 text-white shadow-lg shadow-cyan/5'
                                                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${isSelected ? 'bg-cyan text-navy-900' : 'bg-white/10 text-white/50'
                                                    }`}>
                                                    {optLetter}
                                                </span>
                                                <span>{typeof opt === 'object' ? opt.text : opt}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Text input for non-MCQ */}
                            {currentQ.question_type !== 'mcq' && (
                                <input
                                    type="text"
                                    value={answers[currentQ.id] || ''}
                                    onChange={(e) => selectAnswer(currentIdx, e.target.value)}
                                    className="input-field text-lg"
                                    placeholder="Type your answer..."
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-white/30">No questions available</div>
                    )}

                    {/* Navigation */}
                    <div className="max-w-3xl mx-auto flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                        <button
                            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                            disabled={currentIdx === 0}
                            className="btn-secondary !py-2.5 !px-5 text-sm disabled:opacity-30"
                        >
                            ← Previous
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    const newAnswers = { ...answers };
                                    delete newAnswers[currentQ?.id];
                                    setAnswers(newAnswers);
                                }}
                                className="btn-danger !py-2.5 !px-4 text-xs"
                            >
                                Clear
                            </button>
                        </div>
                        {currentIdx < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentIdx(currentIdx + 1)}
                                className="btn-primary !py-2.5 !px-5 text-sm"
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                onClick={() => handleSubmit(false)}
                                disabled={submitting}
                                className="btn-amber !py-2.5 !px-6 text-sm"
                            >
                                {submitting ? 'Submitting...' : '✅ Submit Test'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Right sidebar - palette */}
                <aside className="w-64 border-l border-white/5 bg-navy-900/50 p-4 overflow-y-auto hidden lg:block">
                    <QuestionPalette
                        questions={questions}
                        currentIndex={currentIdx}
                        answers={answers}
                        flagged={flagged}
                        onSelect={setCurrentIdx}
                    />
                    <div className="mt-4">
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={submitting}
                            className="btn-amber w-full !py-3 text-sm text-center"
                        >
                            {submitting ? 'Submitting...' : '✅ Submit Test'}
                        </button>
                    </div>
                </aside>
            </div>

            {/* Calculator overlay */}
            {showCalc && (
                <div className="fixed bottom-20 right-6 z-50">
                    <Calculator onClose={() => setShowCalc(false)} />
                </div>
            )}
        </div>
    );
}
