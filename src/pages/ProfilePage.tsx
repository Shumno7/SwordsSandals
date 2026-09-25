import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Mail, Calendar, Heart, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, type WishlistItem } from '@/lib/supabase';
import { fetchWishlistWithProducts } from '@/lib/wishlist';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (profile?.display_name) setDisplayName(profile.display_name);
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: wishlist } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (wishlist) {
        const items = await fetchWishlistWithProducts(wishlist.id);
        setWishlistCount(items.length);
      }
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-forge-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-forge-gold/30 border-t-forge-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase
      .from('profiles')
      .update({ display_name: displayName || null })
      .eq('id', user.id);
    setSaving(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <div className="min-h-screen bg-forge-black pt-20 md:pt-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-sans tracking-widest uppercase text-forge-gold/70 mb-3">
            Private Profile
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-gray-100">Your Account</h1>
          <p className="text-sm text-gray-500 mt-2">This page is visible only to you.</p>
        </div>

        {/* Account info card */}
        <div className="card-surface p-8 mb-8">
          <h2 className="text-lg font-serif text-gray-100 mb-6">Account Information</h2>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-forge-graphite border border-forge-ash/30 rounded-sm">
                <Mail className="text-forge-gold/60" size={20} />
              </div>
              <div>
                <p className="label-text mb-0.5">Email</p>
                <p className="text-sm text-gray-300">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-forge-graphite border border-forge-ash/30 rounded-sm">
                <Calendar className="text-forge-gold/60" size={20} />
              </div>
              <div>
                <p className="label-text mb-0.5">Member Since</p>
                <p className="text-sm text-gray-300">{memberSince}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-forge-graphite border border-forge-ash/30 rounded-sm">
                {profile?.role === 'admin' ? <Shield className="text-forge-gold/60" size={20} /> : <Heart className="text-forge-gold/60" size={20} />}
              </div>
              <div>
                <p className="label-text mb-0.5">Role</p>
                <p className="text-sm text-gray-300 capitalize">{profile?.role ?? 'customer'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-forge-graphite border border-forge-ash/30 rounded-sm">
                <Heart className="text-forge-gold/60" size={20} />
              </div>
              <div>
                <p className="label-text mb-0.5">Wishlist Items</p>
                <p className="text-sm text-gray-300">{wishlistCount} {wishlistCount === 1 ? 'piece' : 'pieces'} saved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit display name */}
        <div className="card-surface p-8">
          <h2 className="text-lg font-serif text-gray-100 mb-6">Display Name</h2>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-forge-graphite border border-forge-ash/30 rounded-sm flex-shrink-0">
              <User className="text-forge-gold/60" size={20} />
            </div>
            <div className="flex-1">
              <Input
                name="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should we address you?"
              />
              <div className="flex items-center gap-4 mt-4">
                <Button onClick={handleSave} disabled={saving} className="!py-2">
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                {savedMessage && (
                  <span className="text-sm text-forge-gold animate-fade-in">Saved.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
