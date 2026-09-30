-- =========================================================================
-- ESQUEMA DE BASE DE DATOS SUPABASE: DIRECTORIO DE AGREMIADOS
-- CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA (CGEM)
-- =========================================================================

-- 1. Crear tabla principal de agremiados
CREATE TABLE IF NOT EXISTS public.directorio_agremiados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_afiliado TEXT UNIQUE NOT NULL,
    nombre_establecimiento TEXT NOT NULL,
    categoria_negocio TEXT NOT NULL, -- 'Grandes Empresas (20+ empleados)', 'Empresas (5-19 empleados)', 'Marca Personal y Emprendimientos'
    representante_legal TEXT NOT NULL,
    rif_cedula TEXT,
    telefono TEXT NOT NULL,
    email TEXT NOT NULL,
    direccion_completa TEXT,
    municipio TEXT DEFAULT 'Libertador',
    instagram TEXT,
    sitio_web TEXT,
    numero_empleados INTEGER DEFAULT 1,
    estado_solvencia TEXT DEFAULT 'Solvente (Activo)', -- 'Solvente (Activo)', 'En Revisión', 'Pendiente de Pago', 'Inactivo'
    monto_inscripcion NUMERIC(10,2) DEFAULT 30.00,
    monto_cuota_mensual NUMERIC(10,2) DEFAULT 20.00,
    fecha_registro TIMESTAMPTZ DEFAULT NOW(),
    fecha_vencimiento TIMESTAMPTZ,
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear índices para búsquedas ultra rápidas
CREATE INDEX IF NOT EXISTS idx_directorio_codigo ON public.directorio_agremiados(codigo_afiliado);
CREATE INDEX IF NOT EXISTS idx_directorio_nombre ON public.directorio_agremiados(nombre_establecimiento);
CREATE INDEX IF NOT EXISTS idx_directorio_categoria ON public.directorio_agremiados(categoria_negocio);
CREATE INDEX IF NOT EXISTS idx_directorio_estado ON public.directorio_agremiados(estado_solvencia);
CREATE INDEX IF NOT EXISTS idx_directorio_email ON public.directorio_agremiados(email);

-- 3. Trigger para actualizar automaticamente updated_at
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

-- 4. Habilitar Seguridad por Fila (Row Level Security - RLS)
ALTER TABLE public.directorio_agremiados ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Acceso:
-- Lectura pública o para roles autorizados
CREATE POLICY "Permitir lectura del directorio de agremiados" 
ON public.directorio_agremiados 
FOR SELECT 
USING (true);

-- Inserción / Creación de agremiados
CREATE POLICY "Permitir insercion en directorio de agremiados" 
ON public.directorio_agremiados 
FOR INSERT 
WITH CHECK (true);

-- Actualización de agremiados
CREATE POLICY "Permitir actualizacion en directorio de agremiados" 
ON public.directorio_agremiados 
FOR UPDATE 
USING (true);

-- Eliminación de agremiados
CREATE POLICY "Permitir eliminacion en directorio de agremiados" 
ON public.directorio_agremiados 
FOR DELETE 
USING (true);

-- 6. Insertar registro inicial oficial de Kaffia Caffe
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
    'kaffia@meridagastronomica.com',
    'Av. 4 entre Calles 19 y 20, Centro Histórico',
    'Libertador',
    '@kaffiacaffe',
    'https://www.meridagastronomica.com',
    12,
    'Solvente (Activo)',
    30.00,
    20.00,
    'Miembro Fundador. Establecimiento piloto de Café de Especialidad y Certificación de Calidad.'
) ON CONFLICT (codigo_afiliado) DO NOTHING;
