-- Migration 007: Rename stripe columns to square
-- Run this on the existing Supabase database

-- Rename invoice columns
ALTER TABLE invoices RENAME COLUMN stripe_checkout_id TO square_checkout_id;
ALTER TABLE invoices RENAME COLUMN stripe_payment_url TO square_payment_url;

-- Rename payment columns
ALTER TABLE payments RENAME COLUMN stripe_payment_id TO square_payment_id;

-- Update the method CHECK constraint
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_method_check;
ALTER TABLE payments ADD CONSTRAINT payments_method_check 
  CHECK (method IN ('square', 'cash', 'check', 'bank_transfer', 'other'));

-- Migrate any existing 'stripe' method values
UPDATE payments SET method = 'square' WHERE method = 'stripe';
