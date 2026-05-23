-- supabase_schema.sql
-- Run this script in your Supabase SQL Editor to set up the database for JMD Auto Care.

-- 1. Create the products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    category TEXT,
    fullname TEXT,
    description TEXT,
    price NUMERIC,
    original_price NUMERIC,
    image_url TEXT,
    features TEXT, -- we will store features as a pipe-separated string like 'Feature 1|Feature 2'
    badge TEXT, -- e.g., 'new', 'popular', 'sale', 'pro'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy that allows ANYONE to read products
CREATE POLICY "Allow public read access to products" 
ON products 
FOR SELECT 
USING (true);

-- 4. Create a policy that allows only authenticated users to insert/update/delete (Optional, for admin dashboard)
CREATE POLICY "Allow authenticated users to modify products" 
ON products 
FOR ALL 
USING (auth.role() = 'authenticated');

-- 5. Insert Sample Data (Optional, but helps with testing)
INSERT INTO products (name, brand, category, fullname, description, price, original_price, image_url, features, badge)
VALUES
('turtle wax ice shine spray wax polish', 'Turtle Wax', 'chemicals', 'Turtle Wax ICE Shine Spray', 'Fast-acting spray wax with polymer bonding for a brilliant mirror-finish shine on all paint types.', 699, NULL, 'assets/product_turtle_wax.png', 'Works on all paint types|Polymers for lasting protection|Ready-to-use spray|Streak-free finish', 'popular'),
('wavex foam wash car shampoo ph neutral', 'Wavex Auto Care', 'chemicals', 'Wavex Foam Wash Car Shampoo', 'pH-neutral concentrated shampoo that creates thick foam to safely lift dirt without harming your paint.', 449, NULL, 'assets/product_foam_shampoo.png', 'pH neutral — safe for paint|High foam concentration|Remove dirt without scratching|Compatible with foam cannons', 'new'),
('ceramic coating kit pro paint protection jmd', 'JMD Pro', 'protection', 'JMD Pro Ceramic Coating Kit', 'Nano-ceramic paint protection with 12-month durability. Repels water, UV, and dust with a mirror gloss finish.', 2499, NULL, 'assets/product_ceramic_coat.png', 'Nano-ceramic technology|Up to 12-month protection|Repels water, UV, and dust|Minor scratch resistance|Mirror-like gloss finish', 'pro'),
('microfiber towels detailing cloths cleaning', 'JMD Detailing', 'tools', 'Microfiber Detailing Towels (Pack of 5)', '400 GSM ultra-soft towels that absorb 8x their weight. Machine washable and safe on all vehicle surfaces.', 399, NULL, 'assets/product_microfiber.png', '400 GSM ultra-soft fiber|8x absorption capacity|Safe on all surfaces|Machine washable|Pack of 5 towels', 'popular'),
('jopasu car duster exterior cleaning dust brush', 'JOPASU', 'tools', 'JOPASU Car Duster', 'India''s favourite car duster with treated cotton strands that trap dust safely without scratching your paint.', 599, NULL, 'assets/product_jopasu.png', 'Treated cotton strands|Scratch-safe on paint|Traps and locks dust|Retractable handle|Includes carry case', 'popular'),
('wavex tyre shine spray tire black wet look', 'Wavex Auto Care', 'chemicals', 'Wavex Tyre Shine & Protectant Spray', 'Restores deep black wet-look finish to tyres while conditioning rubber against UV cracking and fading.', 349, NULL, 'assets/product_tire_shine.png', 'Deep wet-look black finish|UV protection for rubber|Anti-crack conditioning|Long-lasting formula|Quick spray application', 'new');
