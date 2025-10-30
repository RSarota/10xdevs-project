-- Seed data for development
-- Purpose: Insert test user and flashcards for development and testing

-- Insert test user into auth.users (required for foreign key constraint)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'f19ac690-a4c6-49b9-8f79-8fbd04d35716',
  'authenticated',
  'authenticated',
  'dev@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Insert test flashcards for DEFAULT_USER_ID
INSERT INTO flashcards (user_id, type, front, back) VALUES
  ('f19ac690-a4c6-49b9-8f79-8fbd04d35716', 'manual', 'Co to jest TypeScript?', 'TypeScript to typowany nadzbiór JavaScript, który kompiluje się do czystego JavaScript'),
  ('f19ac690-a4c6-49b9-8f79-8fbd04d35716', 'manual', 'Co to jest REST API?', 'REST (Representational State Transfer) to styl architektoniczny dla rozproszonych systemów hipermedialnych'),
  ('f19ac690-a4c6-49b9-8f79-8fbd04d35716', 'manual', 'Co to jest Supabase?', 'Supabase to otwarta alternatywa dla Firebase, oferująca PostgreSQL jako bazę danych'),
  ('f19ac690-a4c6-49b9-8f79-8fbd04d35716', 'manual', 'Co to jest Astro?', 'Astro to nowoczesny framework do budowania szybkich stron internetowych z dowolnymi frameworkami UI'),
  ('f19ac690-a4c6-49b9-8f79-8fbd04d35716', 'manual', 'Co to jest Row Level Security?', 'RLS to mechanizm bezpieczeństwa PostgreSQL, który kontroluje dostęp do wierszy na poziomie bazy danych');

