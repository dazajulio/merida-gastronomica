-- =========================================================================
-- ESQUEMA DE BASE DE DATOS SUPABASE: EVENTOS OFICIALES, CURSOS & INSCRIPCIONES
-- CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA (CGEM)
-- =========================================================================

-- 1. TABLA: EVENTOS OFICIALES & FESTIVALES (Agenda Anual de Mérida)
CREATE TABLE IF NOT EXISTS public.eventos_oficiales (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    month TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT DEFAULT 'Festival Gastronómico',
    badge TEXT DEFAULT 'Evento Oficial 2026',
    access_type TEXT DEFAULT 'mixed', -- 'free' | 'paid' | 'mixed'
    price_tiers JSONB DEFAULT '[]'::jsonb,
    ticket_price TEXT,
    is_pago_movil_enabled BOOLEAN DEFAULT true,
    pago_movil_bank TEXT DEFAULT '0108 - Banco Provincial',
    pago_movil_ci TEXT DEFAULT 'V-12517086',
    pago_movil_phone TEXT DEFAULT '0414-8817137',
    description TEXT,
    highlights JSONB DEFAULT '[]'::jsonb,
    image TEXT,
    image_aspect TEXT DEFAULT '9:16',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de eventos
CREATE INDEX IF NOT EXISTS idx_eventos_month ON public.eventos_oficiales(month);
CREATE INDEX IF NOT EXISTS idx_eventos_category ON public.eventos_oficiales(category);
CREATE INDEX IF NOT EXISTS idx_eventos_created ON public.eventos_oficiales(created_at DESC);

-- Trigger de updated_at para eventos
DROP TRIGGER IF EXISTS trg_eventos_updated_at ON public.eventos_oficiales;
CREATE TRIGGER trg_eventos_updated_at
    BEFORE UPDATE ON public.eventos_oficiales
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas de Seguridad RLS para eventos_oficiales
ALTER TABLE public.eventos_oficiales ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de eventos" ON public.eventos_oficiales;
CREATE POLICY "Permitir lectura publica de eventos" 
ON public.eventos_oficiales FOR SELECT 
TO public, anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Permitir insertar eventos" ON public.eventos_oficiales;
CREATE POLICY "Permitir insertar eventos" 
ON public.eventos_oficiales FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizar eventos" ON public.eventos_oficiales;
CREATE POLICY "Permitir actualizar eventos" 
ON public.eventos_oficiales FOR UPDATE 
TO public, anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Permitir eliminar eventos" ON public.eventos_oficiales;
CREATE POLICY "Permitir eliminar eventos" 
ON public.eventos_oficiales FOR DELETE 
TO public, anon, authenticated 
USING (true);

GRANT ALL ON public.eventos_oficiales TO anon, authenticated, service_role;


-- =========================================================================
-- 2. TABLA: CURSOS & CAPACITACIONES ACADEMIA GASTRONÓMICA
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.cursos_academia (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    hours TEXT DEFAULT '16 Horas Académicas',
    dates TEXT,
    schedule TEXT DEFAULT '09:00 AM - 01:00 PM',
    instructor TEXT,
    location TEXT DEFAULT 'Sede CGEM / Laboratorio ULA',
    is_online BOOLEAN DEFAULT false,
    category TEXT DEFAULT 'Formación Gastronómica',
    badge TEXT DEFAULT 'Certificación Oficial 2026',
    access_type TEXT DEFAULT 'mixed', -- 'free' | 'paid' | 'mixed'
    price_tiers JSONB DEFAULT '[]'::jsonb,
    ticket_price TEXT,
    is_pago_movil_enabled BOOLEAN DEFAULT true,
    pago_movil_bank TEXT DEFAULT '0108 - Banco Provincial',
    pago_movil_ci TEXT DEFAULT 'V-12517086',
    pago_movil_phone TEXT DEFAULT '0414-8817137',
    description TEXT,
    spots INTEGER DEFAULT 25,
    price_member_text TEXT DEFAULT 'Gratuito para Miembros Solventes',
    price_general_usd NUMERIC(10,2) DEFAULT 35.00,
    image TEXT,
    image_aspect TEXT DEFAULT '9:16',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MIGRACIÓN / ACTUALIZACIÓN: Si la tabla ya fue creada previamente, ejecutar estas líneas:
ALTER TABLE public.cursos_academia ADD COLUMN IF NOT EXISTS badge TEXT DEFAULT 'Certificación Oficial 2026';
ALTER TABLE public.cursos_academia ADD COLUMN IF NOT EXISTS access_type TEXT DEFAULT 'mixed';
ALTER TABLE public.cursos_academia ADD COLUMN IF NOT EXISTS price_tiers JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.cursos_academia ADD COLUMN IF NOT EXISTS ticket_price TEXT;
ALTER TABLE public.cursos_academia ADD COLUMN IF NOT EXISTS is_pago_movil_enabled BOOLEAN DEFAULT true;
ALTER TABLE public.cursos_academia ADD COLUMN IF NOT EXISTS pago_movil_bank TEXT DEFAULT '0108 - Banco Provincial';
ALTER TABLE public.cursos_academia ADD COLUMN IF NOT EXISTS pago_movil_ci TEXT DEFAULT 'V-12517086';
ALTER TABLE public.cursos_academia ADD COLUMN IF NOT EXISTS pago_movil_phone TEXT DEFAULT '0414-8817137';
ALTER TABLE public.cursos_academia ADD COLUMN IF NOT EXISTS image_aspect TEXT DEFAULT '9:16';

CREATE INDEX IF NOT EXISTS idx_cursos_category ON public.cursos_academia(category);
CREATE INDEX IF NOT EXISTS idx_cursos_created ON public.cursos_academia(created_at DESC);

DROP TRIGGER IF EXISTS trg_cursos_updated_at ON public.cursos_academia;
CREATE TRIGGER trg_cursos_updated_at
    BEFORE UPDATE ON public.cursos_academia
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS para cursos_academia
ALTER TABLE public.cursos_academia ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de cursos" ON public.cursos_academia;
CREATE POLICY "Permitir lectura publica de cursos" 
ON public.cursos_academia FOR SELECT 
TO public, anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Permitir insertar cursos" ON public.cursos_academia;
CREATE POLICY "Permitir insertar cursos" 
ON public.cursos_academia FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizar cursos" ON public.cursos_academia;
CREATE POLICY "Permitir actualizar cursos" 
ON public.cursos_academia FOR UPDATE 
TO public, anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Permitir eliminar cursos" ON public.cursos_academia;
CREATE POLICY "Permitir eliminar cursos" 
ON public.cursos_academia FOR DELETE 
TO public, anon, authenticated 
USING (true);

GRANT ALL ON public.cursos_academia TO anon, authenticated, service_role;


-- =========================================================================
-- 3. TABLA: INSCRIPCIONES Y RESERVAS DE EVENTOS (RSVPs)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.inscripciones_eventos (
    id TEXT PRIMARY KEY,
    event_id TEXT,
    event_title TEXT NOT NULL,
    tier_id TEXT,
    tier_name TEXT,
    tier_price_usd NUMERIC(10,2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT false,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    affiliate_code TEXT,
    institution_or_role TEXT,
    payment_ref TEXT,
    payment_bank TEXT,
    status TEXT DEFAULT 'pendiente_conciliacion', -- 'confirmado' | 'pendiente_conciliacion'
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inscripciones_event_id ON public.inscripciones_eventos(event_id);
CREATE INDEX IF NOT EXISTS idx_inscripciones_email ON public.inscripciones_eventos(email);
CREATE INDEX IF NOT EXISTS idx_inscripciones_status ON public.inscripciones_eventos(status);

ALTER TABLE public.inscripciones_eventos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura de inscripciones eventos" ON public.inscripciones_eventos;
CREATE POLICY "Permitir lectura de inscripciones eventos" 
ON public.inscripciones_eventos FOR SELECT 
TO public, anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Permitir insercion de inscripciones eventos" ON public.inscripciones_eventos;
CREATE POLICY "Permitir insercion de inscripciones eventos" 
ON public.inscripciones_eventos FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizar inscripciones eventos" ON public.inscripciones_eventos;
CREATE POLICY "Permitir actualizar inscripciones eventos" 
ON public.inscripciones_eventos FOR UPDATE 
TO public, anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Permitir borrar inscripciones eventos" ON public.inscripciones_eventos;
CREATE POLICY "Permitir borrar inscripciones eventos" 
ON public.inscripciones_eventos FOR DELETE 
TO public, anon, authenticated 
USING (true);

GRANT ALL ON public.inscripciones_eventos TO anon, authenticated, service_role;


-- =========================================================================
-- 4. TABLA: INSCRIPCIONES A CURSOS DE LA ACADEMIA
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.inscripciones_cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id TEXT,
    course_title TEXT NOT NULL,
    attendee_type TEXT DEFAULT 'afiliado', -- 'afiliado' | 'publico'
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    affiliate_code TEXT,
    payment_ref TEXT,
    payment_bank TEXT,
    status TEXT DEFAULT 'confirmado',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inscripciones_cursos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura inscripciones cursos" ON public.inscripciones_cursos;
CREATE POLICY "Permitir lectura inscripciones cursos" 
ON public.inscripciones_cursos FOR SELECT 
TO public, anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Permitir insercion inscripciones cursos" ON public.inscripciones_cursos;
CREATE POLICY "Permitir insercion inscripciones cursos" 
ON public.inscripciones_cursos FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizar inscripciones cursos" ON public.inscripciones_cursos;
CREATE POLICY "Permitir actualizar inscripciones cursos" 
ON public.inscripciones_cursos FOR UPDATE 
TO public, anon, authenticated 
USING (true);

GRANT ALL ON public.inscripciones_cursos TO anon, authenticated, service_role;
