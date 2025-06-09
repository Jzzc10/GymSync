-- Crear base de datos y usuario
CREATE DATABASE IF NOT EXISTS backend;
CREATE USER IF NOT EXISTS 'gymsync'@'localhost' IDENTIFIED BY 'gymsync';
GRANT ALL PRIVILEGES ON backend.* TO 'gymsync'@'localhost';
FLUSH PRIVILEGES;
USE backend;

-- ALTER TABLE usuario DROP CHECK usuario_chk_1;
-- Usuarios
-- password: 12345678
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Juan Pérez', 'juan.perez@email.com', '$2a$12$AB9qGFUgcShf6u16K/bUbuiTkEwNxmGw.gP1jVe9wcPF2zF.lIwmi', 'CLIENTE'),
('María García', 'maria.garcia@email.com', '$2a$12$AB9qGFUgcShf6u16K/bUbuiTkEwNxmGw.gP1jVe9wcPF2zF.lIwmi', 'CLIENTE'),
('Carlos López', 'carlos.lopez@email.com', '$2a$12$AB9qGFUgcShf6u16K/bUbuiTkEwNxmGw.gP1jVe9wcPF2zF.lIwmi', 'ENTRENADOR'),
('Ana Martínez', 'ana.martinez@email.com', '$2a$12$AB9qGFUgcShf6u16K/bUbuiTkEwNxmGw.gP1jVe9wcPF2zF.lIwmi', 'ENTRENADOR'),
('Admin Sistema', 'admin@email.com', '$2a$12$AB9qGFUgcShf6u16K/bUbuiTkEwNxmGw.gP1jVe9wcPF2zF.lIwmi', 'ADMIN');
select * from usuarios;
select * from rutinas;
-- Ejercicios
INSERT INTO ejercicios (nombre, tipo, descripcion, url_imagen, url_video) VALUES
('Press de banca', 'PECHO', 'Ejercicio para pectorales con barra', 'https://i.postimg.cc/7JCJ34Sk/pressbanca.png', 'https://www.youtube.com/watch?v=jlFl7WJ1TzI'),
('Sentadillas', 'PIERNAS', 'Ejercicio completo para piernas', 'https://i.postimg.cc/z33hZC6c/sentadillas.png', 'https://www.youtube.com/watch?v=qsAkuNORgmk'),
('Dominadas', 'ESPALDA', 'Ejercicio para espalda usando el peso corporal', 'https://i.postimg.cc/bG8nKKfx/dominadas.png', 'https://www.youtube.com/watch?v=J1r9UtnaY5c'),
('Curl de bíceps', 'BICEPS', 'Ejercicio de aislamiento para bíceps', 'https://i.postimg.cc/dhGdNJpQ/curl-Biceps.png', 'https://www.youtube.com/watch?v=uICWtGLd4-I'),
('Fondos en paralelas', 'TRICEPS', 'Ejercicio para tríceps y pectoral inferior', 'https://i.postimg.cc/4K5cZBXr/fondo-Paralelas.png', 'https://www.youtube.com/watch?v=9ZzikD2iqZc'),
('Plancha abdominal', 'ABDOMINALES', 'Ejercicio isométrico para core', 'https://i.postimg.cc/BbfsG4y9/Captura-de-pantalla-2025-06-09-180558.png', 'https://www.youtube.com/watch?v=7srr1cv7WJ4'),
('Peso muerto', 'ESPALDA', 'Ejercicio compuesto para espalda baja y piernas', 'https://i.postimg.cc/ftq0SytC/peso-Muerto.png', 'https://www.youtube.com/watch?v=0XL4cZR2Ink'),
('Elevaciones laterales', 'HOMBRO', 'Ejercicio para deltoides laterales', 'https://i.postimg.cc/XGYCvdJX/eleveaciones-Laterales.png', 'https://www.youtube.com/watch?v=hgLpdwMtEEs'),
('Hip thrust', 'GLUTEO', 'Ejercicio específico para glúteos', 'https://i.postimg.cc/MvCVYnsr/Captura-de-pantalla-2025-06-09-180250.png', 'https://www.youtube.com/watch?v=pUdIL5x0fWg');
select * from ejercicios;

-- Rutinas
INSERT INTO rutinas (usuario_id, entrenador_id, descripcion) VALUES
(1, 3, 'Rutina inicial para ganar masa muscular'),
(1, 4, 'Rutina de mantenimiento'),
(2, 3, 'Rutina definición'),
(2, 4, 'Rutina fuerza');
select * from rutinas;
-- SET SQL_SAFE_UPDATES = 0;
-- DELETE FROM rutina_ejercicios;
-- ALTER TABLE rutina_ejercicios AUTO_INCREMENT = 1;
-- SET SQL_SAFE_UPDATES = 1;
select * from ejercicios;
-- Rutina-Ejercicios
INSERT INTO rutina_ejercicios (rutina_id, ejercicio_id, series, repeticiones, peso_ejercicio) VALUES
(1, 1, 4, 10, 60),
(1, 2, 4, 12, 40),
(1, 3, 3, 8, NULL),
(1, 7, 3, 6, 70),
(2, 4, 3, 12, 12),
(2, 5, 3, 10, NULL),
(2, 6, 3, 30, NULL),
(3, 2, 4, 15, 30),
(3, 8, 3, 12, 8),
(3, 9, 4, 12, 40),
(4, 1, 5, 5, 80),
(4, 7, 5, 5, 90),
(4, 3, 4, 6, NULL);

-- Progresos
INSERT INTO progresos (usuario_id, rutina_id, ejercicio_id, series, repeticiones, peso_utilizado, fecha_registro, observaciones) VALUES 
(1, 1, 1, 4, 10, 60.0, '2023-01-10', 'Buen desempeño, técnica mejorando'),
(1, 1, 1, 4, 12, 62.5, '2023-01-17', 'Incrementó repeticiones y peso ligeramente'),
(1, 1, 2, 3, 12, 40.0, '2023-01-10', 'Primera vez con este ejercicio'),
(1, 1, 2, 4, 12, 42.5, '2023-01-17', 'Añadió una serie y aumentó peso'),
(2, 3, 2, 3, 15, 30.0, '2023-01-11', 'Enfocada en técnica'),
(2, 3, 2, 4, 15, 32.5, '2023-01-18', 'Añadió una serie con buen control'),
(2, 3, 9, 3, 12, 40.0, '2023-01-11', 'Ejercicio desafiante'),
(2, 3, 9, 3, 15, 40.0, '2023-01-18', 'Más repeticiones con mismo peso'),
(1, 2, 4, 3, 12, 12.0, '2023-01-12', 'Trabajando en rango completo'),
(1, 2, 4, 3, 12, 14.0, '2023-01-19', 'Aumentó peso manteniendo repeticiones'),
(2, 4, 1, 4, 5, 80.0, '2023-01-13', 'Enfoque en fuerza máxima'),
(2, 4, 1, 4, 5, 82.5, '2023-01-20', 'Pequeño incremento de peso');

