import { Link } from 'react-router-dom';

export default function Landing() {
  const features = [
    { icon: '📚', title: 'Interactive Courses', desc: 'Learn Quant, Logical, Verbal & DI with structured chapters and practice questions' },
    { icon: '⏱️', title: 'Timed Tests', desc: 'Take proctored tests with anti-cheat protection, question palettes, and auto-submit' },
    { icon: '📊', title: 'Smart Analytics', desc: 'Get section-wise accuracy, weak area detection, and personalized recommendations' },
    { icon: '🏆', title: 'Leaderboards', desc: 'Compete globally with real-time rankings, trophies, and achievement badges' },
    { icon: '🔥', title: 'Streak System', desc: 'Build daily learning habits with streak tracking and milestone badges' },
    { icon: '🛡️', title: 'Anti-Cheat', desc: 'Fullscreen mode, tab detection, randomized questions, and device session control' },
  ];

  const stats = [
    { value: '4', label: 'Categories' },
    { value: '50+', label: 'Lessons' },
    { value: '300+', label: 'Questions' },
    { value: '10K+', label: 'Students' },
  ];

  return (
    <div className="min-h-screen bg-navy-900 overflow-x-hidden">
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-cyan-700 flex items-center justify-center text-navy-900 font-bold text-lg font-sora">IQ</div>
          <span className="text-2xl font-sora font-bold text-gradient">AptIQ</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="btn-secondary !py-2.5 !px-5 text-sm">Log In</Link>
          <Link to="/register" className="btn-primary !py-2.5 !px-5 text-sm">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-8 pt-16 pb-24 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-cyan/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber/5 rounded-full blur-[120px]"></div>
        </div>
        <div className="relative">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-sm font-medium">
            🚀 The Future of Aptitude Training
          </div>
          <h1 className="text-5xl md:text-7xl font-sora font-bold leading-tight mb-6">
            Master Aptitude with<br />
            <span className="text-gradient">Intelligent Practice</span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 font-dm leading-relaxed">
            Structured courses, AI-powered analytics, proctored tests, and real-time leaderboards — everything you need to ace competitive exams.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg !px-8 !py-4">
              Start Learning Free →
            </Link>
            <Link to="/login" className="btn-secondary text-lg !px-8 !py-4">
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="max-w-4xl mx-auto px-8 mb-20">
        <div className="glass-card flex items-center justify-around py-8 animate-fade-in">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-sora font-bold text-gradient">{s.value}</div>
              <div className="text-sm text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">
            Everything You Need to <span className="text-gradient-amber">Excel</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">A comprehensive platform designed for serious aptitude learners and competitive exam aspirants.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass-card-hover p-8 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-sora font-semibold mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-8 pb-24 text-center">
        <div className="glass-card p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan/10 to-amber/5"></div>
          <div className="relative">
            <h2 className="text-3xl font-sora font-bold mb-4">Ready to Boost Your Aptitude?</h2>
            <p className="text-white/50 mb-8">Join thousands of students who are already improving their scores.</p>
            <Link to="/register" className="btn-primary text-lg !px-8 !py-4">Create Free Account</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-white/30 text-sm">
        <p>© 2026 AptIQ. Built for excellence.</p>
      </footer>
    </div>
  );
}
