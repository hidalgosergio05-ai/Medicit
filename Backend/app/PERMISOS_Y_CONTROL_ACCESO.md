# 🔐 Sistema de Permisos y Control de Acceso - MediCit

## 📊 Arquitectura del Sistema de Permisos

```
┌─────────────────────────────────────────────────────────────────┐
│                          USUARIO                                 │
│  (nombreUsuario, nombres, apellidos, rol, estado)               │
└──────────────────────────────┬──────────────────────────────────┘
                                │
                        ┌───────▼────────┐
                        │      ROL       │
                        │ (Médico, etc)  │
                        └────────┬────────┘
                                │
                    ┌───────────┼───────────┐
                    │                       │
        ┌───────────▼─────────────┐   ┌────▼──────────────────┐
        │  ROL-PERMISO-MODULO     │   │   ROL-PERMISO-MODULO  │
        │  (Relación intermedia)  │   │  (Relación intermedia)│
        └────┬────────────────┬───┘   └────┬──────────────┬───┘
             │                │            │              │
       ┌─────▼──────┐   ┌─────▼────┐ ┌─────▼──────┐ ┌────▼─────┐
       │ PERMISO 1  │   │ MODULO 1  │ │ PERMISO 2  │ │ MODULO 2 │
       │ (Ver)      │   │ (Citas)   │ │ (Crear)    │ │(Usuarios)│
       └────────────┘   └───────────┘ └────────────┘ └──────────┘
```

## 🔄 Flujo de Verificación de Acceso

```
1. Usuario realiza petición → /api/citas (GET)
                                   │
                                   ▼
2. ControlAccesoInterceptor extrae módulo: "citas"
                                   │
                                   ▼
3. PermisosService verifica:
   - ¿El usuario tiene rol? ✓
   - ¿El rol tiene acceso al módulo "citas"? ✓
   - ¿El rol tiene permiso "Ver"? ✓
                                   │
                       ┌───────────┴───────────┐
                       │                       │
                    SI │                       │ NO
                       ▼                       ▼
              Ejecutar petición     Responder 403 Forbidden
```

## 📋 Entidades Principales

### 1. **Usuarios**
```sql
CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(15) UNIQUE NOT NULL,
    nombres VARCHAR(35) NOT NULL,
    apellidos VARCHAR(35) NOT NULL,
    id_rol INT NOT NULL,
    id_estado INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol),
    FOREIGN KEY (id_estado) REFERENCES Estados(id_estado)
);
```

### 2. **Roles**
```sql
CREATE TABLE Roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(15) NOT NULL,
    descripcion VARCHAR(200) NOT NULL
);
```

**Ejemplos:**
- Administrador (Control total)
- Médico (Acceso a citas y pacientes)
- Recepcionista (Acceso a citas)
- Paciente (Solo ver sus datos)

### 3. **Modulos**
```sql
CREATE TABLE Modulos (
    id_modulo INT PRIMARY KEY AUTO_INCREMENT,
    nombre_modulo VARCHAR(30) NOT NULL,
    descripcion VARCHAR(200) NOT NULL
);
```

**Ejemplos:**
- Usuarios
- Citas
- Especialidades
- Antecedentes
- Reportes

### 4. **Permisos**
```sql
CREATE TABLE Permisos (
    id_permiso INT PRIMARY KEY AUTO_INCREMENT,
    nombre_permiso VARCHAR(30) NOT NULL,
    descripcion VARCHAR(200) NOT NULL
);
```

**Permisos Estándar:**
- VER: Leer información
- CREAR: Añadir nuevos registros
- EDITAR: Modificar registros existentes
- ELIMINAR: Borrar registros

### 5. **Rol_Permiso_Modulo** (Tabla Intermedia)
```sql
CREATE TABLE Rol_Permiso_Modulo (
    id_rol_permiso_modulo INT PRIMARY KEY AUTO_INCREMENT,
    id_rol INT NOT NULL,
    id_permiso INT NOT NULL,
    id_modulo INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol),
    FOREIGN KEY (id_permiso) REFERENCES Permisos(id_permiso),
    FOREIGN KEY (id_modulo) REFERENCES Modulos(id_modulo),
    UNIQUE KEY (id_rol, id_permiso, id_modulo)
);
```

## 💾 Datos de Ejemplo

### Insertar Módulos
```sql
INSERT INTO Modulos (nombre_modulo, descripcion) VALUES
('USUARIOS', 'Gestión de usuarios del sistema'),
('CITAS', 'Gestión de citas médicas'),
('ESPECIALIDADES', 'Gestión de especialidades médicas'),
('ANTECEDENTES', 'Gestión de antecedentes de pacientes'),
('REPORTES', 'Acceso a reportes del sistema');
```

### Insertar Permisos
```sql
INSERT INTO Permisos (nombre_permiso, descripcion) VALUES
('VER', 'Permiso para ver registros'),
('CREAR', 'Permiso para crear registros'),
('EDITAR', 'Permiso para editar registros'),
('ELIMINAR', 'Permiso para eliminar registros');
```

### Insertar Roles
```sql
INSERT INTO Roles (nombre_rol, descripcion) VALUES
('ADMIN', 'Administrador del sistema'),
('MEDICO', 'Médico del sistema'),
('RECEP', 'Recepcionista'),
('PACIENTE', 'Paciente del sistema');
```

### Asignar Permisos a Roles

#### ADMIN - Acceso Total
```sql
-- Admin puede VER todos los módulos
INSERT INTO Rol_Permiso_Modulo (id_rol, id_permiso, id_modulo)
SELECT r.id_rol, p.id_permiso, m.id_modulo
FROM Roles r, Permisos p, Modulos m
WHERE r.nombre_rol = 'ADMIN';

-- Admin puede CREAR en todos los módulos
INSERT INTO Rol_Permiso_Modulo (id_rol, id_permiso, id_modulo)
SELECT r.id_rol, p.id_permiso, m.id_modulo
FROM Roles r, Permisos p, Modulos m
WHERE r.nombre_rol = 'ADMIN' AND p.nombre_permiso = 'CREAR';

-- Admin puede EDITAR en todos los módulos
-- Admin puede ELIMINAR en todos los módulos
```

#### MEDICO - Acceso Limitado
```sql
-- Médico puede VER citas, especialidades, antecedentes
INSERT INTO Rol_Permiso_Modulo (id_rol, id_permiso, id_modulo) VALUES
((SELECT id_rol FROM Roles WHERE nombre_rol = 'MEDICO'),
 (SELECT id_permiso FROM Permisos WHERE nombre_permiso = 'VER'),
 (SELECT id_modulo FROM Modulos WHERE nombre_modulo = 'CITAS'));

-- Médico puede CREAR citas
INSERT INTO Rol_Permiso_Modulo (id_rol, id_permiso, id_modulo) VALUES
((SELECT id_rol FROM Roles WHERE nombre_rol = 'MEDICO'),
 (SELECT id_permiso FROM Permisos WHERE nombre_permiso = 'CREAR'),
 (SELECT id_modulo FROM Modulos WHERE nombre_modulo = 'CITAS'));

-- Médico NO puede ELIMINAR citas
```

#### RECEPCIONISTA - Acceso Muy Limitado
```sql
-- Recepcionista puede VER y CREAR citas
INSERT INTO Rol_Permiso_Modulo (id_rol, id_permiso, id_modulo) VALUES
((SELECT id_rol FROM Roles WHERE nombre_rol = 'RECEP'),
 (SELECT id_permiso FROM Permisos WHERE nombre_permiso = 'VER'),
 (SELECT id_modulo FROM Modulos WHERE nombre_modulo = 'CITAS')),
 
((SELECT id_rol FROM Roles WHERE nombre_rol = 'RECEP'),
 (SELECT id_permiso FROM Permisos WHERE nombre_permiso = 'CREAR'),
 (SELECT id_modulo FROM Modulos WHERE nombre_modulo = 'CITAS'));
```

#### PACIENTE - Acceso Mínimo
```sql
-- Paciente solo puede VER sus propios datos
INSERT INTO Rol_Permiso_Modulo (id_rol, id_permiso, id_modulo) VALUES
((SELECT id_rol FROM Roles WHERE nombre_rol = 'PACIENTE'),
 (SELECT id_permiso FROM Permisos WHERE nombre_permiso = 'VER'),
 (SELECT id_modulo FROM Modulos WHERE nombre_modulo = 'ANTECEDENTES'));
```

## 🚀 Uso en Controladores

### Ejemplo 1: Verificar acceso antes de listar
```java
@GetMapping("/citas")
public ResponseEntity<?> obtenerCitas(
        @RequestParam Integer idUsuario) {
    
    Optional<Usuarios> usuarioOpt = usuariosService.obtenerPorId(idUsuario);
    if (!usuarioOpt.isPresent()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body("Usuario no encontrado");
    }
    
    Usuarios usuario = usuarioOpt.get();
    Integer idModuloCitas = 2; // ID del módulo CITAS
    
    // Verificar si tiene acceso
    verificadorPermisos.verificarAccesoAlModulo(usuario, idModuloCitas);
    
    // Si llegó aquí, tiene acceso
    List<Citas> citas = citasService.obtenerTodas();
    return ResponseEntity.ok(citas);
}
```

### Ejemplo 2: Verificar permiso específico
```java
@PostMapping("/citas")
public ResponseEntity<?> crearCita(
        @RequestParam Integer idUsuario,
        @RequestBody Citas nuevaCita) {
    
    Optional<Usuarios> usuarioOpt = usuariosService.obtenerPorId(idUsuario);
    if (!usuarioOpt.isPresent()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body("Usuario no encontrado");
    }
    
    Usuarios usuario = usuarioOpt.get();
    Integer idModuloCitas = 2;
    
    // Verificar si tiene permiso de CREAR
    verificadorPermisos.verificarPermiso(usuario, idModuloCitas, "CREAR");
    
    // Si llegó aquí, puede crear
    Citas citaCreada = citasService.crear(nuevaCita);
    return ResponseEntity.status(HttpStatus.CREATED).body(citaCreada);
}
```

## 📡 Endpoints de la API

### Obtener permisos de un rol
```
GET /api/permisos/rol/{idRol}
Respuesta:
[
  {
    "idRolPermisoModulo": 1,
    "rol": { "idRol": 1, "nombreRol": "ADMIN" },
    "permiso": { "idPermiso": 1, "nombrePermiso": "VER" },
    "modulo": { "idModulo": 1, "nombreModulo": "USUARIOS" }
  }
]
```

### Obtener permisos en un módulo específico
```
GET /api/permisos/rol/{idRol}/modulo/{idModulo}
GET /api/permisos/rol/1/modulo/2
```

### Verificar acceso a un módulo
```
GET /api/permisos/usuario/{idUsuario}/modulo/{idModulo}/acceso
GET /api/permisos/usuario/5/modulo/2/acceso
Respuesta: true o false
```

### Verificar un permiso específico
```
GET /api/permisos/usuario/{idUsuario}/modulo/{idModulo}/permiso/{nombrePermiso}
GET /api/permisos/usuario/5/modulo/2/permiso/CREAR
Respuesta: true o false
```

### Obtener módulos accesibles
```
GET /api/permisos/rol/{idRol}/modulos-accesibles
GET /api/permisos/rol/1/modulos-accesibles
Respuesta: [1, 2, 3, 5]
```

### Asignar un permiso
```
POST /api/permisos/asignar
Body:
{
  "rol": { "idRol": 3 },
  "permiso": { "idPermiso": 1 },
  "modulo": { "idModulo": 2 }
}
```

### Eliminar un permiso
```
DELETE /api/permisos/{idRolPermisoModulo}
DELETE /api/permisos/5
```

## ✅ Resumen de Beneficios

1. **Seguridad Granular**: Control específico por rol, módulo y permiso
2. **Escalabilidad**: Fácil añadir nuevos roles, módulos o permisos
3. **Flexibilidad**: Cada rol puede tener diferentes permisos en diferentes módulos
4. **Auditoría**: Se puede registrar quién hizo qué y con qué permisos
5. **Mantenimiento**: Centralizado en la tabla Rol_Permiso_Modulo

## 🔧 Próximos Pasos

1. Integrar Spring Security para autenticación más robusta
2. Implementar interceptors en todos los endpoints
3. Crear un panel de administración para gestionar permisos
4. Añadir logs de auditoría
5. Implementar caché para mejorar rendimiento de verificaciones
