import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';

const categoryIcons = {
    'Quantitative Aptitude': '🔢',
    'Logical Reasoning': '🧩',
    'Verbal Ability': '📖',
    'Data Interpretation': '📊',
};

export default function CourseLibrary() {
    const { apiFetch } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await apiFetch('/courses');
            setCourses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['all', ...new Set(courses.map(c => c.category).filter(Boolean))];

    const filtered = courses.filter(c => {
        const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase()) ||
            c.description?.toLowerCase().includes(search.toLowerCase());
        const matchCategory = category === 'all' || c.category === category;
        return matchSearch && matchCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <Navbar title="Course Library" subtitle={`${courses.length} courses available`} />

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field !pl-11"
                        placeholder="Search courses..."
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${category === cat
                                    ? 'bg-cyan/20 text-cyan border border-cyan/30'
                                    : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {cat === 'all' ? '📋 All' : `${categoryIcons[cat] || '📚'} ${cat}`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((course, i) => (
                    <Link key={course.id} to={`/courses/${course.id}`}>
                        <GlassCard hover className="h-full animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-4xl">{categoryIcons[course.category] || '📚'}</span>
                                <span className="badge-pill bg-cyan/10 text-cyan text-[10px]">
                                    {course.chapter_count || 0} chapters
                                </span>
                            </div>
                            <h3 className="text-lg font-sora font-semibold mb-2 line-clamp-1">{course.title}</h3>
                            <p className="text-sm text-white/40 line-clamp-3 mb-4">{course.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="badge-pill bg-amber/10 text-amber">
                                    {course.category || 'General'}
                                </span>
                                <span className="text-xs text-white/30">
                                    {course.difficulty || 'Beginner'}
                                </span>
                            </div>
                        </GlassCard>
                    </Link>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-4xl mb-4">📚</p>
                    <p className="text-white/40">No courses found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
