export default function LeaderboardTable({ entries = [], currentUserId }) {
    const medals = ['🥇', '🥈', '🥉'];

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                        <th className="pb-3 pr-4">Rank</th>
                        <th className="pb-3 pr-4">Student</th>
                        <th className="pb-3 pr-4 text-right">Score</th>
                        <th className="pb-3 pr-4 text-right">Accuracy</th>
                        <th className="pb-3 text-right">Tests</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {entries.map((entry, idx) => {
                        const isMe = entry.user_id === currentUserId;
                        return (
                            <tr
                                key={entry.user_id || idx}
                                className={`transition-colors ${isMe ? 'bg-cyan/5' : 'hover:bg-white/5'}`}
                            >
                                <td className="py-3 pr-4">
                                    <span className="text-lg">{idx < 3 ? medals[idx] : ''}</span>
                                    <span className={`ml-1 text-sm font-sora font-bold ${idx < 3 ? 'text-amber' : 'text-white/60'}`}>
                                        #{idx + 1}
                                    </span>
                                </td>
                                <td className="py-3 pr-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-gradient-to-br from-amber to-amber-700 text-navy-900' :
                                                idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-navy-900' :
                                                    idx === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-700 text-white' :
                                                        'bg-white/10 text-white/70'
                                            }`}>
                                            {entry.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${isMe ? 'text-cyan' : ''}`}>
                                                {entry.name} {isMe && <span className="text-[10px] text-cyan/60">(You)</span>}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 pr-4 text-right">
                                    <span className="text-sm font-sora font-bold text-gradient">{entry.total_score || 0}</span>
                                </td>
                                <td className="py-3 pr-4 text-right">
                                    <span className={`text-sm font-medium ${(entry.avg_accuracy || 0) >= 80 ? 'text-emerald-400' :
                                            (entry.avg_accuracy || 0) >= 50 ? 'text-amber' :
                                                'text-red-400'
                                        }`}>
                                        {(entry.avg_accuracy || 0).toFixed(1)}%
                                    </span>
                                </td>
                                <td className="py-3 text-right text-sm text-white/60">
                                    {entry.test_count || 0}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {entries.length === 0 && (
                <div className="text-center py-12 text-white/30">
                    <p className="text-4xl mb-2">🏆</p>
                    <p className="text-sm">No leaderboard data yet. Be the first to take a test!</p>
                </div>
            )}
        </div>
    );
}
