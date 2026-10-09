-- =========================================================================
-- ESQUEMA DE BASE DE DATOS SUPABASE: MÓDULO DE TESORERÍA, CONCILIACIÓN & FINANZAS
-- CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA (CGEM)
-- Gestión Oficial: Edixon Xavier Reyes Dávila (Tesorero)
-- =========================================================================

-- 1. TABLA: PAGOS Y RECAUDACIÓN DE TESORERÍA
CREATE TABLE IF NOT EXISTS public.pagos_tesoreria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_recibo TEXT UNIQUE NOT NULL,
    codigo_afiliado TEXT,
    nombre_establecimiento TEXT NOT NULL,
    representante_legal TEXT,
    rif_cedula TEXT,
    telefono TEXT,
    email TEXT,
    concepto TEXT NOT NULL, -- 'Cuota Mensual', 'Inscripción + 1er Mes', 'Taller / Capacitación', 'Evento Especial', 'Otro'
    periodo_mes TEXT, -- ej. 'Octubre 2026', 'Noviembre 2026'
    metodo_pago TEXT NOT NULL, -- 'pago_movil', 'transferencia_nacional', 'zelle', 'efectivo_usd', 'efectivo_bs'
    banco_emisor TEXT,
    banco_receptor TEXT DEFAULT 'Banco Provincial (0108)',
    referencia TEXT NOT NULL,
    telefono_pagador TEXT,
    monto_bs NUMERIC(12,2) DEFAULT 0.00,
    tasa_bcv NUMERIC(10,2) DEFAULT 0.00,
    monto_usd NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    estado TEXT NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'conciliado', 'rechazado'
    fecha_pago TIMESTAMPTZ DEFAULT NOW(),
    fecha_conciliacion TIMESTAMPTZ,
    conciliado_por TEXT,
    comprobante_url TEXT,
    observaciones TEXT,
    motivo_rechazo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de optimización para tesorería
CREATE INDEX IF NOT EXISTS idx_pagos_estado ON public.pagos_tesoreria(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_codigo ON public.pagos_tesoreria(codigo_afiliado);
CREATE INDEX IF NOT EXISTS idx_pagos_referencia ON public.pagos_tesoreria(referencia);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha ON public.pagos_tesoreria(fecha_pago DESC);
CREATE INDEX IF NOT EXISTS idx_pagos_numero_recibo ON public.pagos_tesoreria(numero_recibo);

-- Trigger de updated_at para pagos
DROP TRIGGER IF EXISTS trg_pagos_updated_at ON public.pagos_tesoreria;
CREATE TRIGGER trg_pagos_updated_at
    BEFORE UPDATE ON public.pagos_tesoreria
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS para pagos_tesoreria
ALTER TABLE public.pagos_tesoreria ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de pagos_tesoreria" ON public.pagos_tesoreria;
CREATE POLICY "Permitir lectura publica de pagos_tesoreria" 
ON public.pagos_tesoreria FOR SELECT 
TO public, anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Permitir insercion de pagos_tesoreria" ON public.pagos_tesoreria;
CREATE POLICY "Permitir insercion de pagos_tesoreria" 
ON public.pagos_tesoreria FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizacion de pagos_tesoreria" ON public.pagos_tesoreria;
CREATE POLICY "Permitir actualizacion de pagos_tesoreria" 
ON public.pagos_tesoreria FOR UPDATE 
TO public, anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Permitir eliminacion de pagos_tesoreria" ON public.pagos_tesoreria;
CREATE POLICY "Permitir eliminacion de pagos_tesoreria" 
ON public.pagos_tesoreria FOR DELETE 
TO public, anon, authenticated 
USING (true);

GRANT ALL ON public.pagos_tesoreria TO anon, authenticated, service_role;


-- 2. TABLA: EGRESOS Y GASTOS OPERATIVOS DE LA CÁMARA
CREATE TABLE IF NOT EXISTS public.egresos_camara (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concepto TEXT NOT NULL,
    categoria TEXT NOT NULL, -- 'Eventos & Logística', 'Publicidad & Medios', 'Servicios Web & Plataforma', 'Papelería & Sede', 'Honorarios & Asesoría', 'Otros'
    monto_usd NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    monto_bs NUMERIC(12,2) DEFAULT 0.00,
    metodo_pago TEXT DEFAULT 'transferencia',
    referencia_comprobante TEXT,
    beneficiario_proveedor TEXT NOT NULL,
    fecha_gasto TIMESTAMPTZ DEFAULT NOW(),
    aprobado_por TEXT DEFAULT 'Edixon Xavier Reyes Dávila (Tesorero)',
    comprobante_url TEXT,
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_egresos_fecha ON public.egresos_camara(fecha_gasto DESC);
CREATE INDEX IF NOT EXISTS idx_egresos_categoria ON public.egresos_camara(categoria);

-- Trigger de updated_at para egresos
DROP TRIGGER IF EXISTS trg_egresos_updated_at ON public.egresos_camara;
CREATE TRIGGER trg_egresos_updated_at
    BEFORE UPDATE ON public.egresos_camara
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS para egresos_camara
ALTER TABLE public.egresos_camara ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de egresos_camara" ON public.egresos_camara;
CREATE POLICY "Permitir lectura publica de egresos_camara" 
ON public.egresos_camara FOR SELECT 
TO public, anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Permitir insercion de egresos_camara" ON public.egresos_camara;
CREATE POLICY "Permitir insercion de egresos_camara" 
ON public.egresos_camara FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizacion de egresos_camara" ON public.egresos_camara;
CREATE POLICY "Permitir actualizacion de egresos_camara" 
ON public.egresos_camara FOR UPDATE 
TO public, anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Permitir eliminacion de egresos_camara" ON public.egresos_camara;
CREATE POLICY "Permitir eliminacion de egresos_camara" 
ON public.egresos_camara FOR DELETE 
TO public, anon, authenticated 
USING (true);

GRANT ALL ON public.egresos_camara TO anon, authenticated, service_role;


-- 3. DATOS INICIALES SEMILLA DE TESORERÍA (PAGOS HISTÓRICOS & PENDIENTES)
INSERT INTO public.pagos_tesoreria (
    numero_recibo, codigo_afiliado, nombre_establecimiento, representante_legal, 
    rif_cedula, telefono, email, concepto, periodo_mes, metodo_pago, banco_emisor, 
    banco_receptor, referencia, telefono_pagador, monto_bs, tasa_bcv, monto_usd, 
    estado, fecha_pago, fecha_conciliacion, conciliado_por, observaciones
) VALUES
(
    'REC-2026-0001', 'CGM-2026-001', 'Kaffia Caffe', 'Gerencia & Equipo Kaffia',
    'J-50123456-7', '04148817137', 'cafe.kaffia@gmail.com', 'Inscripción + 1er Mes',
    'Enero 2026', 'pago_movil', 'Banco Provincial', 'Banco Provincial (0108)',
    '00492817', '04148817137', 1500.00, 50.00, 30.00,
    'conciliado', '2026-01-05T10:30:00Z', '2026-01-05T11:15:00Z',
    'Edixon Xavier Reyes Dávila (Tesorero)', 'Pago verificado en cuenta oficial Provincial'
),
(
    'REC-2026-0002', 'CGM-2026-001', 'Kaffia Caffe', 'Gerencia & Equipo Kaffia',
    'J-50123456-7', '04148817137', 'cafe.kaffia@gmail.com', 'Cuota Mensual',
    'Septiembre 2026', 'pago_movil', 'Banco Provincial', 'Banco Provincial (0108)',
    '00984729', '04148817137', 520.00, 52.00, 10.00,
    'conciliado', '2026-09-01T14:20:00Z', '2026-09-01T15:00:00Z',
    'Edixon Xavier Reyes Dávila (Tesorero)', 'Cuota ordinaria de Septiembre conciliada'
),
(
    'REC-2026-0003', 'CGM-2026-002', 'La Sevillana Restaurant', 'Carlos Mendoza',
    'J-40987654-3', '04247654321', 'contacto@lasevillanamerida.com', 'Inscripción + 1er Mes',
    'Febrero 2026', 'transferencia_nacional', 'Banesco', 'Banco Provincial (0108)',
    '78921634', '04247654321', 1600.00, 53.33, 30.00,
    'conciliado', '2026-02-10T09:45:00Z', '2026-02-10T10:30:00Z',
    'Edixon Xavier Reyes Dávila (Tesorero)', 'Inscripción aprobada'
),
(
    'REC-2026-0004', 'CGM-2026-003', 'Chocolates La Mucuy', 'Andreina Ramírez',
    'J-31245678-9', '04147000001', 'andreinaramirez@camaragastronomicamerida.org', 'Cuota Mensual',
    'Octubre 2026', 'pago_movil', 'Banco Mercantil', 'Banco Provincial (0108)',
    '83749201', '04147000001', 540.00, 54.00, 10.00,
    'pendiente', NOW(), NULL, NULL,
    'Reporte de pago móvil recibido por la web. Pendiente por conciliación en extracto'
)
ON CONFLICT (numero_recibo) DO NOTHING;


-- 4. DATOS INICIALES SEMILLA DE EGRESOS
INSERT INTO public.egresos_camara (
    concepto, categoria, monto_usd, monto_bs, metodo_pago, referencia_comprobante, 
    beneficiario_proveedor, fecha_gasto, aprobado_por, observaciones
) VALUES
(
    'Diseño y Producción de Pendones Institucionales Sello AAA',
    'Publicidad & Medios', 45.00, 2430.00, 'transferencia', 'REF-EG-001',
    'Impresos Gráficos Los Andes C.A.', '2026-09-15T11:00:00Z',
    'Edixon Xavier Reyes Dávila (Tesorero)', 'Material publicitario para eventos gremiales'
),
(
    'Dominio Web y Servidor Plataforma Mérida Gastronómica',
    'Servicios Web & Plataforma', 35.00, 1890.00, 'zelle', 'ZEL-HOST-2026',
    'Infraestructura Cloud & Vercel Services', '2026-09-20T16:30:00Z',
    'Edixon Xavier Reyes Dávila (Tesorero)', 'Mantenimiento del portal oficial y base de datos'
)
ON CONFLICT DO NOTHING;
