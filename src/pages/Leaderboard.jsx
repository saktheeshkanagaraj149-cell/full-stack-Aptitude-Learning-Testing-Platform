import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import LeaderboardTable from '../components/LeaderboardTable';

export default function Leaderboard() {
    const { user, apiFetch } = useAuth();
    const [entries, setEntries] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('alltime');

    useEffect(() => { loadLeaderboard(); }, [period]);

    const loadLeaderboard = async () => {
        setLoading(true);
        try {
            const [data, rank] = await Promise.all([
                apiFetch(`/leaderboard?period=${period}&limit=50`),
                apiFetch('/leaderboard/my-rank').catch(() => null),
            ]);
            setEntries(Array.isArray(data) ? data : []);
            setMyRank(rank);
        } catch (err) {
            console.error('Failed to load leaderboard:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <Navbar title="Leaderboard" subtitle="Compete and climb the rankings" />

            {/* My rank card */}
            {myRank && myRank.rank && (
                <GlassCard className="mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber/5 to-cyan/5"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber to-amber-700 flex items-center justify-center text-navy-900 font-bold text-xl font-sora">
                                #{myRank.rank}
                            </div>
                            <div>
                                <p className="text-sm text-white/40">Your Current Rank</p>
                                <p className="text-lg font-sora font-bold">
                                    {myRank.rank <= 3 ? '🏆' : myRank.rank <= 10 ? '⭐' : '📊'} Rank #{myRank.rank}
                                    <span className="text-white/30 text-sm ml-2">of {myRank.total_participants}</span>
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-sora font-bold text-gradient">{(myRank.percentage || 0).toFixed(1)}%</p>
                            <p className="text-xs text-white/30">Avg Score</p>
                        </div>
                    </div>
                </GlassCard>
            )}

            {/* Period filters */}
            <div className="flex gap-2 mb-6">
                {[
                    { key: 'alltime', label: '🌍 All Time' },
                    { key: 'monthly', label: '📅 Monthly' },
                    { key: 'weekly', label: '📆 Weekly' },
                ].map(p => (
                    <button
                        key={p.key}
                        onClick={() => setPeriod(p.key)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${period === p.key
                                ? 'bg-cyan/20 text-cyan border border-cyan/30'
                                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Leaderboard table */}
            <GlassCard>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <LeaderboardTable entries={entries} currentUserId={user?.id} />
                )}
            </GlassCard>
        </div>
    );
}
