-- =========================================================================
-- ESQUEMA DE BASE DE DATOS SUPABASE: DIRECTORIO DE AGREMIADOS (CGEM)
-- CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA
-- =========================================================================

-- 1. Crear tabla principal de agremiados
CREATE TABLE IF NOT EXISTS public.directorio_agremiados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_afiliado TEXT UNIQUE NOT NULL,
    nombre_establecimiento TEXT NOT NULL,
    categoria_negocio TEXT NOT NULL,
    representante_legal TEXT NOT NULL,
    rif_cedula TEXT,
    telefono TEXT NOT NULL,
    email TEXT NOT NULL,
    direccion_completa TEXT,
    municipio TEXT DEFAULT 'Libertador (Mérida Ciudad)',
    instagram TEXT,
    sitio_web TEXT,
    numero_empleados INTEGER DEFAULT 1,
    estado_solvencia TEXT DEFAULT 'Solvente (Activo)',
    monto_inscripcion NUMERIC(10,2) DEFAULT 30.00,
    monto_cuota_mensual NUMERIC(10,2) DEFAULT 10.00,
    fecha_registro TIMESTAMPTZ DEFAULT NOW(),
    fecha_vencimiento TIMESTAMPTZ,
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear índices
CREATE INDEX IF NOT EXISTS idx_directorio_codigo ON public.directorio_agremiados(codigo_afiliado);
CREATE INDEX IF NOT EXISTS idx_directorio_nombre ON public.directorio_agremiados(nombre_establecimiento);
CREATE INDEX IF NOT EXISTS idx_directorio_categoria ON public.directorio_agremiados(categoria_negocio);
CREATE INDEX IF NOT EXISTS idx_directorio_estado ON public.directorio_agremiados(estado_solvencia);
CREATE INDEX IF NOT EXISTS idx_directorio_email ON public.directorio_agremiados(email);

-- 3. Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_directorio_updated_at ON public.directorio_agremiados;
CREATE TRIGGER trg_directorio_updated_at
    BEFORE UPDATE ON public.directorio_agremiados
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Habilitar permisos RLS para lectura y escritura desde la aplicación web
ALTER TABLE public.directorio_agremiados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de directorio" ON public.directorio_agremiados;
CREATE POLICY "Permitir lectura publica de directorio" 
ON public.directorio_agremiados 
FOR SELECT 
TO public, anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir insercion en directorio" ON public.directorio_agremiados;
CREATE POLICY "Permitir insercion en directorio" 
ON public.directorio_agremiados 
FOR INSERT 
TO public, anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizacion en directorio" ON public.directorio_agremiados;
CREATE POLICY "Permitir actualizacion en directorio" 
ON public.directorio_agremiados 
FOR UPDATE 
TO public, anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir eliminacion en directorio" ON public.directorio_agremiados;
CREATE POLICY "Permitir eliminacion en directorio" 
ON public.directorio_agremiados 
FOR DELETE 
TO public, anon, authenticated
USING (true);

-- Otorgar permisos directos a roles anon y authenticated
GRANT ALL ON public.directorio_agremiados TO anon, authenticated, service_role;

-- 5. Insertar o Actualizar registro oficial de Kaffia Caffe
INSERT INTO public.directorio_agremiados (
    codigo_afiliado,
    nombre_establecimiento,
    categoria_negocio,
    representante_legal,
    rif_cedula,
    telefono,
    email,
    direccion_completa,
    municipio,
    instagram,
    sitio_web,
    numero_empleados,
    estado_solvencia,
    monto_inscripcion,
    monto_cuota_mensual,
    observaciones
) VALUES (
    'CGM-2026-001',
    'Kaffia Caffe',
    'Empresas (5 a 19 empleados)',
    'Gerencia & Equipo Kaffia',
    'J-50123849-2',
    '+58 414-8817137',
    'cafe.kaffia@gmail.com',
    'Av. 8 entre Calles 24 y 25, Sector Las Heroínas, Casco Central, Mérida',
    'Libertador (Mérida Ciudad)',
    '@kaffiacaffe',
    'https://www.meridagastronomica.com',
    12,
    'Solvente (Activo)',
    30.00,
    10.00,
    'Miembro Fundador Oficial. Barismo de Especialidad, Alta Cocina y Café de Altura.'
)
ON CONFLICT (codigo_afiliado) DO UPDATE SET
    nombre_establecimiento = EXCLUDED.nombre_establecimiento,
    categoria_negocio = EXCLUDED.categoria_negocio,
    representante_legal = EXCLUDED.representante_legal,
    rif_cedula = EXCLUDED.rif_cedula,
    telefono = EXCLUDED.telefono,
    email = EXCLUDED.email,
    direccion_completa = EXCLUDED.direccion_completa,
    municipio = EXCLUDED.municipio,
    instagram = EXCLUDED.instagram,
    sitio_web = EXCLUDED.sitio_web,
    numero_empleados = EXCLUDED.numero_empleados,
    estado_solvencia = EXCLUDED.estado_solvencia,
    monto_inscripcion = EXCLUDED.monto_inscripcion,
    monto_cuota_mensual = EXCLUDED.monto_cuota_mensual,
    observaciones = EXCLUDED.observaciones,
    updated_at = NOW();
