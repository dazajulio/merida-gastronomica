-- =========================================================================
-- TABLAS COMPLEMENTARIAS PARA EL FUNCIONAMIENTO TOTAL DE LA PLATAFORMA
-- =========================================================================

-- 1. TABLA: MENSAJES Y COMUNICACIONES DIRECTAS A LA JUNTA DIRECTIVA
CREATE TABLE IF NOT EXISTS public.mensajes_directiva (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remitente_restaurante TEXT NOT NULL,
    remitente_codigo TEXT,
    destinatario_cargo TEXT NOT NULL,
    asunto TEXT,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    leido BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mensajes_directiva ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir insertar mensajes directiva" ON public.mensajes_directiva;
CREATE POLICY "Permitir insertar mensajes directiva" 
ON public.mensajes_directiva FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leer mensajes directiva" ON public.mensajes_directiva;
CREATE POLICY "Permitir leer mensajes directiva" 
ON public.mensajes_directiva FOR SELECT 
TO public, anon, authenticated 
USING (true);

GRANT ALL ON public.mensajes_directiva TO anon, authenticated, service_role;


-- 2. TABLA: PERFILES Y COORDENADAS DE AFILIADOS (Respaldo GPS / Lidar)
CREATE TABLE IF NOT EXISTS public.affiliate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_code TEXT UNIQUE,
    latitude NUMERIC(10,6),
    longitude NUMERIC(10,6),
    altitude INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.affiliate_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir todo affiliate_profiles" ON public.affiliate_profiles;
CREATE POLICY "Permitir todo affiliate_profiles" 
ON public.affiliate_profiles FOR ALL 
TO public, anon, authenticated 
USING (true)
WITH CHECK (true);

GRANT ALL ON public.affiliate_profiles TO anon, authenticated, service_role;
