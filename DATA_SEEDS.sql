-- ==================== ROLES ====================
INSERT INTO roles (id_rol, nombre_rol, descripcion) VALUES
(1, 'Paciente', 'Usuario paciente que puede solicitar citas y ver su historial médico'),
(2, 'Medico', 'Médico que puede aceptar/rechazar citas y gestionar antecedentes de pacientes'),
(3, 'Administrador', 'Administrador del sistema con acceso total');

-- ==================== ESTADOS ====================
INSERT INTO estados (id_estado, estado, descripcion) VALUES
(1, 'Activo', 'Usuario o recurso activo en el sistema'),
(2, 'Inactivo', 'Usuario o recurso inactivo en el sistema'),
(3, 'Pendiente', 'Cita pendiente de aprobación'),
(4, 'Aceptada', 'Cita aceptada por el médico'),
(5, 'Rechazada', 'Cita rechazada por el médico'),
(6, 'Cancelada', 'Cita cancelada por paciente o médico');

-- ==================== ESPECIALIDADES ====================
INSERT INTO especialidades (id_especialidad, nombre_especialidad, descripcion) VALUES
(1, 'Cardiología', 'Especialista en enfermedades del corazón'),
(2, 'Pediatría', 'Especialista en medicina infantil'),
(3, 'Neurología', 'Especialista en enfermedades del sistema nervioso'),
(4, 'Dermatología', 'Especialista en enfermedades de la piel'),
(5, 'Traumatología', 'Especialista en lesiones y fracturas'),
(6, 'Oftalmología', 'Especialista en enfermedades oculares'),
(7, 'Otorrinolaringología', 'Especialista en oído, nariz y garganta'),
(8, 'Psicología', 'Especialista en salud mental');

-- ==================== PERMISOS POR ROL Y MODULO ====================
-- PACIENTE (idRol=1) - Puede ver, crear y cancelar citas
DELETE FROM permisos WHERE id_rol = 1;
INSERT INTO permisos (id_rol, modulo, ver, crear, editar, eliminar, descargar) VALUES
(1, 'modulo_dashboard', true, false, false, false, false),
(1, 'modulo_inicio', true, false, false, false, false),
(1, 'modulo_citas', true, true, false, true, false),
(1, 'modulo_configuracion', true, false, true, false, false);

-- MEDICO (idRol=2) - Puede ver, editar citas y gestionar antecedentes
DELETE FROM permisos WHERE id_rol = 2;
INSERT INTO permisos (id_rol, modulo, ver, crear, editar, eliminar, descargar) VALUES
(2, 'modulo_dashboard', true, false, false, false, false),
(2, 'modulo_inicio', true, false, false, false, false),
(2, 'modulo_citas', true, false, true, true, false),
(2, 'modulo_medico', true, true, true, true, true),
(2, 'modulo_configuracion', true, false, true, false, false);

-- ADMINISTRADOR (idRol=3) - Acceso completo para gestionar el sistema
DELETE FROM permisos WHERE id_rol = 3;
INSERT INTO permisos (id_rol, modulo, ver, crear, editar, eliminar, descargar) VALUES
(3, 'modulo_dashboard', true, false, false, false, false),
(3, 'modulo_inicio', true, false, false, false, false),
(3, 'modulo_usuarios', true, true, true, true, true),
(3, 'modulo_citas', true, true, true, true, true),
(3, 'modulo_medico', true, true, true, true, true),
(3, 'modulo_administrativo', true, true, true, true, false),
(3, 'modulo_catalogos', true, true, true, true, false),
(3, 'modulo_configuracion', true, false, true, false, false);

-- ==================== USUARIOS EJEMPLO ====================
-- Paciente: Juan Pérez
INSERT INTO usuarios (nombre_usuario, contrasenia, nombres, apellidos, correo, dui, fecha_nacimiento, id_rol, id_estado) VALUES
('juanperez', 'password123', 'Juan', 'Pérez García', 'juan.perez@email.com', '12345678-9', '1990-05-15', 1, 1);

-- Médico: Carlos Martínez (con especialidades en Cardiología y Traumatología)
INSERT INTO usuarios (nombre_usuario, contrasenia, nombres, apellidos, correo, dui, fecha_nacimiento, id_rol, id_estado) VALUES
('drmartinez', 'password123', 'Carlos', 'Martínez López', 'dr.martinez@email.com', '98765432-1', '1985-03-20', 2, 1);

-- Asignar especialidades al médico Carlos Martínez (id_usuario=2)
INSERT INTO usuario_especialidad (id_usuario, id_especialidad) VALUES
(2, 1),  -- Cardiología
(2, 5);  -- Traumatología

-- Administrador: Admin Sistema
INSERT INTO usuarios (nombre_usuario, contrasenia, nombres, apellidos, correo, dui, fecha_nacimiento, id_rol, id_estado) VALUES
('admin', 'admin123', 'Administrador', 'Sistema', 'admin@medicit.com', '11111111-1', '1980-01-01', 3, 1);

-- ==================== NOTAS ====================
-- 1. La tabla 'permisos' ahora contiene: id_rol, modulo, ver, crear, editar, eliminar, descargar, descripcion
-- 2. El campo 'modulo' es un STRING que contiene nombres como 'modulo_dashboard', 'modulo_citas', etc.
-- 3. No hay una tabla separada de modulos, estos se definen directamente en la tabla permisos
-- 4. Reemplaza los valores de contraseña con hash bcrypt en producción
-- 5. Los IDs deben coincidir con los valores de secuencia de la BD
-- 6. Las fechas deben estar en formato 'YYYY-MM-DD'
-- 7. El campo 'correo' podría ser único, verifica tu esquema
-- 8. Los nombres de roles deben coincidir exactamente: 'Paciente', 'Medico', 'Administrador'
-- 9. Los estados deben coincidir: 'Activo', 'Inactivo', 'Pendiente', 'Aceptada', 'Rechazada', 'Cancelada'
-- 10. Nombres de módulos válidos:
--     - modulo_dashboard
--     - modulo_inicio
--     - modulo_usuarios
--     - modulo_citas
--     - modulo_medico
--     - modulo_administrativo
--     - modulo_catalogos
--     - modulo_configuracion
