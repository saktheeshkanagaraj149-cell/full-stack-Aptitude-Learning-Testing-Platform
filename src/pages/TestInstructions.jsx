import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';

export default function TestInstructions() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { apiFetch } = useAuth();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [agreed, setAgreed] = useState(false);
    const [starting, setStarting] = useState(false);

    useEffect(() => { loadTest(); }, [id]);

    const loadTest = async () => {
        try {
            const data = await apiFetch(`/tests/${id}`);
            setTest(data);
        } catch (err) {
            console.error('Failed to load test:', err);
        } finally {
            setLoading(false);
        }
    };

    const startTest = async () => {
        setStarting(true);
        try {
            navigate(`/tests/${id}/take`);
        } catch (err) {
            console.error('Failed to start test:', err);
            setStarting(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!test) {
        return <div className="text-center py-20"><p className="text-4xl mb-4">📝</p><p className="text-white/40">Test not found</p></div>;
    }

    return (
        <div className="animate-fade-in max-w-3xl mx-auto">
            <Navbar title="Test Instructions" subtitle={test.title} />

            <GlassCard className="mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent"></div>
                <div className="relative">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan/20 to-cyan/5 border border-cyan/20 flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse-glow">
                            📝
                        </div>
                        <h2 className="text-2xl font-sora font-bold mb-2">{test.title}</h2>
                        {test.description && <p className="text-white/40 text-sm">{test.description}</p>}
                    </div>

                    {/* Test info pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                        {[
                            { label: 'Duration', value: `${test.duration_minutes || 60} min`, icon: '⏱️' },
                            { label: 'Questions', value: test.total_questions || '–', icon: '❓' },
                            { label: 'Total Marks', value: test.total_marks || '–', icon: '📊' },
                            { label: 'Negative', value: test.negative_marking ? `-${test.negative_marking}` : 'None', icon: '⚠️' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                <p className="text-lg mb-1">{item.icon}</p>
                                <p className="text-sm font-sora font-bold text-white">{item.value}</p>
                                <p className="text-[10px] text-white/30">{item.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Instructions */}
                    <div className="space-y-4 mb-8">
                        <h3 className="text-sm font-sora font-semibold text-cyan">📋 Instructions</h3>
                        <div className="space-y-2 text-sm text-white/50">
                            {[
                                'Read each question carefully before selecting an answer.',
                                `This test has ${test.total_questions || 'multiple'} questions to be completed in ${test.duration_minutes || 60} minutes.`,
                                test.negative_marking ? `Negative marking of ${test.negative_marking} marks applies for wrong answers.` : 'There is no negative marking for this test.',
                                'You can flag questions to review later using the question palette.',
                                'The test will auto-submit when the timer runs out.',
                                'You can use the built-in calculator for quantitative questions.',
                            ].map((instruction, i) => (
                                <div key={i} className="flex gap-3">
                                    <span className="text-cyan text-xs mt-0.5">●</span>
                                    <p>{instruction}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Anti-cheat notice */}
                    <div className="bg-amber/5 border border-amber/20 rounded-xl p-4 mb-8">
                        <h3 className="text-sm font-sora font-semibold text-amber mb-2">🛡️ Anti-Cheat Protection</h3>
                        <div className="space-y-1.5 text-xs text-white/40">
                            <p>• The test will enter fullscreen mode. Exiting fullscreen counts as a warning.</p>
                            <p>• Switching tabs or windows will be detected and logged.</p>
                            <p>• Keyboard shortcuts (copy, paste, refresh, dev tools) are blocked.</p>
                            <p>• After <strong className="text-amber">3 warnings</strong>, the test will be auto-submitted.</p>
                        </div>
                    </div>

                    {/* Agreement checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer mb-6 group">
                        <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${agreed ? 'bg-cyan border-cyan text-navy-900' : 'border-white/20 group-hover:border-white/40'
                            }`}>
                            {agreed && <span className="text-xs font-bold">✓</span>}
                        </div>
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="hidden" />
                        <span className="text-sm text-white/50">
                            I have read the instructions and agree to the anti-cheat policies. I understand that violations will be logged.
                        </span>
                    </label>

                    {/* Start button */}
                    <button
                        onClick={startTest}
                        disabled={!agreed || starting}
                        className="btn-primary w-full !py-4 text-lg text-center"
                    >
                        {starting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2 border-navy-900 border-t-transparent rounded-full animate-spin"></span>
                                Preparing test...
                            </span>
                        ) : '🚀 Start Test'}
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
