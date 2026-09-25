import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, Swords, Scroll, Compass, Shield } from 'lucide-react';
import { supabase, type Product, CATEGORY_LABELS } from '@/lib/supabase';
import Button from '@/components/Button';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/lib/wishlist';

export default function LandingPage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(4);
      setFeatured(data as Product[] ?? []);
    })();
  }, []);

  return (
    <div className="bg-forge-black">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient + grain */}
        <div className="absolute inset-0 bg-gradient-to-b from-forge-black via-forge-charcoal to-forge-black" />
        <div className="absolute inset-0 bg-grain opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-forge-black/40" />

        {/* Decorative sword silhouette */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
          <Swords size={600} className="text-forge-gold" strokeWidth={0.5} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-20">
          <div className="animate-fade-in-up">
            <div className="w-16 h-px bg-forge-gold mx-auto mb-8" />
            <p className="text-xs font-sans tracking-[0.3em] uppercase text-forge-gold/80 mb-6">
              Historical Sword Atelier
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-gray-100 leading-[1.05] text-balance text-shadow-dark mb-8">
              The Art of the Blade,
              <br />
              <span className="text-forge-gold italic">Five Centuries Forged</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-12 text-balance">
              From the rapier's lethal elegance to the Zweihander's crushing power —
              discover authentic swords of the 16th through 19th centuries,
              catalogued for the collector and student of the blade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalog">
                <Button variant="gold" className="w-full sm:w-auto">
                  Browse the Catalog <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/quiz">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Compass size={18} /> Find Your Sword
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-forge-gold/40" />
        </div>
      </section>

      {/* Brand Story */}
      <section className="relative py-24 md:py-32 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <div className="w-12 h-px bg-forge-gold/60 mb-6" />
              <p className="text-xs font-sans tracking-widest uppercase text-forge-gold/70 mb-4">
                The Atelier
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-100 leading-tight mb-6">
                A private collection, made public.
              </h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  Skyforge began as a private catalogue — a scholar's attempt to document
                  the evolution of the European sword from the Renaissance duelist to the
                  Napoleonic officer. Each piece is researched, described, and presented
                  with the seriousness the craft deserves.
                </p>
                <p>
                  We do not sell. We do not ship steel to your door. We exist for those
                  who understand that a sword is more than a weapon — it is a document
                  of its century, a study in geometry, balance, and the human hand that
                  shaped it.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-forge-graphite to-forge-charcoal border border-forge-ash/30 rounded-sm flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grain opacity-40" />
                <div className="text-center px-8">
                  <Scroll className="text-forge-gold/40 mx-auto mb-4" size={48} strokeWidth={1} />
                  <p className="text-xs font-sans tracking-widest uppercase text-gray-600 mb-2">
                    Image Placeholder
                  </p>
                  <p className="text-sm text-gray-500 font-serif italic">
                    Atelier interior — to be supplied
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Paths */}
      <section className="relative py-24 px-6 lg:px-8 bg-forge-charcoal/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-sans tracking-widest uppercase text-forge-gold/70 mb-4">
              Two Paths to Discovery
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-gray-100">
              How will you find your blade?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Quiz path */}
            <Link
              to="/quiz"
              className="card-surface p-8 group hover:border-forge-gold/30 hover:shadow-xl transition-all duration-300"
            >
              <Compass className="text-forge-gold mb-6 group-hover:scale-110 transition-transform duration-300" size={40} strokeWidth={1.5} />
              <h3 className="text-2xl font-serif text-gray-100 mb-3 group-hover:text-forge-gold transition-colors duration-300">
                Guided Discovery
              </h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                Not sure where to begin? Answer four questions about your preferences —
                grip, era, style, weight — and we'll point you to the right family of blades.
              </p>
              <span className="text-sm text-forge-gold font-medium tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                Take the quiz <ArrowRight size={16} />
              </span>
            </Link>

            {/* Browse path */}
            <Link
              to="/catalog"
              className="card-surface p-8 group hover:border-forge-gold/30 hover:shadow-xl transition-all duration-300"
            >
              <Shield className="text-forge-gold mb-6 group-hover:scale-110 transition-transform duration-300" size={40} strokeWidth={1.5} />
              <h3 className="text-2xl font-serif text-gray-100 mb-3 group-hover:text-forge-gold transition-colors duration-300">
                Browse the Catalog
              </h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                Know what you're looking for? Filter by blade length, era, grip type,
                and weight to narrow the full collection to your specifications.
              </p>
              <span className="text-sm text-forge-gold font-medium tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                Open the catalog <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured pieces */}
      {featured.length > 0 && (
        <section className="py-24 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-sans tracking-widest uppercase text-forge-gold/70 mb-3">
                  From the Collection
                </p>
                <h2 className="text-3xl md:text-4xl font-serif text-gray-100">Featured Pieces</h2>
              </div>
              <Link to="/catalog" className="hidden sm:block">
                <Button variant="ghost">
                  View all <ArrowRight size={16} />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onToggleWishlist={toggleWishlist}
                  isInWishlist={isInWishlist(product.id)}
                />
              ))}
            </div>

            <div className="sm:hidden mt-8 text-center">
              <Link to="/catalog">
                <Button variant="outline">View all <ArrowRight size={16} /></Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories overview */}
      <section className="py-24 px-6 lg:px-8 bg-forge-charcoal/50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-sans tracking-widest uppercase text-forge-gold/70 mb-4">
            Five Families of the Blade
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-100 mb-12">
            The Collection at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <Link
                key={value}
                to={`/catalog?category=${value}`}
                className="card-surface p-6 group hover:border-forge-gold/30 transition-all duration-300"
              >
                <div className="w-10 h-px bg-forge-gold/30 mx-auto mb-3 group-hover:w-16 transition-all duration-300" />
                <p className="text-sm font-serif text-gray-300 group-hover:text-forge-gold transition-colors duration-300">
                  {label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
