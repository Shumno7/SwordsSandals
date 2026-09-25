import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  detectSessionInUrl: true,
  },
});

export type SwordCategory = 'rapier' | 'smallsword' | 'longsword' | 'bastard_sword' | 'greatsword';
export type Era = '16th' | '17th' | '18th' | '19th';
export type GripType = 'single_hand' | 'hand_and_a_half' | 'two_handed';
export type UserRole = 'customer' | 'admin';

export interface Product {
  id: string;
  name: string;
  category: SwordCategory;
  era: Era;
  blade_length_cm: number | null;
  weight_g: number | null;
  grip_type: GripType;
  price: number;
  short_description: string;
  long_description: string | null;
  image_url: string | null;
  featured: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string | null;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export const CATEGORY_LABELS: Record<SwordCategory, string> = {
  rapier: 'Rapier',
  smallsword: 'Smallsword',
  longsword: 'Longsword',
  bastard_sword: 'Bastard Sword',
  greatsword: 'Greatsword',
};

export const ERA_LABELS: Record<Era, string> = {
  '16th': '16th Century',
  '17th': '17th Century',
  '18th': '18th Century',
  '19th': '19th Century',
};

export const GRIP_LABELS: Record<GripType, string> = {
  single_hand: 'Single-Hand',
  hand_and_a_half: 'Hand-and-a-Half',
  two_handed: 'Two-Handed',
};
