-- PASO 1: Ejecutar este SQL en Supabase (Editor SQL)

-- Tabla de Empleados
create table if not exists employees (
  id text primary key,
  name text not null,
  position text not null,
  email text,
  bloodType text,
  phone text,
  address text,
  photo_url text, -- Guardaremos la URL de Supabase Storage
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabla para rastro de configuración inicial
create table if not exists admin_config (
  id uuid primary key default gen_random_uuid(),
  setup_completed boolean default true,
  admin_email text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS
alter table employees enable row level security;
alter table admin_config enable row level security;

-- Políticas
create policy "Lectura pública" on employees for select using (true);
create policy "Inserción permitida" on employees for insert with check (true);
create policy "Eliminación permitida" on employees for delete using (true);
create policy "Lectura config" on admin_config for select using (true);
create policy "Inserción config" on admin_config for insert with check (true);

-- PASO 2: Crear un BUCKET en Supabase Storage
-- Nombre: employee-photos
-- Modo: Público (Public)
