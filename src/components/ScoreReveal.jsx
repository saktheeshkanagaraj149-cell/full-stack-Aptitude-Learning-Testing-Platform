import { useState, useEffect } from 'react';

export default function ScoreReveal({ score, total, percentage }) {
    const [displayScore, setDisplayScore] = useState(0);
    const [displayPct, setDisplayPct] = useState(0);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setRevealed(true), 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!revealed) return;
        const steps = 40;
        let step = 0;
        const interval = setInterval(() => {
            step++;
            const progress = step / steps;
            const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setDisplayScore(Math.round(ease * score));
            setDisplayPct(Math.round(ease * percentage));
            if (step >= steps) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, [revealed, score, percentage]);

    const getGrade = () => {
        if (percentage >= 90) return { letter: 'A+', color: 'text-emerald-400', glow: 'shadow-emerald-400/30' };
        if (percentage >= 80) return { letter: 'A', color: 'text-emerald-400', glow: 'shadow-emerald-400/20' };
        if (percentage >= 70) return { letter: 'B', color: 'text-cyan', glow: 'shadow-cyan/20' };
        if (percentage >= 60) return { letter: 'C', color: 'text-amber', glow: 'shadow-amber/20' };
        if (percentage >= 50) return { letter: 'D', color: 'text-amber-600', glow: 'shadow-amber-600/20' };
        return { letter: 'F', color: 'text-red-400', glow: 'shadow-red-400/20' };
    };

    const grade = getGrade();

    return (
        <div className={`text-center transition-all duration-700 ${revealed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-current ${grade.color} mb-6 shadow-2xl ${grade.glow}`}>
                <span className="text-5xl font-sora font-black">{grade.letter}</span>
            </div>
            <div className="mb-2">
                <span className="text-6xl font-sora font-black text-gradient">{displayScore}</span>
                <span className="text-2xl text-white/30 font-sora ml-1">/ {total}</span>
            </div>
            <p className="text-lg text-white/50 font-dm">
                Accuracy: <span className={`font-semibold ${grade.color}`}>{displayPct}%</span>
            </p>
        </div>
    );
}
