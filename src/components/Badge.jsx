const badgeIcons = {
    'first-test': '🎯',
    'streak-7': '🔥',
    'streak-30': '🔥',
    'perfect-score': '💯',
    'speed-demon': '⚡',
    'top-10': '🏆',
    'course-complete': '📚',
    'quiz-master': '🧠',
    default: '⭐',
};

const badgeColors = {
    bronze: 'from-orange-400 to-orange-700 border-orange-500/30',
    silver: 'from-gray-300 to-gray-500 border-gray-400/30',
    gold: 'from-amber to-amber-700 border-amber/30',
    platinum: 'from-cyan to-cyan-700 border-cyan/30',
    default: 'from-white/20 to-white/5 border-white/10',
};

export default function Badge({ name, description, type = 'default', tier = 'default', earned = false, className = '' }) {
    const icon = badgeIcons[type] || badgeIcons.default;
    const colorClass = badgeColors[tier] || badgeColors.default;

    return (
        <div className={`relative group ${className}`}>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClass} border flex items-center justify-center text-2xl transition-all duration-300 ${earned ? 'opacity-100 hover:scale-110 hover:shadow-lg' : 'opacity-30 grayscale'
                }`}>
                {icon}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-950 border border-white/10 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <p className="font-semibold text-white">{name}</p>
                {description && <p className="text-white/50 mt-0.5">{description}</p>}
            </div>
        </div>
    );
}
