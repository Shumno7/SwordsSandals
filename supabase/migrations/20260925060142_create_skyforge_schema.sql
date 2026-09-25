/*
# Skyforge — Initial Schema

## Overview
Creates the full data model for Skyforge, a historical sword discovery and wishlist site.

## New Tables

### profiles
- `id` (uuid, PK, FK to auth.users, ON DELETE CASCADE)
- `role` (text, not null, default 'customer') — 'customer' or 'admin'
- `display_name` (text) — optional display name
- `created_at` (timestamptz, default now())

### products
- `id` (uuid, PK)
- `name` (text, not null) — display name of the sword
- `category` (text, not null) — one of: rapier, smallsword, longsword, bastard_sword, greatsword
- `era` (text, not null) — century label: '16th', '17th', '18th', '19th'
- `blade_length_cm` (numeric) — blade length in centimeters
- `weight_g` (integer) — weight in grams
- `grip_type` (text, not null) — one of: single_hand, hand_and_a_half, two_handed
- `price` (numeric, not null) — display price in USD
- `short_description` (text, not null) — one-line catalog description
- `long_description` (text) — fuller description for detail view
- `image_url` (text) — placeholder path or URL
- `featured` (boolean, default false) — shown on landing page
- `created_at` (timestamptz, default now())

### wishlists
- `id` (uuid, PK)
- `user_id` (uuid, not null, default auth.uid(), FK to auth.users, ON DELETE CASCADE)
- `created_at` (timestamptz, default now())

### wishlist_items
- `id` (uuid, PK)
- `wishlist_id` (uuid, not null, FK to wishlists, ON DELETE CASCADE)
- `product_id` (uuid, not null, FK to products, ON DELETE CASCADE)
- `created_at` (timestamptz, default now())
- UNIQUE constraint on (wishlist_id, product_id) to prevent duplicates

## Security (RLS)

### profiles
- SELECT: authenticated, owner only
- UPDATE: authenticated, owner only
- INSERT: authenticated, owner only (on signup)

### products
- SELECT: public (anon + authenticated) — catalog is browsable without login
- INSERT/UPDATE/DELETE: authenticated admins only (checked via profiles table)

### wishlists
- SELECT/INSERT/UPDATE/DELETE: authenticated, owner only

### wishlist_items
- SELECT/INSERT/UPDATE/DELETE: authenticated, owner of parent wishlist only

## Important Notes
1. profiles.id defaults to auth.uid() so new users get a profile row on signup.
2. wishlists.user_id defaults to auth.uid() so inserts work without passing user_id.
3. Admin write access on products is gated by checking profiles.role = 'admin'.
4. wishlist_items ownership is checked through the parent wishlist's user_id.
5. A trigger auto-creates a profile row on signup.
*/

-- ==================== PROFILES (must exist before products policies reference it) ====================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  display_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==================== PRODUCTS ====================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('rapier', 'smallsword', 'longsword', 'bastard_sword', 'greatsword')),
  era text NOT NULL CHECK (era IN ('16th', '17th', '18th', '19th')),
  blade_length_cm numeric,
  weight_g integer,
  grip_type text NOT NULL CHECK (grip_type IN ('single_hand', 'hand_and_a_half', 'two_handed')),
  price numeric NOT NULL,
  short_description text NOT NULL,
  long_description text,
  image_url text,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read
DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin-only write
DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ==================== WISHLISTS ====================
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_wishlists" ON wishlists;
CREATE POLICY "select_own_wishlists"
  ON wishlists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_wishlists" ON wishlists;
CREATE POLICY "insert_own_wishlists"
  ON wishlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_wishlists" ON wishlists;
CREATE POLICY "update_own_wishlists"
  ON wishlists FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_wishlists" ON wishlists;
CREATE POLICY "delete_own_wishlists"
  ON wishlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ==================== WISHLIST ITEMS ====================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id uuid NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (wishlist_id, product_id)
);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_wishlist_items" ON wishlist_items;
CREATE POLICY "select_own_wishlist_items"
  ON wishlist_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_wishlist_items" ON wishlist_items;
CREATE POLICY "insert_own_wishlist_items"
  ON wishlist_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_wishlist_items" ON wishlist_items;
CREATE POLICY "delete_own_wishlist_items"
  ON wishlist_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid())
  );

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_era ON products(era);
CREATE INDEX IF NOT EXISTS idx_products_grip_type ON products(grip_type);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist_id ON wishlist_items(wishlist_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON wishlist_items(product_id);

-- ==================== AUTO-CREATE PROFILE ON SIGNUP ====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name)
  VALUES (
    NEW.id,
    'customer',
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();