-- ==============================================================================
-- CAMINATA 5K "CAMINA Y RENACE CON DREAM HOME 2026"
-- Campaña: "Una Pañoleta con Propósito" - Mes Rosa
-- Esquema de Base de Datos para Supabase
-- ==============================================================================

-- 1. Habilitar extensión UUID si no está activa
create extension if not exists "uuid-ossp";

-- 2. Crear tabla registrations
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  first_name text not null,
  last_name text not null,
  cedula text not null unique,
  birth_date date not null,
  phone text not null,
  email text not null,
  emergency_contact_phone text not null,
  emergency_contact_name text not null,
  -- Modalidad de Kit y Pago
  kit_type text not null default 'basico' check (kit_type in ('basico', 'premium')),
  shirt_size text null,
  payment_reference text not null default '',
  payment_amount numeric not null default 10,
  -- Comprobante y Estado
  payment_proof_url text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  bib_number integer null unique,
  notes text null
);

-- Si la tabla ya existía previamente, agregar las columnas si faltan:
alter table public.registrations add column if not exists kit_type text not null default 'basico' check (kit_type in ('basico', 'premium'));
alter table public.registrations add column if not exists shirt_size text null;
alter table public.registrations add column if not exists payment_reference text not null default '';
alter table public.registrations add column if not exists payment_amount numeric not null default 10;

-- 3. Crear índices para optimizar búsquedas por cédula, email, estado y referencia
create index if not exists idx_registrations_cedula on public.registrations(cedula);
create index if not exists idx_registrations_email on public.registrations(email);
create index if not exists idx_registrations_status on public.registrations(status);
create index if not exists idx_registrations_created_at on public.registrations(created_at desc);
create index if not exists idx_registrations_payment_ref on public.registrations(payment_reference);

-- 4. Habilitar Row Level Security (RLS)
alter table public.registrations enable row level security;

-- Política para permitir que cualquier visitante inserte un nuevo registro (Inscripción pública)
create policy "Permitir inserción pública de registros"
  on public.registrations
  for insert
  to anon, authenticated
  with check (true);

-- Política para permitir lectura pública / admin de registros
create policy "Permitir lectura individual pública"
  on public.registrations
  for select
  to anon, authenticated
  using (true);

-- Política para actualizar registros (aprobar, rechazar, asignar dorsal)
drop policy if exists "Permitir actualización a usuarios autenticados / admin" on public.registrations;
create policy "Permitir actualización de registros"
  on public.registrations
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- 5. Configuración del Storage de Supabase para Comprobantes de Pago
-- Crear el bucket de storage 'payment-proofs' si no existe
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do update set public = true;

-- Políticas de Storage para 'payment-proofs'
-- Permitir que cualquier usuario anónimo o autenticado suba su capture de pago
create policy "Permitir subida de comprobantes de pago"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'payment-proofs');

-- Permitir lectura de los comprobantes
create policy "Permitir lectura de comprobantes de pago"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'payment-proofs');

-- ==============================================================================
-- Comentario informativo sobre la asignación del bib_number:
-- El número de corredor (bib_number) inicia en 101 y puede ser asignado
-- automáticamente cuando el estatus cambia a 'approved'.
-- ==============================================================================
