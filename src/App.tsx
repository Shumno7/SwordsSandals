import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const CatalogPage = lazy(() => import('@/pages/CatalogPage'));
const QuizPage = lazy(() => import('@/pages/QuizPage'));
const QuizResultPage = lazy(() => import('@/pages/QuizResultPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-forge-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-forge-gold/30 border-t-forge-gold rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-forge-black flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/quiz/result" element={<QuizResultPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
