import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import CourseLibrary from './pages/CourseLibrary';
import CourseDetail from './pages/CourseDetail';
import TestsPage from './pages/TestsPage';
import LessonView from './pages/LessonView';
import TestInstructions from './pages/TestInstructions';
import TestTaking from './pages/TestTaking';
import Results from './pages/Results';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import InstructorDashboard from './pages/InstructorDashboard';

function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div></div>;
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
    return children;
}

export default function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-navy-900">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/50 font-dm">Loading AptIQ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-navy-900">
            <Routes>
                {/* Public routes */}
                <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

                {/* Protected routes with sidebar */}
                <Route path="/*" element={
                    <ProtectedRoute>
                        <div className="flex min-h-screen">
                            <Sidebar />
                            <main className="flex-1 ml-64 p-8 overflow-y-auto max-h-screen">
                                <Routes>
                                    <Route path="/dashboard" element={<StudentDashboard />} />
                                    <Route path="/courses" element={<CourseLibrary />} />
                                    <Route path="/courses/:id" element={<CourseDetail />} />
                                    <Route path="/lessons/:id" element={<LessonView />} />
                                    <Route path="/tests" element={<TestsPage />} />
                                    <Route path="/tests/:id/instructions" element={<TestInstructions />} />
                                    <Route path="/tests/:id/take" element={<TestTaking />} />
                                    <Route path="/tests/:id/results/:attemptId" element={<Results />} />
                                    <Route path="/leaderboard" element={<Leaderboard />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                                    <Route path="/instructor" element={<ProtectedRoute roles={['instructor', 'admin']}><InstructorDashboard /></ProtectedRoute>} />
                                </Routes>
                            </main>
                        </div>
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
}
