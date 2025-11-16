-- =============================================
-- ESQUEMA PROGRAMA FORMACIÓN DIGITAL - 150 JÓVENES
-- ODAM-App - Instituto de Patrimonio y Cultura de Cartagena
-- =============================================

-- PROGRAMA DE FORMACIÓN DIGITAL PARA 150 JÓVENES

-- Tabla principal del programa
CREATE TABLE IF NOT EXISTS programas_formacion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  objetivo_general TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  cupos_totales INTEGER DEFAULT 150,
  cupos_ocupados INTEGER DEFAULT 0,
  estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'completado', 'cancelado')),
  modalidad VARCHAR(100) DEFAULT 'hibrida',
  duracion_semanas INTEGER DEFAULT 12,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de inscripciones de jóvenes
CREATE TABLE IF NOT EXISTS inscripciones_jovenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  programa_id UUID REFERENCES programas_formacion(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fecha_inscripcion DATE DEFAULT NOW(),
  estado_inscripcion VARCHAR(50) DEFAULT 'activo' CHECK (estado_inscripcion IN ('activo', 'completado', 'retirado', 'suspendido')),
  datos_contacto JSONB DEFAULT '{
    "telefono": "",
    "direccion": "",
    "barrio": "",
    "edad": null,
    "genero": "",
    "nivel_educativo": ""
  }',
  emergencia_contacto JSONB DEFAULT '{
    "nombre": "",
    "telefono": "",
    "parentesco": ""
  }',
  necesidades_especiales TEXT,
  aceptado_terminos BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(programa_id, user_id)
);

-- Tabla de talleres presenciales
CREATE TABLE IF NOT EXISTS talleres_presenciales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  programa_id UUID REFERENCES programas_formacion(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_taller TIMESTAMP WITH TIME ZONE NOT NULL,
  duracion_horas INTEGER DEFAULT 3,
  ubicacion VARCHAR(500),
  capacidad_maxima INTEGER DEFAULT 30,
  instructor_id UUID REFERENCES instructors(id),
  qr_code VARCHAR(255),
  materiales_necesarios TEXT[],
  estado VARCHAR(50) DEFAULT 'programado' CHECK (estado IN ('programado', 'en_curso', 'completado', 'cancelado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de asistencia a talleres
CREATE TABLE IF NOT EXISTS asistencia_talleres (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  taller_id UUID REFERENCES talleres_presenciales(id) ON DELETE CASCADE,
  joven_id UUID REFERENCES inscripciones_jovenes(id) ON DELETE CASCADE,
  asistio BOOLEAN DEFAULT FALSE,
  hora_registro TIMESTAMP WITH TIME ZONE,
  metodo_registro VARCHAR(50) DEFAULT 'manual' CHECK (metodo_registro IN ('qr', 'manual', 'admin')),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(taller_id, joven_id)
);

-- Tabla de módulos pedagógicos
CREATE TABLE IF NOT EXISTS modulos_pedagogicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  programa_id UUID REFERENCES programas_formacion(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  orden INTEGER NOT NULL,
  duracion_estimada INTEGER, -- en horas
  objetivos_aprendizaje JSONB DEFAULT '[]',
  recursos JSONB DEFAULT '{
    "videos": [],
    "documentos": [],
    "enlaces": [],
    "actividades": []
  }',
  criterios_evaluacion JSONB DEFAULT '[]',
  estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'en_desarrollo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de progreso en módulos
CREATE TABLE IF NOT EXISTS progreso_modulos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  joven_id UUID REFERENCES inscripciones_jovenes(id) ON DELETE CASCADE,
  modulo_id UUID REFERENCES modulos_pedagogicos(id) ON DELETE CASCADE,
  progreso_percent INTEGER DEFAULT 0 CHECK (progreso_percent >= 0 AND progreso_percent <= 100),
  completado BOOLEAN DEFAULT FALSE,
  fecha_completado TIMESTAMP WITH TIME ZONE,
  actividades_completadas JSONB DEFAULT '[]',
  evaluacion_final JSONB DEFAULT '{
    "puntuacion": null,
    "comentarios": "",
    "fecha_evaluacion": null
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(joven_id, modulo_id)
);

-- Tabla de proyectos finales
CREATE TABLE IF NOT EXISTS proyectos_finales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  joven_id UUID REFERENCES inscripciones_jovenes(id) ON DELETE CASCADE,
  programa_id UUID REFERENCES programas_formacion(id) ON DELETE CASCADE,
  titulo VARCHAR(500) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(255),
  herramientas_utilizadas TEXT[],
  archivos_adjuntos JSONB DEFAULT '[]',
  estado VARCHAR(50) DEFAULT 'en_desarrollo' CHECK (estado IN ('en_desarrollo', 'entregado', 'evaluado', 'aprobado')),
  fecha_entrega TIMESTAMP WITH TIME ZONE,
  evaluacion JSONB DEFAULT '{
    "puntuacion": null,
    "comentarios": "",
    "evaluador_id": null,
    "fecha_evaluacion": null
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de certificaciones
CREATE TABLE IF NOT EXISTS certificaciones_jovenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  joven_id UUID REFERENCES inscripciones_jovenes(id) ON DELETE CASCADE,
  programa_id UUID REFERENCES programas_formacion(id) ON DELETE CASCADE,
  codigo_certificado VARCHAR(100) UNIQUE,
  fecha_emision DATE DEFAULT NOW(),
  fecha_vencimiento DATE,
  habilidades_adquiridas JSONB DEFAULT '[]',
  proyecto_final_id UUID REFERENCES proyectos_finales(id),
  estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'expirado', 'revocado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(joven_id, programa_id)
);

-- Tabla de seguimiento post-formación
CREATE TABLE IF NOT EXISTS seguimiento_post_formacion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  joven_id UUID REFERENCES inscripciones_jovenes(id) ON DELETE CASCADE,
  programa_id UUID REFERENCES programas_formacion(id) ON DELETE CASCADE,
  fecha_seguimiento DATE NOT NULL,
  empleabilidad_actual VARCHAR(255),
  proyectos_emprendimiento JSONB DEFAULT '[]',
  satisfaccion_general INTEGER CHECK (satisfaccion_general >= 1 AND satisfaccion_general <= 5),
  necesidades_seguimiento JSONB DEFAULT '[]',
  logros_destacados TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de exposición híbrida
CREATE TABLE IF NOT EXISTS exposiciones_hibridas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  programa_id UUID REFERENCES programas_formacion(id) ON DELETE CASCADE,
  titulo_evento VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_evento TIMESTAMP WITH TIME ZONE,
  tipo_evento VARCHAR(100) DEFAULT 'hibrido' CHECK (tipo_evento IN ('virtual', 'presencial', 'hibrido')),
  ubicacion VARCHAR(500),
  enlace_virtual VARCHAR(500),
  proyectos_destacados JSONB DEFAULT '[]',
  asistentes_registrados INTEGER DEFAULT 0,
  estado VARCHAR(50) DEFAULT 'programado' CHECK (estado IN ('programado', 'en_curso', 'completado', 'cancelado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de participación en exposiciones
CREATE TABLE IF NOT EXISTS participacion_exposiciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exposicion_id UUID REFERENCES exposiciones_hibridas(id) ON DELETE CASCADE,
  joven_id UUID REFERENCES inscripciones_jovenes(id) ON DELETE CASCADE,
  proyecto_id UUID REFERENCES proyectos_finales(id) ON DELETE CASCADE,
  tipo_participacion VARCHAR(100) CHECK (tipo_participacion IN ('expositor', 'asistente', 'colaborador')),
  feedback JSONB DEFAULT '{
    "asistentes": 0,
    "comentarios": [],
    "puntuacion": null
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exposicion_id, joven_id, proyecto_id)
);

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

-- Índices para programas_formacion
CREATE INDEX IF NOT EXISTS idx_programas_estado ON programas_formacion(estado);
CREATE INDEX IF NOT EXISTS idx_programas_fechas ON programas_formacion(fecha_inicio, fecha_fin);

-- Índices para inscripciones_jovenes
CREATE INDEX IF NOT EXISTS idx_inscripciones_programa ON inscripciones_jovenes(programa_id);
CREATE INDEX IF NOT EXISTS idx_inscripciones_user ON inscripciones_jovenes(user_id);
CREATE INDEX IF NOT EXISTS idx_inscripciones_estado ON inscripciones_jovenes(estado_inscripcion);

-- Índices para talleres_presenciales
CREATE INDEX IF NOT EXISTS idx_talleres_programa ON talleres_presenciales(programa_id);
CREATE INDEX IF NOT EXISTS idx_talleres_fecha ON talleres_presenciales(fecha_taller);
CREATE INDEX IF NOT EXISTS idx_talleres_estado ON talleres_presenciales(estado);

-- Índices para asistencia_talleres
CREATE INDEX IF NOT EXISTS idx_asistencia_taller ON asistencia_talleres(taller_id);
CREATE INDEX IF NOT EXISTS idx_asistencia_joven ON asistencia_talleres(joven_id);
CREATE INDEX IF NOT EXISTS idx_asistencia_fecha ON asistencia_talleres(created_at);

-- Índices para modulos_pedagogicos
CREATE INDEX IF NOT EXISTS idx_modulos_programa ON modulos_pedagogicos(programa_id);
CREATE INDEX IF NOT EXISTS idx_modulos_orden ON modulos_pedagogicos(orden);

-- Índices para progreso_modulos
CREATE INDEX IF NOT EXISTS idx_progreso_joven ON progreso_modulos(joven_id);
CREATE INDEX IF NOT EXISTS idx_progreso_modulo ON progreso_modulos(modulo_id);
CREATE INDEX IF NOT EXISTS idx_progreso_completado ON progreso_modulos(completado);

-- Índices para certificaciones_jovenes
CREATE INDEX IF NOT EXISTS idx_certificaciones_joven ON certificaciones_jovenes(joven_id);
CREATE INDEX IF NOT EXISTS idx_certificaciones_programa ON certificaciones_jovenes(programa_id);
CREATE INDEX IF NOT EXISTS idx_certificaciones_codigo ON certificaciones_jovenes(codigo_certificado);

-- =============================================
-- DATOS INICIALES DE EJEMPLO
-- =============================================

-- Insertar programa de formación principal
INSERT INTO programas_formacion (
  nombre, 
  descripcion, 
  objetivo_general,
  fecha_inicio, 
  fecha_fin, 
  cupos_totales,
  modalidad,
  duracion_semanas
) VALUES (
  'Formación Digital para Jóvenes Creativos de Cartagena',
  'Programa integral de formación en habilidades digitales y patrimoniales para 150 jóvenes del Distrito de Cartagena',
  'Capacitar a 150 jóvenes en herramientas digitales aplicadas al patrimonio cultural, fomentando el emprendimiento y la empleabilidad en la economía creativa',
  '2024-03-01',
  '2024-06-15',
  150,
  'hibrida',
  16
) ON CONFLICT DO NOTHING;

-- Insertar módulos pedagógicos de ejemplo
INSERT INTO modulos_pedagogicos (
  programa_id,
  titulo,
  descripcion,
  orden,
  duracion_estimada,
  objetivos_aprendizaje
) VALUES 
(
  (SELECT id FROM programas_formacion LIMIT 1),
  'Introducción al Patrimonio Cultural de Cartagena',
  'Módulo introductorio sobre el patrimonio vivo y la identidad cultural cartagenera',
  1,
  8,
  '["Identificar los elementos principales del patrimonio cultural", "Reconocer la importancia de la preservación digital", "Valorar las tradiciones musicales y artísticas locales"]'
),
(
  (SELECT id FROM programas_formacion LIMIT 1),
  'Herramientas Digitales para la Creación de Contenidos',
  'Módulo práctico sobre producción audiovisual, fotografía y edición digital',
  2,
  12,
  '["Manejar equipos básicos de grabación y fotografía", "Editar contenido multimedia con software libre", "Producir materiales audiovisuales de calidad"]'
),
(
  (SELECT id FROM programas_formacion LIMIT 1),
  'Gestión de Proyectos Culturales y Emprendimiento',
  'Módulo de formación en gestión cultural y modelos de negocio creativos',
  3,
  10,
  '["Elaborar proyectos culturales viables", "Identificar fuentes de financiación", "Desarrollar modelos de negocio sostenibles"]'
) ON CONFLICT DO NOTHING;

-- =============================================
-- FUNCIONES Y TRIGGERS
-- =============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers a todas las tablas que tienen updated_at
CREATE TRIGGER update_programas_updated_at BEFORE UPDATE ON programas_formacion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inscripciones_updated_at BEFORE UPDATE ON inscripciones_jovenes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_talleres_updated_at BEFORE UPDATE ON talleres_presenciales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_modulos_updated_at BEFORE UPDATE ON modulos_pedagogicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_progreso_updated_at BEFORE UPDATE ON progreso_modulos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proyectos_updated_at BEFORE UPDATE ON proyectos_finales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seguimiento_updated_at BEFORE UPDATE ON seguimiento_post_formacion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exposiciones_updated_at BEFORE UPDATE ON exposiciones_hibridas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar cupos ocupados automáticamente
CREATE OR REPLACE FUNCTION update_cupos_ocupados()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE programas_formacion 
        SET cupos_ocupados = cupos_ocupados + 1
        WHERE id = NEW.programa_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE programas_formacion 
        SET cupos_ocupados = cupos_ocupados - 1
        WHERE id = OLD.programa_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cupos_on_inscripcion 
    AFTER INSERT OR DELETE ON inscripciones_jovenes 
    FOR EACH ROW EXECUTE FUNCTION update_cupos_ocupados();

-- =============================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =============================================

COMMENT ON TABLE programas_formacion IS 'Programas de formación digital para jóvenes del IPCC Cartagena';
COMMENT ON TABLE inscripciones_jovenes IS 'Inscripciones de los 150 jóvenes a los programas de formación';
COMMENT ON TABLE talleres_presenciales IS 'Talleres presenciales del programa con control de asistencia QR';
COMMENT ON TABLE modulos_pedagogicos IS 'Módulos de aprendizaje del programa formativo';
COMMENT ON TABLE certificaciones_jovenes IS 'Certificaciones emitidas a jóvenes que completan el programa';

COMMENT ON COLUMN programas_formacion.cupos_ocupados IS 'Número actual de jóvenes inscritos en el programa';
COMMENT ON COLUMN inscripciones_jovenes.datos_contacto IS 'Información de contacto y demográfica del joven';
COMMENT ON COLUMN talleres_presenciales.qr_code IS 'Código QR único para registro de asistencia';
COMMENT ON COLUMN certificaciones_jovenes.codigo_certificado IS 'Código único de verificación del certificado';
