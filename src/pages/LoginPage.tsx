import { useState, type FormEvent } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Swords, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message === 'Invalid login credentials'
        ? 'Invalid email or password.'
        : signInError.message);
      setLoading(false);
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-forge-black flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <Swords className="text-forge-gold group-hover:text-forge-gold-light transition-colors" size={28} />
            <span className="text-2xl font-serif font-semibold text-gray-100 tracking-wide">Skyforge</span>
          </Link>
          <h1 className="text-3xl font-serif text-gray-100 mb-2">Welcome back</h1>
          <p className="text-sm text-gray-500">Sign in to access your wishlist and profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="card-surface p-8 space-y-5">
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-800/30 rounded-sm px-4 py-3">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          No account yet?{' '}
          <Link to="/register" className="text-forge-gold hover:text-forge-gold-light transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
