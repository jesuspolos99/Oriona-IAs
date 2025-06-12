-- Sistema de aprendizaje y memoria para la IA

-- Tabla para almacenar patrones de lenguaje aprendidos
CREATE TABLE IF NOT EXISTS patrones_lenguaje (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patron VARCHAR(500) NOT NULL,
  respuesta_tipo VARCHAR(100) NOT NULL,
  frecuencia INTEGER DEFAULT 1,
  contexto JSONB,
  usuario_origen UUID REFERENCES usuarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para el vocabulario personalizado por usuario
CREATE TABLE IF NOT EXISTS vocabulario_usuario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  palabra VARCHAR(200) NOT NULL,
  significado TEXT,
  contexto TEXT,
  frecuencia_uso INTEGER DEFAULT 1,
  categoria VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, palabra)
);

-- Tabla para memoria a largo plazo de conversaciones
CREATE TABLE IF NOT EXISTS memoria_conversaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tema VARCHAR(200) NOT NULL,
  resumen TEXT NOT NULL,
  palabras_clave JSONB,
  sentimiento VARCHAR(50),
  importancia INTEGER DEFAULT 1,
  ultima_mencion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  frecuencia_mencion INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para preferencias y personalidad del usuario
CREATE TABLE IF NOT EXISTS perfil_usuario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE UNIQUE,
  estilo_comunicacion VARCHAR(100) DEFAULT 'neutral',
  temas_interes JSONB DEFAULT '[]',
  nivel_formalidad VARCHAR(50) DEFAULT 'medio',
  preferencias_respuesta JSONB DEFAULT '{}',
  personalidad_detectada JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para conocimiento adquirido de fuentes externas
CREATE TABLE IF NOT EXISTS conocimiento_adquirido (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tema VARCHAR(200) NOT NULL,
  contenido TEXT NOT NULL,
  fuente VARCHAR(500),
  confiabilidad INTEGER DEFAULT 5,
  fecha_adquisicion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  veces_utilizado INTEGER DEFAULT 0,
  ultima_utilizacion TIMESTAMP WITH TIME ZONE,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para análisis de sentimientos y emociones
CREATE TABLE IF NOT EXISTS analisis_emocional (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  mensaje_id UUID REFERENCES mensajes(id) ON DELETE CASCADE,
  sentimiento VARCHAR(50) NOT NULL,
  intensidad DECIMAL(3,2) DEFAULT 0.5,
  emociones_detectadas JSONB DEFAULT '[]',
  contexto_emocional TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_patrones_lenguaje_patron ON patrones_lenguaje(patron);
CREATE INDEX IF NOT EXISTS idx_patrones_lenguaje_frecuencia ON patrones_lenguaje(frecuencia DESC);
CREATE INDEX IF NOT EXISTS idx_vocabulario_usuario_id ON vocabulario_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_vocabulario_palabra ON vocabulario_usuario(palabra);
CREATE INDEX IF NOT EXISTS idx_memoria_conversaciones_usuario ON memoria_conversaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_memoria_conversaciones_tema ON memoria_conversaciones(tema);
CREATE INDEX IF NOT EXISTS idx_memoria_ultima_mencion ON memoria_conversaciones(ultima_mencion DESC);
CREATE INDEX IF NOT EXISTS idx_conocimiento_tema ON conocimiento_adquirido(tema);
CREATE INDEX IF NOT EXISTS idx_conocimiento_utilizacion ON conocimiento_adquirido(veces_utilizado DESC);
CREATE INDEX IF NOT EXISTS idx_analisis_emocional_usuario ON analisis_emocional(usuario_id);
CREATE INDEX IF NOT EXISTS idx_analisis_emocional_sentimiento ON analisis_emocional(sentimiento);
