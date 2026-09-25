import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { supabase, type Product, type SwordCategory, type Era, type GripType, CATEGORY_LABELS, ERA_LABELS, GRIP_LABELS } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/lib/wishlist';

const CATEGORIES: SwordCategory[] = ['rapier', 'smallsword', 'longsword', 'bastard_sword', 'greatsword'];
const ERAS: Era[] = ['16th', '17th', '18th', '19th'];
const GRIP_TYPES: GripType[] = ['single_hand', 'hand_and_a_half', 'two_handed'];

type SortKey = 'name' | 'price_asc' | 'price_desc' | 'blade_asc' | 'blade_desc' | 'weight_asc' | 'weight_desc';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Filter state
  const [category, setCategory] = useState<string>(searchParams.get('category') ?? 'all');
  const [era, setEra] = useState<string>(searchParams.get('era') ?? 'all');
  const [gripType, setGripType] = useState<string>(searchParams.get('grip') ?? 'all');
  const [bladeMin, setBladeMin] = useState<string>('');
  const [bladeMax, setBladeMax] = useState<string>('');
  const [weightMin, setWeightMin] = useState<string>('');
  const [weightMax, setWeightMax] = useState<string>('');
  const [sort, setSort] = useState<SortKey>('name');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let query = supabase.from('products').select('*');

      if (category !== 'all') query = query.eq('category', category);
      if (era !== 'all') query = query.eq('era', era);
      if (gripType !== 'all') query = query.eq('grip_type', gripType);
      if (bladeMin) query = query.gte('blade_length_cm', parseFloat(bladeMin));
      if (bladeMax) query = query.lte('blade_length_cm', parseFloat(bladeMax));
      if (weightMin) query = query.gte('weight_g', parseInt(weightMin));
      if (weightMax) query = query.lte('weight_g', parseInt(weightMax));

      const { data, error } = await query;
      if (error) {
        setProducts([]);
      } else {
        setProducts(data as Product[]);
      }
      setLoading(false);
    })();
  }, [category, era, gripType, bladeMin, bladeMax, weightMin, weightMax]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sort) {
      case 'price_asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price_desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'blade_asc': sorted.sort((a, b) => (a.blade_length_cm ?? 0) - (b.blade_length_cm ?? 0)); break;
      case 'blade_desc': sorted.sort((a, b) => (b.blade_length_cm ?? 0) - (a.blade_length_cm ?? 0)); break;
      case 'weight_asc': sorted.sort((a, b) => (a.weight_g ?? 0) - (b.weight_g ?? 0)); break;
      case 'weight_desc': sorted.sort((a, b) => (b.weight_g ?? 0) - (a.weight_g ?? 0)); break;
      default: sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [products, sort]);

  const clearFilters = () => {
    setCategory('all');
    setEra('all');
    setGripType('all');
    setBladeMin('');
    setBladeMax('');
    setWeightMin('');
    setWeightMax('');
    setSearchParams({});
  };

  const hasActiveFilters = category !== 'all' || era !== 'all' || gripType !== 'all' ||
    bladeMin || bladeMax || weightMin || weightMax;

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    if (cat === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="label-text mb-3">Category</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`block w-full text-left px-3 py-2 text-sm rounded-sm transition-colors duration-200 ${
              category === 'all' ? 'bg-forge-gold/10 text-forge-gold' : 'text-gray-500 hover:text-gray-300 hover:bg-forge-graphite'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-sm transition-colors duration-200 ${
                category === cat ? 'bg-forge-gold/10 text-forge-gold' : 'text-gray-500 hover:text-gray-300 hover:bg-forge-graphite'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Era */}
      <div>
        <h3 className="label-text mb-3">Era</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => setEra('all')}
            className={`block w-full text-left px-3 py-2 text-sm rounded-sm transition-colors duration-200 ${
              era === 'all' ? 'bg-forge-gold/10 text-forge-gold' : 'text-gray-500 hover:text-gray-300 hover:bg-forge-graphite'
            }`}
          >
            All Eras
          </button>
          {ERAS.map((e) => (
            <button
              key={e}
              onClick={() => setEra(e)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-sm transition-colors duration-200 ${
                era === e ? 'bg-forge-gold/10 text-forge-gold' : 'text-gray-500 hover:text-gray-300 hover:bg-forge-graphite'
              }`}
            >
              {ERA_LABELS[e]}
            </button>
          ))}
        </div>
      </div>

      {/* Grip Type */}
      <div>
        <h3 className="label-text mb-3">Grip Type</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => setGripType('all')}
            className={`block w-full text-left px-3 py-2 text-sm rounded-sm transition-colors duration-200 ${
              gripType === 'all' ? 'bg-forge-gold/10 text-forge-gold' : 'text-gray-500 hover:text-gray-300 hover:bg-forge-graphite'
            }`}
          >
            All Grips
          </button>
          {GRIP_TYPES.map((g) => (
            <button
              key={g}
              onClick={() => setGripType(g)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-sm transition-colors duration-200 ${
                gripType === g ? 'bg-forge-gold/10 text-forge-gold' : 'text-gray-500 hover:text-gray-300 hover:bg-forge-graphite'
              }`}
            >
              {GRIP_LABELS[g]}
            </button>
          ))}
        </div>
      </div>

      {/* Blade Length Range */}
      <div>
        <h3 className="label-text mb-3">Blade Length (cm)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={bladeMin}
            onChange={(e) => setBladeMin(e.target.value)}
            className="input-field !py-2 text-xs"
          />
          <input
            type="number"
            placeholder="Max"
            value={bladeMax}
            onChange={(e) => setBladeMax(e.target.value)}
            className="input-field !py-2 text-xs"
          />
        </div>
      </div>

      {/* Weight Range */}
      <div>
        <h3 className="label-text mb-3">Weight (g)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={weightMin}
            onChange={(e) => setWeightMin(e.target.value)}
            className="input-field !py-2 text-xs"
          />
          <input
            type="number"
            placeholder="Max"
            value={weightMax}
            onChange={(e) => setWeightMax(e.target.value)}
            className="input-field !py-2 text-xs"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-forge-gold transition-colors duration-200"
        >
          <X size={14} /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-forge-black pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-sans tracking-widest uppercase text-forge-gold/70 mb-3">
            The Collection
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-gray-100 mb-2">Catalog</h1>
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${sortedProducts.length} ${sortedProducts.length === 1 ? 'piece' : 'pieces'} in the collection`}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters - desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal size={16} className="text-forge-gold" />
                <h2 className="text-sm font-sans font-medium tracking-wide text-gray-300">Filters</h2>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort + mobile filter toggle */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 text-sm text-gray-400 hover:text-forge-gold transition-colors"
              >
                <Filter size={16} /> Filters
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <label className="text-xs text-gray-500 hidden sm:block">Sort by</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="select-field !py-2 !w-auto text-xs"
                >
                  <option value="name">Name (A–Z)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="blade_asc">Blade Length (Short to Long)</option>
                  <option value="blade_desc">Blade Length (Long to Short)</option>
                  <option value="weight_asc">Weight (Light to Heavy)</option>
                  <option value="weight_desc">Weight (Heavy to Light)</option>
                </select>
              </div>
            </div>

            {/* Mobile filter panel */}
            {showFilters && (
              <div className="lg:hidden mb-6 card-surface p-5 animate-fade-in">
                <FilterContent />
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-forge-gold/30 border-t-forge-gold rounded-full animate-spin" />
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-gray-500 text-lg font-serif italic">No pieces match your filters.</p>
                <button onClick={clearFilters} className="mt-4 text-sm text-forge-gold hover:text-forge-gold-light transition-colors">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
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
        </div>
      </div>
    </div>
  );
}
