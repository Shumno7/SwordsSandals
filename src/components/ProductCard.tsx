import { Link } from 'react-router-dom';
import { Heart, Ruler, Weight, Calendar } from 'lucide-react';
import { type Product, CATEGORY_LABELS, ERA_LABELS, GRIP_LABELS } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

interface ProductCardProps {
  product: Product;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

export default function ProductCard({ product, onToggleWishlist, isInWishlist }: ProductCardProps) {
  const { user } = useAuth();

  return (
    <div className="card-surface group overflow-hidden hover:border-forge-gold/30 hover:shadow-xl hover:shadow-black/40">
      {/* Image placeholder */}
      <Link to={`/catalog?focus=${product.id}`} className="block relative">
        <div className="aspect-[4/3] bg-gradient-to-br from-forge-graphite to-forge-charcoal flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grain opacity-40" />
          <div className="text-center px-4">
            <div className="w-24 h-1 bg-forge-gold/20 mx-auto mb-3" />
            <p className="text-xs font-sans tracking-widest uppercase text-gray-600">
              Image Placeholder
            </p>
            <p className="text-sm text-gray-500 mt-1 font-serif italic">{product.name}</p>
            <div className="w-24 h-1 bg-forge-gold/20 mx-auto mt-3" />
          </div>
          {product.featured && (
            <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-sans tracking-widest uppercase text-forge-black bg-forge-gold rounded-sm">
              Featured
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-[10px] font-sans tracking-widest uppercase text-forge-gold/70 mb-1">
              {CATEGORY_LABELS[product.category]}
            </p>
            <Link to={`/catalog?focus=${product.id}`}>
              <h3 className="text-lg font-serif text-gray-100 group-hover:text-forge-gold transition-colors duration-300 leading-tight">
                {product.name}
              </h3>
            </Link>
          </div>
          {user && onToggleWishlist && (
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`flex-shrink-0 p-1.5 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forge-gold/30 ${
                isInWishlist
                  ? 'text-forge-gold'
                  : 'text-gray-600 hover:text-forge-gold'
              }`}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {product.short_description}
        </p>

        {/* Specs */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {ERA_LABELS[product.era]}
          </span>
          {product.blade_length_cm && (
            <span className="flex items-center gap-1">
              <Ruler size={12} /> {product.blade_length_cm}cm
            </span>
          )}
          {product.weight_g && (
            <span className="flex items-center gap-1">
              <Weight size={12} /> {(product.weight_g / 1000).toFixed(2)}kg
            </span>
          )}
          <span className="text-gray-500">{GRIP_LABELS[product.grip_type]}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-forge-ash/20">
          <span className="text-lg font-serif text-forge-gold">
            ${product.price.toLocaleString('en-US')}
          </span>
          <span className="text-[10px] font-sans tracking-widest uppercase text-gray-600">
            For Collection
          </span>
        </div>
      </div>
    </div>
  );
}
