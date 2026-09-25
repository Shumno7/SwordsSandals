import { useState, type FormEvent } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Swords, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function RegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName || undefined } },
    });

    if (signUpError) {
      setError(signUpError.message);
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
          <h1 className="text-3xl font-serif text-gray-100 mb-2">Join the atelier</h1>
          <p className="text-sm text-gray-500">Create an account to save pieces to your wishlist.</p>
        </div>

        <form onSubmit={handleSubmit} className="card-surface p-8 space-y-5">
          <Input
            label="Display Name (optional)"
            type="text"
            name="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="How should we address you?"
          />
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
            autoComplete="new-password"
            placeholder="At least 6 characters"
          />

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-800/30 rounded-sm px-4 py-3">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-forge-gold hover:text-forge-gold-light transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
