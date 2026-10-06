-- =========================================================================
-- ESQUEMA DE BASE DE DATOS SUPABASE: DIRECTORIO DE AGREMIADOS & GALERÍA (CGEM)
-- CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA
-- =========================================================================

-- 1. Crear tabla principal de agremiados (con soporte de fotos y galería)
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
    foto_portada TEXT,
    fotos_galeria JSONB DEFAULT '[]'::jsonb,
    visible_en_guia BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asegurar que las columnas existan si la tabla ya había sido creada previamente
ALTER TABLE public.directorio_agremiados ADD COLUMN IF NOT EXISTS foto_portada TEXT;
ALTER TABLE public.directorio_agremiados ADD COLUMN IF NOT EXISTS fotos_galeria JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.directorio_agremiados ADD COLUMN IF NOT EXISTS visible_en_guia BOOLEAN DEFAULT true;

-- 2. Crear índices de búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_directorio_codigo ON public.directorio_agremiados(codigo_afiliado);
CREATE INDEX IF NOT EXISTS idx_directorio_nombre ON public.directorio_agremiados(nombre_establecimiento);
CREATE INDEX IF NOT EXISTS idx_directorio_categoria ON public.directorio_agremiados(categoria_negocio);
CREATE INDEX IF NOT EXISTS idx_directorio_estado ON public.directorio_agremiados(estado_solvencia);
CREATE INDEX IF NOT EXISTS idx_directorio_email ON public.directorio_agremiados(email);

-- 3. Trigger de actualización automática de updated_at
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

-- =========================================================================
-- 5. CONFIGURACIÓN DE SUPABASE STORAGE PARA FOTOS DE AGREMIADOS
-- Bucket: 'directorio-fotos' (Público para lectura rápida)
-- =========================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'directorio-fotos',
    'directorio-fotos',
    true,
    5242880, -- 5 MB límite por archivo (el conversor client-side los reduce a < 100 KB)
    ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/jpg'];

-- Políticas de Seguridad RLS para Storage de fotos
DROP POLICY IF EXISTS "Permitir lectura publica fotos agremiados" ON storage.objects;
CREATE POLICY "Permitir lectura publica fotos agremiados"
ON storage.objects FOR SELECT
TO public, anon, authenticated
USING (bucket_id = 'directorio-fotos');

DROP POLICY IF EXISTS "Permitir subir fotos agremiados" ON storage.objects;
CREATE POLICY "Permitir subir fotos agremiados"
ON storage.objects FOR INSERT
TO public, anon, authenticated
WITH CHECK (bucket_id = 'directorio-fotos');

DROP POLICY IF EXISTS "Permitir actualizar fotos agremiados" ON storage.objects;
CREATE POLICY "Permitir actualizar fotos agremiados"
ON storage.objects FOR UPDATE
TO public, anon, authenticated
USING (bucket_id = 'directorio-fotos');

DROP POLICY IF EXISTS "Permitir borrar fotos agremiados" ON storage.objects;
CREATE POLICY "Permitir borrar fotos agremiados"
ON storage.objects FOR DELETE
TO public, anon, authenticated
USING (bucket_id = 'directorio-fotos');

-- =========================================================================
-- 6. Registro oficial de Kaffia Caffe con sus 5 fotos oficiales
-- =========================================================================
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
    foto_portada,
    fotos_galeria,
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
    '/images/kaffia/kaffia-fachada-hd.jpg',
    '["/images/kaffia/kaffia-fachada-hd.jpg", "/images/kaffia/kaffia-salon-banquete.jpg", "/images/kaffia/kaffia-plato-gourmet.jpg", "/images/kaffia/kaffia-entrante-autor.jpg", "/images/kaffia/kaffia-cena-vino.jpg"]'::jsonb,
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
    foto_portada = EXCLUDED.foto_portada,
    fotos_galeria = EXCLUDED.fotos_galeria,
    observaciones = EXCLUDED.observaciones,
    updated_at = NOW();
