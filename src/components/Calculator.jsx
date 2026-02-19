import { useState } from 'react';

export default function Calculator({ onClose }) {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');

    const handleNumber = (num) => {
        setDisplay(prev => prev === '0' ? num : prev + num);
    };

    const handleOperator = (op) => {
        setEquation(display + ' ' + op + ' ');
        setDisplay('0');
    };

    const handleEqual = () => {
        try {
            const result = new Function('return ' + equation + display)();
            setDisplay(String(parseFloat(result.toFixed(8))));
            setEquation('');
        } catch {
            setDisplay('Error');
        }
    };

    const handleClear = () => { setDisplay('0'); setEquation(''); };
    const handleBackspace = () => setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');

    const buttons = [
        ['C', '⌫', '%', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['0', '.', '±', '='],
    ];

    const opMap = { '÷': '/', '×': '*', '±': '' };

    const handleClick = (btn) => {
        if (btn === 'C') handleClear();
        else if (btn === '⌫') handleBackspace();
        else if (btn === '=') handleEqual();
        else if (btn === '±') setDisplay(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
        else if (['+', '-', '×', '÷', '%'].includes(btn)) handleOperator(opMap[btn] || btn);
        else handleNumber(btn);
    };

    return (
        <div className="glass-card p-4 w-72 animate-scale-in">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-sora font-semibold text-cyan">Calculator</h3>
                <button onClick={onClose} className="text-white/40 hover:text-white text-lg">✕</button>
            </div>
            <div className="bg-navy-900/80 rounded-lg p-3 mb-3 text-right">
                <div className="text-white/40 text-xs h-4">{equation}</div>
                <div className="text-2xl font-sora font-bold">{display}</div>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {buttons.flat().map((btn, i) => (
                    <button
                        key={i}
                        onClick={() => handleClick(btn)}
                        className={`h-11 rounded-lg text-sm font-semibold transition-all active:scale-90 ${btn === '=' ? 'bg-cyan text-navy-900 hover:bg-cyan-400' :
                                ['+', '-', '×', '÷', '%'].includes(btn) ? 'bg-amber/20 text-amber hover:bg-amber/30' :
                                    ['C', '⌫'].includes(btn) ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' :
                                        'bg-white/5 text-white hover:bg-white/10'
                            }`}
                    >
                        {btn}
                    </button>
                ))}
            </div>
        </div>
    );
}
