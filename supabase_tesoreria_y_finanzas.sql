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
    concepto TEXT NOT NULL, -- 'Inscripción + 1er Mes de Membresía', 'Cuota Mensual', etc.
    periodo_mes TEXT DEFAULT 'Octubre 2026',
    metodo_pago TEXT NOT NULL DEFAULT 'pago_movil', -- 'pago_movil', 'transferencia_nacional', 'zelle', 'efectivo_usd', 'efectivo_bs'
    banco_emisor TEXT,
    banco_receptor TEXT DEFAULT 'Banco Provincial (0108)',
    referencia TEXT NOT NULL,
    telefono_pagador TEXT,
    monto_inscripcion_usd NUMERIC(10,2) DEFAULT 20.00,
    monto_cuota_mes_usd NUMERIC(10,2) DEFAULT 10.00,
    monto_usd NUMERIC(10,2) NOT NULL DEFAULT 30.00,
    monto_bs NUMERIC(12,2) DEFAULT 0.00,
    tasa_bcv NUMERIC(10,2) DEFAULT 0.00,
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


-- =========================================================================
-- 3. CARGA ESTRICTA DE LOS 12 PAGOS REALES DE AGREMIADOS (0 DUMMY / 0 MOCK)
-- =========================================================================

-- Limpiar tablas si contenían datos de prueba antiguos
-- TRUNCATE TABLE public.pagos_tesoreria;
-- TRUNCATE TABLE public.egresos_camara;

INSERT INTO public.pagos_tesoreria (
    numero_recibo, codigo_afiliado, nombre_establecimiento, representante_legal, 
    rif_cedula, telefono, email, concepto, periodo_mes, metodo_pago, banco_emisor, 
    banco_receptor, referencia, telefono_pagador, monto_inscripcion_usd, monto_cuota_mes_usd,
    monto_usd, monto_bs, tasa_bcv, estado, fecha_pago, fecha_conciliacion, conciliado_por, observaciones
) VALUES
(
    'REC-2026-0001', 'CGM-2026-001', 'Kaffia Caffe', 'Gerencia & Equipo Kaffia',
    'J-50123849-2', '+58 414-8817137', 'cafe.kaffia@gmail.com', 'Inscripción + 1er Mes de Membresía',
    'Octubre 2026', 'pago_movil', 'Banco Provincial', 'Banco Provincial (0108)',
    '16653', '04148817137', 20.00, 10.00, 30.00, 26141.07, 871.37,
    'conciliado', '2026-09-30T05:39:01Z', '2026-10-08T02:44:28Z',
    'Edixon Xavier Reyes Dávila (Tesorero)', 'Miembro Fundador Oficial. Barismo de Especialidad, Alta Cocina y Café de Altura.'
),
(
    'REC-2026-0002', 'CGM-2026-176', 'COMERCIALIZADORA OC DE MARYURI CARMONA ', 'Maryuri Carolina Carmona Campos',
    'V-12055310', '04147187233', 'comercializadoraocmerida@gmail.com', 'Inscripción + 1er Mes de Membresía',
    'Octubre 2026', 'pago_movil', 'Banco Provincial', 'Banco Provincial (0108)',
    '16653', '04147187233', 20.00, 10.00, 30.00, 26141.07, 871.37,
    'conciliado', '2026-10-05T12:57:01Z', '2026-10-06T03:38:28Z',
    'Edixon Xavier Reyes Dávila (Tesorero)', 'Empresa procesadora de alimentos, fabricante de Vinagre de Manzana orgánico'
),
(
    'REC-2026-0003', 'CGM-2026-920', 'Margiovi_Cakes', 'Margiovi González',
    'V-13233306', '0424-7744312', 'margiovicakes@gmail.com', 'Inscripción + 1er Mes de Membresía',
    'Octubre 2026', 'pago_movil', 'Banco Provincial', 'Banco Provincial (0108)',
    '00923363', '0424-7744312', 10.00, 10.00, 20.00, 17447.85, 872.39,
    'conciliado', '2026-10-05T13:46:17Z', '2026-10-06T03:38:35Z',
    'Edixon Xavier Reyes Dávila (Tesorero)', 'Pastelería artística de diseño'
),
(
    'REC-2026-0004', 'CGM-2026-983', 'Serrania Grill', 'Alexander Rangel',
    'J-41258884-2', '04265756718', 'alexanderrangelmendoza@gmail.com', 'Inscripción + 1er Mes de Membresía',
    'Octubre 2026', 'transferencia_nacional', 'Banco Mercantil', 'Banco Provincial (0108)',
    '37112371', '04247798610', 20.00, 10.00, 30.00, 26241.96, 874.73,
    'pendiente', '2026-10-08T18:02:41Z', NULL, NULL,
    'Restaurante Carnes comida LLanera'
),
(
    'REC-2026-0005', 'CGM-2026-383', 'Lenardo Maldonado', 'Leonardo Maldonado',
    'V-1280379855', 'o4247793363', 'leonardo.andres.maldonado@gmail.com', 'Inscripción + 1er Mes de Membresía',
    'Octubre 2026', 'pago_movil', 'Banco Provincial', 'Banco Provincial (0108)',
    '000003363', '04247793363', 10.00, 10.00, 20.00, 17494.64, 874.73,
    'pendiente', '2026-10-08T19:20:28Z', NULL, NULL,
    'comida de autor y pizzas'
),
(
    'REC-2026-0006', 'CGM-2026-818', 'Leonardo Maldonado', 'leonardo Maldonado Pizzeria',
    'V-1280379855', '04247793363', 'leonardo.andre.maldonado@gmail.com', 'Inscripción + 1er Mes de Membresía',
    'Octubre 2026', 'transferencia_nacional', 'BOD / 100% Banco / Otro', 'Banco Provincial (0108)',
    '000000580971', '04247602051', 20.00, 10.00, 30.00, 26241.96, 874.73,
    'pendiente', '2026-10-08T19:07:20Z', NULL, NULL,
    'La Casa Del Valle'
),
(
    'REC-2026-0007', 'CGM-2026-833', 'la casa del valle c.a,', 'la casa del valle c.a.',
    'J-50478148-5', '04247602051', 'lacasadelvallemerida@gmail.com', 'Inscripción + 1er Mes de Membresía',
    'Octubre 2026', 'transferencia_nacional', 'BOD / 100% Banco / Otro', 'Banco Provincial (0108)',
    '000000580971', '04247602051', 20.00, 10.00, 30.00, 26241.96, 874.73,
    'pendiente', '2026-10-08T19:05:40Z', NULL, NULL,
    'Restaurante campestre'
),
(
    'REC-2026-0008', 'CGM-2026-553', 'Rivaiz Gastronomia', 'Nairo Aizpurua',
    'V-16933465', '04147271717', 'nairoaizpurua@gmail.com', 'Inscripción + 1er Mes de Membresía',
    'Octubre 2026', 'transferencia_nacional', 'BOD / 100% Banco / Otro', 'Banco Provincial (0108)',
    '716431', '04147271717', 10.00, 10.00, 20.00, 17494.64, 874.73,
    'pendiente', '2026-10-08T19:29:28Z', NULL, NULL,
    'Gestor de Eventos'
),
(
    'REC-2026-0009', 'CGM-2026-360', 'Merengue y bocados', 'Yumerling Sánchez Sanchez',
    'V-15756942', '0424-7723380', 'yumerlingsanchez@gmail.com', 'Inscripción + 1er Mes de Membresía',
    'Octubre 2026', 'pago_movil', 'Banco de Venezuela', 'Banco Provincial (0108)',
    '007603108742', '0424-7723380', 10.00, 10.00, 20.00, 17494.64, 874.73,
    'pendiente', '2026-10-08T18:21:57Z', NULL, NULL,
    'Postres, pasabocas dulces y salados, Catering'
),
(
    'REC-2026-0010', 'CGM-2026-248', 'Kansas Group C.A', 'Alejandro Ramos',
    'J-50073539-5', '04140810793', 'kansasgroup2021@gmail.com', 'Inscripción + 1er Mes de Membresía',
    'Octubre 2026', 'transferencia_nacional', 'Banesco', 'Banco Provincial (0108)',
    '0021677353', '04140810793', 20.00, 10.00, 30.00, 26241.96, 874.73,
    'pendiente', '2026-10-08T18:49:15Z', NULL, NULL,
    'Comercio al mayor y detal de víveres en general'
),
(
    'REC-2026-0011', 'CGM-2026-277', 'Ufo Candy Store', 'Alejandro Ramos',
    'J-50608620-2', '04140810793', 'ufocandystore@gmail.com', 'Inscripción + 1er Mes de Membresía',
    'Octubre 2026', 'transferencia_nacional', 'Banesco', 'Banco Provincial (0108)',
    '0021677353', '04140810793', 10.00, 10.00, 20.00, 17494.64, 874.73,
    'pendiente', '2026-10-08T18:47:04Z', NULL, NULL,
    'Dulcería y golosinas'
),
(
    'REC-2026-0012', 'CGM-2026-324', 'Tintos y Café M&M', 'Mariana Peña',
    'V-17849187', '04147444390', 'cafetintosym@gmail.com', 'Inscripción + 1er Mes de Membresía',
    'Octubre 2026', 'pago_movil', 'Banco Provincial', 'Banco Provincial (0108)',
    '00000000', '04147444390', 20.00, 10.00, 30.00, 26241.96, 874.73,
    'pendiente', '2026-10-08T19:42:37Z', NULL, NULL,
    'Cafetería y bebidas'
)
ON CONFLICT (numero_recibo) DO UPDATE SET
    monto_inscripcion_usd = EXCLUDED.monto_inscripcion_usd,
    monto_cuota_mes_usd = EXCLUDED.monto_cuota_mes_usd,
    monto_usd = EXCLUDED.monto_usd,
    monto_bs = EXCLUDED.monto_bs,
    tasa_bcv = EXCLUDED.tasa_bcv,
    estado = EXCLUDED.estado,
    observaciones = EXCLUDED.observaciones;
