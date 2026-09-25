import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart, Shield, Plus, Pencil, Trash2, X, Package } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, type Product, type WishlistItem, type SwordCategory, type Era, type GripType, CATEGORY_LABELS, ERA_LABELS, GRIP_LABELS } from '@/lib/supabase';
import { fetchWishlistWithProducts } from '@/lib/wishlist';
import Button from '@/components/Button';
import ProductCard from '@/components/ProductCard';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Select from '@/components/Select';

export default function DashboardPage() {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-forge-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-forge-gold/30 border-t-forge-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (isAdmin) return <AdminDashboard />;
  return <CustomerDashboard />;
}

// ==================== CUSTOMER DASHBOARD ====================
function CustomerDashboard() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removeTarget, setRemoveTarget] = useState<WishlistItem | null>(null);

  const loadItems = async () => {
    if (!user) return;
    let { data: wishlist } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!wishlist) {
      const { data: newWishlist } = await supabase
        .from('wishlists')
        .insert({ user_id: user.id })
        .select('id')
        .single();
      wishlist = newWishlist;
    }

    if (wishlist) {
      const wishlistItems = await fetchWishlistWithProducts(wishlist.id);
      setItems(wishlistItems);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const confirmRemove = async () => {
    if (!removeTarget) return;
    await supabase.from('wishlist_items').delete().eq('id', removeTarget.id);
    setItems((prev) => prev.filter((i) => i.id !== removeTarget.id));
    setRemoveTarget(null);
  };

  return (
    <div className="min-h-screen bg-forge-black pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="text-forge-gold" size={24} />
            <p className="text-xs font-sans tracking-widest uppercase text-forge-gold/70">
              {profile?.display_name ? `Welcome, ${profile.display_name}` : 'Your Collection'}
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-gray-100">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-2">
            {loading ? 'Loading...' : `${items.length} ${items.length === 1 ? 'piece' : 'pieces'} saved`}
          </p>
        </div>

        {/* Wishlist grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-forge-gold/30 border-t-forge-gold rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="text-forge-ash/50 mx-auto mb-6" size={48} strokeWidth={1} />
            <p className="text-xl font-serif text-gray-400 italic mb-2">Your wishlist is empty.</p>
            <p className="text-sm text-gray-600 mb-8">Browse the catalog and save pieces that catch your eye.</p>
            <Link to="/catalog">
              <Button variant="gold">Browse the Catalog</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="relative group">
                {item.product && (
                  <ProductCard product={item.product} />
                )}
                <button
                  onClick={() => setRemoveTarget(item)}
                  className="absolute top-3 right-3 z-10 p-2 bg-forge-black/80 border border-forge-ash/30 rounded-sm text-gray-400 hover:text-red-400 hover:border-red-700/40 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-700/30"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remove confirmation modal */}
      <Modal open={!!removeTarget} onClose={() => setRemoveTarget(null)} title="Remove from wishlist?" size="sm">
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          Are you sure you want to remove{' '}
          <span className="text-forge-gold font-serif text-base">{removeTarget?.product?.name}</span>{' '}
          from your wishlist? You can always add it back later.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setRemoveTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmRemove}>Remove</Button>
        </div>
      </Modal>
    </div>
  );
}

// ==================== ADMIN DASHBOARD ====================
function AdminDashboard() {
  const { profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const loadProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error) setProducts(data as Product[] ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from('products').delete().eq('id', deleteTarget.id);
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSave = () => {
    handleFormClose();
    loadProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-forge-black pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-forge-gold" size={24} />
              <p className="text-xs font-sans tracking-widest uppercase text-forge-gold/70">
                {profile?.display_name ? `Admin — ${profile.display_name}` : 'Administrator'}
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-gray-100">Catalog Management</h1>
            <p className="text-sm text-gray-500 mt-2">
              {loading ? 'Loading...' : `${products.length} ${products.length === 1 ? 'piece' : 'pieces'} in the catalog`}
            </p>
          </div>
          <Button variant="gold" onClick={() => setShowForm(true)}>
            <Plus size={18} /> Add New Piece
          </Button>
        </div>

        {/* Products table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-forge-gold/30 border-t-forge-gold rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <Package className="text-forge-ash/50 mx-auto mb-6" size={48} strokeWidth={1} />
            <p className="text-xl font-serif text-gray-400 italic mb-2">The catalog is empty.</p>
            <p className="text-sm text-gray-600 mb-8">Add your first piece to begin.</p>
            <Button variant="gold" onClick={() => setShowForm(true)}>
              <Plus size={18} /> Add New Piece
            </Button>
          </div>
        ) : (
          <div className="card-surface overflow-hidden">
            {/* Desktop table */}
            <table className="hidden md:table w-full">
              <thead>
                <tr className="border-b border-forge-ash/30">
                  <th className="text-left px-5 py-4 label-text">Name</th>
                  <th className="text-left px-5 py-4 label-text">Category</th>
                  <th className="text-left px-5 py-4 label-text">Era</th>
                  <th className="text-left px-5 py-4 label-text">Grip</th>
                  <th className="text-right px-5 py-4 label-text">Price</th>
                  <th className="text-right px-5 py-4 label-text">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-forge-ash/15 hover:bg-forge-graphite/40 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm font-serif text-gray-200">{product.name}</span>
                      {product.featured && (
                        <span className="ml-2 text-[10px] tracking-widest uppercase text-forge-gold/60">Featured</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{CATEGORY_LABELS[product.category]}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{ERA_LABELS[product.era]}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{GRIP_LABELS[product.grip_type]}</td>
                    <td className="px-5 py-4 text-sm text-forge-gold text-right">${product.price.toLocaleString('en-US')}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-500 hover:text-forge-gold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-forge-gold/30 rounded-sm"
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="p-2 text-gray-500 hover:text-red-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-700/30 rounded-sm"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-forge-ash/15">
              {products.map((product) => (
                <div key={product.id} className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-serif text-gray-200">{product.name}</p>
                      {product.featured && (
                        <span className="text-[10px] tracking-widest uppercase text-forge-gold/60">Featured</span>
                      )}
                    </div>
                    <span className="text-sm text-forge-gold">${product.price.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {CATEGORY_LABELS[product.category]} · {ERA_LABELS[product.era]} · {GRIP_LABELS[product.grip_type]}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)} className="p-1.5 text-gray-500 hover:text-forge-gold transition-colors" aria-label="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(product)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors" aria-label="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product form modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}

      {/* Delete confirmation modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete piece?" size="sm">
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          Are you sure you want to permanently delete{' '}
          <span className="text-forge-gold font-serif text-base">{deleteTarget?.name}</span>{' '}
          from the catalog? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

// ==================== PRODUCT FORM ====================
function ProductForm({ product, onClose, onSave }: {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(product?.name ?? '');
  const [category, setCategory] = useState<SwordCategory>(product?.category ?? 'rapier');
  const [era, setEra] = useState<Era>(product?.era ?? '16th');
  const [gripType, setGripType] = useState<GripType>(product?.grip_type ?? 'single_hand');
  const [bladeLength, setBladeLength] = useState(product?.blade_length_cm?.toString() ?? '');
  const [weight, setWeight] = useState(product?.weight_g?.toString() ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [shortDesc, setShortDesc] = useState(product?.short_description ?? '');
  const [longDesc, setLongDesc] = useState(product?.long_description ?? '');
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '');
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !shortDesc || !price) {
      setError('Name, short description, and price are required.');
      return;
    }

    setSaving(true);

    const payload = {
      name,
      category,
      era,
      grip_type: gripType,
      blade_length_cm: bladeLength ? parseFloat(bladeLength) : null,
      weight_g: weight ? parseInt(weight) : null,
      price: parseFloat(price),
      short_description: shortDesc,
      long_description: longDesc || null,
      image_url: imageUrl || null,
      featured,
    };

    if (product) {
      const { error: updateError } = await supabase.from('products').update(payload).eq('id', product.id);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from('products').insert(payload);
      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    onSave();
  };

  return (
    <Modal open={true} onClose={onClose} title={product ? 'Edit Piece' : 'Add New Piece'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Name" name="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Venetian Swept-Hilt Rapier" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as SwordCategory)}
            options={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
          />
          <Select
            label="Era"
            name="era"
            value={era}
            onChange={(e) => setEra(e.target.value as Era)}
            options={Object.entries(ERA_LABELS).map(([value, label]) => ({ value, label }))}
          />
          <Select
            label="Grip Type"
            name="gripType"
            value={gripType}
            onChange={(e) => setGripType(e.target.value as GripType)}
            options={Object.entries(GRIP_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Blade Length (cm)" type="number" name="bladeLength" value={bladeLength} onChange={(e) => setBladeLength(e.target.value)} placeholder="e.g. 102" step="0.1" />
          <Input label="Weight (g)" type="number" name="weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 1250" />
          <Input label="Price (USD)" type="number" name="price" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="e.g. 3200" step="0.01" />
        </div>

        <Input label="Short Description" name="shortDesc" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} required placeholder="One-line catalog description" />

        <div>
          <label className="label-text" htmlFor="longDesc">Long Description</label>
          <textarea
            id="longDesc"
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
            rows={4}
            className="input-field resize-none"
            placeholder="Fuller description for the detail view"
          />
        </div>

        <Input label="Image URL" name="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="/placeholders/example.svg" />

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 accent-forge-gold cursor-pointer"
          />
          <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            Feature on landing page
          </span>
        </label>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-800/30 rounded-sm px-4 py-3">
            <X size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : product ? 'Save Changes' : 'Add Piece'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
