export default function ProgressRing({ progress = 0, size = 80, strokeWidth = 6, className = '' }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    const getColor = () => {
        if (progress >= 80) return '#00e5ff';
        if (progress >= 50) return '#ffb300';
        return '#ff5252';
    };

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    strokeWidth={strokeWidth}
                    stroke="rgba(255,255,255,0.1)"
                    fill="transparent"
                />
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    strokeWidth={strokeWidth}
                    stroke={getColor()}
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
            </svg>
            <span className="absolute text-sm font-bold font-sora">{Math.round(progress)}%</span>
        </div>
    );
}
