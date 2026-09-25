import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Shield, User as UserIcon, LogOut, Swords } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/catalog', label: 'Catalog' },
    { to: '/quiz', label: 'Find Your Sword' },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium tracking-wide transition-colors duration-200 hover:text-forge-gold focus:outline-none focus:ring-2 focus:ring-forge-gold/30 rounded-sm ${
      isActive ? 'text-forge-gold' : 'text-gray-400'
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-forge-black/95 backdrop-blur-md border-b border-forge-ash/20'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-forge-gold/30 rounded-sm">
              <Swords className="text-forge-gold group-hover:text-forge-gold-light transition-colors duration-300" size={26} />
              <span className="text-2xl font-serif font-semibold text-gray-100 group-hover:text-forge-gold transition-colors duration-300 tracking-wide">
                Skyforge
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Desktop auth area */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <NavLink to="/dashboard" className={linkClass}>
                    {isAdmin ? (
                      <span className="flex items-center gap-1.5">
                        <Shield size={16} /> Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Heart size={16} /> Wishlist
                      </span>
                    )}
                  </NavLink>
                  <NavLink to="/profile" className={linkClass}>
                    <span className="flex items-center gap-1.5">
                      <UserIcon size={16} /> {profile?.display_name || 'Profile'}
                    </span>
                  </NavLink>
                  <button
                    onClick={signOut}
                    className="text-gray-400 hover:text-forge-gold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-forge-gold/30 rounded-sm"
                    aria-label="Sign out"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={linkClass}>Sign In</NavLink>
                  <Link to="/register" className="btn-gold !py-2 !px-4 text-xs">
                    Create Account
                  </Link>
                </>
              )}
            </div>

            {/* Tablet/mobile: compact menu button */}
            <button
              className="md:hidden text-gray-300 hover:text-forge-gold transition-colors focus:outline-none focus:ring-2 focus:ring-forge-gold/30 rounded-sm p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-16 right-0 left-0 bg-forge-charcoal border-b border-forge-ash/30 animate-slide-in shadow-2xl">
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={linkClass}
                  end={link.to === '/'}
                >
                  <div className="py-3 text-base">{link.label}</div>
                </NavLink>
              ))}
              <div className="h-px bg-forge-ash/20 my-2" />
              {user ? (
                <>
                  <NavLink to="/dashboard" className={linkClass}>
                    <div className="py-3 text-base flex items-center gap-2">
                      {isAdmin ? <Shield size={18} /> : <Heart size={18} />}
                      {isAdmin ? 'Admin Panel' : 'My Wishlist'}
                    </div>
                  </NavLink>
                  <NavLink to="/profile" className={linkClass}>
                    <div className="py-3 text-base flex items-center gap-2">
                      <UserIcon size={18} /> {profile?.display_name || 'Profile'}
                    </div>
                  </NavLink>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="w-full text-left py-3 text-base text-gray-400 hover:text-forge-gold flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link to="/login" className="btn-outline w-full">Sign In</Link>
                  <Link to="/register" className="btn-gold w-full">Create Account</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
