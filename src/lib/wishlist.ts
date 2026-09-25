import { useState, useEffect } from 'react';
import { supabase, type Product, type WishlistItem } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export function useWishlist() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [wishlistId, setWishlistId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setWishlistItems(new Set());
      setWishlistId(null);
      return;
    }

    (async () => {
      // Get or create wishlist
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
        setWishlistId(wishlist.id);
        const { data: items } = await supabase
          .from('wishlist_items')
          .select('product_id')
          .eq('wishlist_id', wishlist.id);
        setWishlistItems(new Set(items?.map((i: { product_id: string }) => i.product_id) ?? []));
      }
    })();
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    if (!user || !wishlistId) return;

    if (wishlistItems.has(productId)) {
      setWishlistItems((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('wishlist_id', wishlistId)
        .eq('product_id', productId);
    } else {
      setWishlistItems((prev) => {
        const next = new Set(prev);
        next.add(productId);
        return next;
      });
      await supabase
        .from('wishlist_items')
        .insert({ wishlist_id: wishlistId, product_id: productId });
    }
  };

  const isInWishlist = (productId: string) => wishlistItems.has(productId);

  return { wishlistItems, wishlistId, toggleWishlist, isInWishlist };
}

export async function fetchWishlistWithProducts(wishlistId: string): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select(`
      id,
      wishlist_id,
      product_id,
      created_at,
      product:products(*)
    `)
    .eq('wishlist_id', wishlistId)
    .order('created_at', { ascending: false });

  if (error) return [];

  return (data ?? []).map((item: { id: string; wishlist_id: string; product_id: string; created_at: string; product: Product | Product[] }) => ({
    id: item.id,
    wishlist_id: item.wishlist_id,
    product_id: item.product_id,
    created_at: item.created_at,
    product: Array.isArray(item.product) ? item.product[0] : item.product,
  }));
}
