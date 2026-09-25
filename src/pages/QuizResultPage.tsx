import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Swords, Check } from 'lucide-react';
import { supabase, type Product, type SwordCategory, CATEGORY_LABELS, ERA_LABELS, GRIP_LABELS } from '@/lib/supabase';
import Button from '@/components/Button';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/lib/wishlist';

const CATEGORY_DESCRIPTIONS: Record<SwordCategory, string> = {
  rapier: 'The rapier is the civilian duelist\'s blade — long, elegant, and built for the thrust. Born in the 16th century and refined through the 17th, it represents the transition from the battlefield sword to the personal sidearm of the gentleman.',
  smallsword: 'The smallsword is the rapier\'s lighter descendant, the final refinement of the thrusting sword. By the 18th century it had become the universal dress sidearm of the European gentleman — fast, deadly, and beautiful.',
  longsword: 'The longsword is the knight\'s weapon refined for the Renaissance. Double-edged, balanced for both cut and thrust, it served the German and Italian fencing masters of the 16th century as the foundation of their art.',
  bastard_sword: 'The bastard sword — the "hand-and-a-half" — bridges the longsword and the single-handed arming sword. Versatile on foot and horseback, it was the working sword of the 16th-century professional soldier.',
  greatsword: 'The greatsword is the two-handed blade of the specialist — the Landsknecht\'s Zweihander, the Highlander\'s claymore, the Iberian montante. Massive, purposeful, and carried only by those who knew how to wield it.',
};

export default function QuizResultPage() {
  const [searchParams] = useSearchParams();
  const category = (searchParams.get('category') ?? 'rapier') as SwordCategory;
  const [products, setProducts] = useState<Product[]>([]);
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .limit(4);
      setProducts(data as Product[] ?? []);
    })();
  }, [category]);

  return (
    <div className="min-h-screen bg-forge-black pt-20 md:pt-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        {/* Result header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="w-16 h-px bg-forge-gold mx-auto mb-8" />
          <p className="text-xs font-sans tracking-widest uppercase text-forge-gold/70 mb-4">
            Your Result
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Check className="text-forge-gold" size={28} />
            <h1 className="text-4xl md:text-6xl font-serif text-gray-100">
              The <span className="text-forge-gold italic">{CATEGORY_LABELS[category]}</span>
            </h1>
          </div>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto text-balance mb-10">
            {CATEGORY_DESCRIPTIONS[category]}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/catalog?category=${category}`}>
              <Button variant="gold">
                Browse all {CATEGORY_LABELS[category]}s <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/quiz">
              <Button variant="outline">Retake the quiz</Button>
            </Link>
          </div>
        </div>

        {/* Recommended pieces */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-8">
            <Swords className="text-forge-gold/60" size={20} strokeWidth={1.5} />
            <h2 className="text-2xl font-serif text-gray-100">Pieces in this family</h2>
          </div>

          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-12 font-serif italic">Loading pieces...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onToggleWishlist={toggleWishlist}
                  isInWishlist={isInWishlist(product.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Specs summary */}
        <div className="mt-16 card-surface p-8">
          <h3 className="text-sm font-sans tracking-widest uppercase text-forge-gold/70 mb-6">
            Characteristics of the {CATEGORY_LABELS[category]}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {products[0] && (
              <>
                <div>
                  <p className="label-text mb-1">Typical Grip</p>
                  <p className="text-sm text-gray-300">{GRIP_LABELS[products[0].grip_type]}</p>
                </div>
                <div>
                  <p className="label-text mb-1">Common Eras</p>
                  <p className="text-sm text-gray-300">
                    {ERA_LABELS[products[0].era]}
                    {products[1] && `, ${ERA_LABELS[products[1].era]}`}
                  </p>
                </div>
                <div>
                  <p className="label-text mb-1">Blade Range</p>
                  <p className="text-sm text-gray-300">
                    {Math.min(...products.map((p) => p.blade_length_cm ?? 0)).toFixed(0)}–
                    {Math.max(...products.map((p) => p.blade_length_cm ?? 0)).toFixed(0)} cm
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
