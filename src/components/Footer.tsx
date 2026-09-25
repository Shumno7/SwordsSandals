import { Link } from 'react-router-dom';
import { Swords, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forge-black border-t border-forge-ash/20 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand blurb */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Swords className="text-forge-gold" size={24} />
              <span className="text-xl font-serif font-semibold text-gray-100 tracking-wide">Skyforge</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              A private atelier for the study and collection of historical swords.
              Each piece is catalogued with care for the student of the blade,
              the reenactor, and the collector alike.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="label-text mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link to="/catalog" className="text-sm text-gray-500 hover:text-forge-gold transition-colors duration-200">Catalog</Link></li>
              <li><Link to="/quiz" className="text-sm text-gray-500 hover:text-forge-gold transition-colors duration-200">Find Your Sword</Link></li>
              <li><Link to="/register" className="text-sm text-gray-500 hover:text-forge-gold transition-colors duration-200">Create Account</Link></li>
              <li><Link to="/login" className="text-sm text-gray-500 hover:text-forge-gold transition-colors duration-200">Sign In</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="label-text mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-forge-ash/30 rounded-sm text-gray-500 hover:text-forge-gold hover:border-forge-gold/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-forge-gold/30"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-forge-ash/30 rounded-sm text-gray-500 hover:text-forge-gold hover:border-forge-gold/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-forge-gold/30"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-forge-ash/30 rounded-sm text-gray-500 hover:text-forge-gold hover:border-forge-gold/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-forge-gold/30"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-forge-ash/10">
          <p className="text-xs text-gray-600 tracking-wide text-center">
            Skyforge — Historical Sword Atelier. For study and collection purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
