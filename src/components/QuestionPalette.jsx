export default function QuestionPalette({ questions = [], currentIndex, answers = {}, flagged = [], onSelect }) {
    const getStatus = (idx) => {
        if (idx === currentIndex) return 'current';
        if (flagged.includes(idx)) return 'flagged';
        if (answers[idx] !== undefined && answers[idx] !== null) return 'answered';
        if (idx < currentIndex) return 'visited';
        return 'not-visited';
    };

    const statusColors = {
        current: 'bg-cyan text-navy-900 ring-2 ring-cyan/50 shadow-lg shadow-cyan/20',
        answered: 'bg-emerald-500/80 text-white',
        flagged: 'bg-amber/80 text-navy-900',
        visited: 'bg-white/20 text-white',
        'not-visited': 'bg-white/5 text-white/50 border border-white/10',
    };

    const answered = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== null).length;
    const flaggedCount = flagged.length;

    return (
        <div className="glass-card p-4">
            <h3 className="text-sm font-sora font-semibold text-cyan mb-3">Question Palette</h3>
            <div className="grid grid-cols-5 gap-2 mb-4">
                {questions.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelect(idx)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold transition-all hover:scale-110 active:scale-90 ${statusColors[getStatus(idx)]}`}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>
            <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-cyan inline-block"></span>
                    <span className="text-white/60">Current</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-emerald-500/80 inline-block"></span>
                    <span className="text-white/60">Answered ({answered})</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-amber/80 inline-block"></span>
                    <span className="text-white/60">Flagged ({flaggedCount})</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-white/20 inline-block"></span>
                    <span className="text-white/60">Visited</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded border border-white/10 inline-block"></span>
                    <span className="text-white/60">Not Visited</span>
                </div>
            </div>
        </div>
    );
}
