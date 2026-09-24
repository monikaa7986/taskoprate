-- ===================================================
-- SAMPLE SEED DATA FOR CLOTHING E-COMMERCE (SQL)
-- ===================================================

-- Store Settings
INSERT OR IGNORE INTO store_settings (setting_key, setting_value) VALUES
('store_name', 'ATELIER & CO.'),
('store_tagline', 'Contemporary Elegance & Timeless Wardrobe Essentials'),
('currency_symbol', '$'),
('tax_rate_percent', '8.5'),
('free_shipping_threshold', '150'),
('standard_shipping_rate', '12.00'),
('support_email', 'concierge@atelierclothing.com'),
('support_phone', '+1 (800) 492-8350');

-- Demo Users (Passwords are bcrypt hashes: admin123, password123)
-- Admin: admin@atelier.com / admin123
-- Customer: customer@atelier.com / password123
INSERT OR IGNORE INTO users (id, name, email, password_hash, role, phone, address, city, state, postal_code, country) VALUES
(1, 'Alexandre Vance', 'admin@atelier.com', '$2a$10$w850h1W7E0iN5vj.iM7wve3sE54bK8d05K0y4R5.h/4t3bK6G7m.K', 'admin', '+1 (555) 019-2834', '740 Fifth Avenue, Floor 18', 'New York', 'NY', '10019', 'United States'),
(2, 'Sophia Laurent', 'customer@atelier.com', '$2a$10$w850h1W7E0iN5vj.iM7wve3sE54bK8d05K0y4R5.h/4t3bK6G7m.K', 'customer', '+1 (555) 782-9901', '124 Mercer Street, Loft 4A', 'New York', 'NY', '10012', 'United States');

-- Active Coupons
INSERT OR IGNORE INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, is_active) VALUES
('WELCOME10', 'Welcome 10% discount on your first order', 'percentage', 10, 50, 50, 1),
('LUXE20', '20% discount on orders over $150', 'percentage', 20, 150, 100, 1),
('ATELIER50', '$50 flat reduction on orders over $250', 'fixed', 50, 250, 50, 1);
