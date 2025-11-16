-- PROGRAMA DE FORMACIÓN DIGITAL PARA 150 JÓVENES

-- Tabla principal del programa
CREATE TABLE programas_formacion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  cupos_totales INTEGER DEFAULT 150,
  cupos_ocupados INTEGER DEFAULT 0,
  estado VARCHAR(50) DEFAULT 'activo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de inscripciones de jóvenes
CREATE TABLE inscripciones_jovenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  programa_id UUID REFERENCES programas_formacion(id),
  user_id UUID REFERENCES auth.users(id),
  fecha_inscripcion DATE DEFAULT NOW(),
  estado_inscripcion VARCHAR(50) DEFAULT 'activo',
  datos_contacto JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de talleres presenciales
CREATE TABLE talleres_presenciales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  programa_id UUID REFERENCES programas_formacion(id),
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_taller TIMESTAMP WITH TIME ZONE NOT NULL,
  duracion_horas INTEGER,
  ubicacion VARCHAR(500),
  capacidad_maxima INTEGER,
  instructor_id UUID REFERENCES instructors(id),
  qr_code VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de asistencia a talleres
CREATE TABLE asistencia_talleres (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  taller_id UUID REFERENCES talleres_presenciales(id),
  joven_id UUID REFERENCES inscripciones_jovenes(id),
  asistio BOOLEAN DEFAULT FALSE,
  hora_registro TIMESTAMP WITH TIME ZONE,
  metodo_registro VARCHAR(50), -- 'qr', 'manual'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de módulos pedagógicos
CREATE TABLE modulos_pedagogicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  programa_id UUID REFERENCES programas_formacion(id),
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  orden INTEGER,
  duracion_estimada INTEGER, -- en horas
  objetivos_aprendizaje JSONB,
  recursos JSONB,
  estado VARCHAR(50) DEFAULT 'activo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de progreso en módulos
CREATE TABLE progreso_modulos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  joven_id UUID REFERENCES inscripciones_jovenes(id),
  modulo_id UUID REFERENCES modulos_pedagogicos(id),
  progreso_percent INTEGER DEFAULT 0,
  completado BOOLEAN DEFAULT FALSE,
  fecha_completado TIMESTAMP WITH TIME ZONE,
  evaluacion_final JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de certificaciones
CREATE TABLE certificaciones_jovenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  joven_id UUID REFERENCES inscripciones_jovenes(id),
  programa_id UUID REFERENCES programas_formacion(id),
  codigo_certificado VARCHAR(100) UNIQUE,
  fecha_emision DATE DEFAULT NOW(),
  fecha_vencimiento DATE,
  habilidades_adquiridas JSONB,
  proyecto_final JSONB,
  estado VARCHAR(50) DEFAULT 'activo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de seguimiento post-formación
CREATE TABLE seguimiento_post_formacion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  joven_id UUID REFERENCES inscripciones_jovenes(id),
  programa_id UUID REFERENCES programas_formacion(id),
  fecha_seguimiento DATE,
  empleabilidad_actual VARCHAR(255),
  proyectos_emprendimiento JSONB,
  satisfaccion_general INTEGER, -- 1-5
  necesidades_seguimiento JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de exposición híbrida
CREATE TABLE exposiciones_hibridas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  programa_id UUID REFERENCES programas_formacion(id),
  titulo_evento VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_evento TIMESTAMP WITH TIME ZONE,
  tipo_evento VARCHAR(100), -- 'virtual', 'presencial', 'hibrido'
  ubicacion VARCHAR(500),
  enlace_virtual VARCHAR(500),
  proyectos_destacados JSONB,
  estado VARCHAR(50) DEFAULT 'activo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_inscripciones_programa ON inscripciones_jovenes(programa_id);
CREATE INDEX idx_inscripciones_user ON inscripciones_jovenes(user_id);
CREATE INDEX idx_talleres_programa ON talleres_presenciales(programa_id);
CREATE INDEX idx_asistencia_taller ON asistencia_talleres(taller_id);
CREATE INDEX idx_progreso_joven ON progreso_modulos(joven_id);
CREATE INDEX idx_certificaciones_joven ON certificaciones_jovenes(joven_id);
