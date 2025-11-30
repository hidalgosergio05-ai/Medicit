# 👤 CREAR USUARIO CON ROL - Ejemplo Completo

## 🎯 Objetivo
Crear un nuevo usuario y asignarle un rol específico.

---

## 📋 Requisitos Previos

Asegúrate de tener:
- ✅ Spring Boot corriendo en puerto 8080
- ✅ Base de datos con roles existentes
- ✅ Postman instalado

### Verificar roles disponibles
```
GET http://localhost:8080/api/roles
```

Debería retornar algo como:
```json
[
  {"idRol": 1, "nombreRol": "Medico"},
  {"idRol": 2, "nombreRol": "Paciente"},
  {"idRol": 3, "nombreRol": "Administrador"}
]
```

---

## ⚡ Opción Rápida en Postman

### Paso 1: Crear Usuario CON Rol
```
POST http://localhost:8080/api/usuarios

Header:
Content-Type: application/json

Body (raw):
{
  "nombreUsuario": "carlosgomez",
  "nombres": "Carlos",
  "apellidos": "Gómez",
  "correo": "carlos@mail.com",
  "idRol": 1,
  "idEstado": 1
}
```

**Respuesta (201 CREATED):**
```json
{
  "idUsuario": 10,
  "nombreUsuario": "carlosgomez",
  "nombres": "Carlos",
  "apellidos": "Gómez",
  "correo": "carlos@mail.com",
  "idRol": 1,
  "nombreRol": "Medico",
  "idEstado": 1,
  "nombreEstado": "Activo"
}
```

### Paso 2: Crear Contraseña
```
POST http://localhost:8080/api/contrasenias

Header:
Content-Type: application/json

Body (raw):
{
  "usuario": {
    "idUsuario": 10
  },
  "contrasenia": "password123"
}
```

**Respuesta (201 CREATED):**
```json
{
  "idContrasenia": 1,
  "usuario": {
    "idUsuario": 10,
    "nombreUsuario": "carlosgomez"
  },
  "contrasenia": "$2a$10$..."
}
```

### Paso 3: Verificar Login
```
POST http://localhost:8080/api/auth/login

Header:
Content-Type: application/json

Body (raw):
{
  "nombreUsuario": "carlosgomez",
  "contrasenia": "password123"
}
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "userData": {
    "id_usuario": 10,
    "nombre_usuario": "carlosgomez",
    "nombres": "Carlos",
    "apellidos": "Gómez",
    "correo": "carlos@mail.com",
    "id_rol": 1,
    "nombre_rol": "Medico",
    "permisos": {
      "modulo_usuarios": {
        "ver": true,
        "crear": true,
        "editar": true,
        "eliminar": true,
        "descargar": false
      },
      "modulo_citas": {
        "ver": true,
        "crear": true,
        "editar": false,
        "eliminar": false,
        "descargar": true
      }
    }
  }
}
```

---

## 📝 Ejemplo Detallado: Usuario Médico

### Datos del Usuario a Crear
```
Nombre de usuario: drmartinez
Nombres: Juan
Apellidos: Martínez
Correo: juan.martinez@hospital.com
Rol: Médico (ID 1)
Estado: Activo (ID 1)
Contraseña: Mi@Password2025
```

### Request 1: Crear Usuario
```
POST /api/usuarios

{
  "nombreUsuario": "drmartinez",
  "nombres": "Juan",
  "apellidos": "Martínez",
  "correo": "juan.martinez@hospital.com",
  "idRol": 1,
  "idEstado": 1
}
```

**Response:**
```json
{
  "idUsuario": 11,
  "nombreUsuario": "drmartinez",
  "nombres": "Juan",
  "apellidos": "Martínez",
  "correo": "juan.martinez@hospital.com",
  "idRol": 1,
  "nombreRol": "Medico",
  "idEstado": 1,
  "nombreEstado": "Activo",
  "especialidades": [],
  "contrasenias": [],
  "correos": [],
  "estado": {
    "idEstado": 1,
    "nombreEstado": "Activo"
  },
  "rol": {
    "idRol": 1,
    "nombreRol": "Medico"
  }
}
```

**Guardamos:** `idUsuario = 11`

---

## 👨‍⚕️ Ejemplo 2: Usuario Paciente

### Datos
```
Nombre de usuario: pepitoperez
Nombres: Pepito
Apellidos: Pérez
Correo: pepito.perez@mail.com
Rol: Paciente (ID 2)
Estado: Activo (ID 1)
```

### Request
```
POST /api/usuarios

{
  "nombreUsuario": "pepitoperez",
  "nombres": "Pepito",
  "apellidos": "Pérez",
  "correo": "pepito.perez@mail.com",
  "idRol": 2,
  "idEstado": 1
}
```

**Response:**
```json
{
  "idUsuario": 12,
  "nombreUsuario": "pepitoperez",
  "nombres": "Pepito",
  "apellidos": "Pérez",
  "correo": "pepito.perez@mail.com",
  "idRol": 2,
  "nombreRol": "Paciente",
  "idEstado": 1,
  "nombreEstado": "Activo"
}
```

---

## 🔐 Ejemplo 3: Usuario Administrador

### Datos
```
Nombre de usuario: admin1
Nombres: Administrador
Apellidos: Sistema
Correo: admin@medicit.com
Rol: Administrador (ID 3)
Estado: Activo (ID 1)
```

### Request
```
POST /api/usuarios

{
  "nombreUsuario": "admin1",
  "nombres": "Administrador",
  "apellidos": "Sistema",
  "correo": "admin@medicit.com",
  "idRol": 3,
  "idEstado": 1
}
```

**Response:**
```json
{
  "idUsuario": 13,
  "nombreUsuario": "admin1",
  "nombres": "Administrador",
  "apellidos": "Sistema",
  "correo": "admin@medicit.com",
  "idRol": 3,
  "nombreRol": "Administrador",
  "idEstado": 1,
  "nombreEstado": "Activo"
}
```

---

## 🧪 Con cURL

### Crear Usuario Médico
```bash
curl -X POST http://localhost:8080/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombreUsuario": "drmartinez",
    "nombres": "Juan",
    "apellidos": "Martínez",
    "correo": "juan.martinez@hospital.com",
    "idRol": 1,
    "idEstado": 1
  }'
```

### Crear Contraseña
```bash
curl -X POST http://localhost:8080/api/contrasenias \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": {
      "idUsuario": 11
    },
    "contrasenia": "Mi@Password2025"
  }'
```

### Hacer Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nombreUsuario": "drmartinez",
    "contrasenia": "Mi@Password2025"
  }'
```

---

## 💻 Con JavaScript (Fetch API)

```javascript
// 1. Crear usuario
async function crearUsuario() {
  const response = await fetch('http://localhost:8080/api/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombreUsuario: 'drmartinez',
      nombres: 'Juan',
      apellidos: 'Martínez',
      correo: 'juan.martinez@hospital.com',
      idRol: 1,  // Médico
      idEstado: 1  // Activo
    })
  });
  
  const usuario = await response.json();
  console.log('Usuario creado:', usuario);
  return usuario.idUsuario;
}

// 2. Crear contraseña
async function crearContrasenia(idUsuario, password) {
  const response = await fetch('http://localhost:8080/api/contrasenias', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      usuario: {
        idUsuario: idUsuario
      },
      contrasenia: password
    })
  });
  
  const result = await response.json();
  console.log('Contraseña creada');
  return result;
}

// 3. Hacer login
async function hacerLogin(nombreUsuario, password) {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombreUsuario: nombreUsuario,
      contrasenia: password
    })
  });
  
  const data = await response.json();
  console.log('Login exitoso:', data.userData);
  return data;
}

// Ejecutar todo
async function procesoPrincipal() {
  try {
    // Paso 1: Crear usuario
    const idUsuario = await crearUsuario();
    console.log(`Usuario creado con ID: ${idUsuario}`);
    
    // Paso 2: Crear contraseña
    await crearContrasenia(idUsuario, 'Mi@Password2025');
    console.log('Contraseña asignada');
    
    // Paso 3: Hacer login
    const loginData = await hacerLogin('drmartinez', 'Mi@Password2025');
    console.log('Usuario logueado con permisos:', loginData.userData.permisos);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Llamar la función
procesoPrincipal();
```

---

## 🎯 Campos Disponibles al Crear Usuario

| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `nombreUsuario` | String | ✅ | Nombre único para login |
| `nombres` | String | ✅ | Nombres de la persona |
| `apellidos` | String | ✅ | Apellidos de la persona |
| `correo` | String | ✅ | Email del usuario |
| `idRol` | Integer | ✅ | ID del rol (1, 2, 3, etc.) |
| `idEstado` | Integer | ✅ | ID del estado (1=Activo, etc.) |

---

## ✅ Checklist: Crear Usuario Completo

- [ ] Paso 1: POST /api/usuarios (crear usuario)
  - Obtener `idUsuario` de la respuesta
  
- [ ] Paso 2: POST /api/contrasenias (asignar contraseña)
  - Usar el `idUsuario` del paso anterior
  
- [ ] Paso 3: POST /api/auth/login (verificar login)
  - Usar `nombreUsuario` y `contrasenia`
  - Verificar que retorna `userData.permisos`

---

## 🔍 Verificar que el Usuario Tiene el Rol Correcto

Después de crear el usuario, verifica que tiene los permisos:

```
GET http://localhost:8080/api/auth/usuario/11

Respuesta:
{
  "id_usuario": 11,
  "nombre_rol": "Medico",
  "permisos": {
    "modulo_usuarios": { "ver": true, "crear": true, ... },
    "modulo_citas": { "ver": true, "crear": true, ... },
    ...
  }
}
```

---

## 🚨 Errores Comunes

### ❌ "400 Bad Request"
**Causa:** Campos faltantes o formato incorrecto
**Solución:** Verifica que tienes todos los campos requeridos

```json
{
  "nombreUsuario": "xxx",  // ✅ Requerido
  "nombres": "xxx",         // ✅ Requerido
  "apellidos": "xxx",       // ✅ Requerido
  "correo": "xxx@xxx.com",  // ✅ Requerido
  "idRol": 1,               // ✅ Requerido
  "idEstado": 1             // ✅ Requerido
}
```

### ❌ "404 Not Found - Rol no existe"
**Causa:** El `idRol` no existe en la BD
**Solución:** Verifica los roles disponibles

```
GET /api/roles
```

### ❌ "401 Unauthorized en login"
**Causa:** La contraseña no se creó correctamente
**Solución:** Crea la contraseña nuevamente

```
POST /api/contrasenias
```

### ❌ "409 Conflict - Usuario duplicado"
**Causa:** Ya existe un usuario con ese `nombreUsuario`
**Solución:** Usa otro nombre de usuario

---

## 📊 Flujo Completo Visual

```
┌─────────────────────────────────┐
│ POST /api/usuarios              │
│ (Crear usuario con rol)         │
├─────────────────────────────────┤
│ {                               │
│   nombreUsuario: "drmartinez"   │
│   nombres: "Juan"               │
│   apellidos: "Martínez"         │
│   correo: "juan@..."            │
│   idRol: 1  ← MÉDICO            │
│   idEstado: 1                   │
│ }                               │
└──────────────┬──────────────────┘
               │
               ↓
      ✅ Usuario creado
      idUsuario: 11
               │
               ↓
┌─────────────────────────────────┐
│ POST /api/contrasenias          │
│ (Asignar contraseña)            │
├─────────────────────────────────┤
│ {                               │
│   usuario: { idUsuario: 11 }    │
│   contrasenia: "Mi@Pwd2025"     │
│ }                               │
└──────────────┬──────────────────┘
               │
               ↓
      ✅ Contraseña asignada
               │
               ↓
┌─────────────────────────────────┐
│ POST /api/auth/login            │
│ (Hacer login)                   │
├─────────────────────────────────┤
│ {                               │
│   nombreUsuario: "drmartinez"   │
│   contrasenia: "Mi@Pwd2025"     │
│ }                               │
└──────────────┬──────────────────┘
               │
               ↓
      ✅ Login exitoso
      userData.id_rol: 1
      userData.nombre_rol: "Medico"
      userData.permisos: { ... }
```

---

## 🎓 Concepto Clave

**Crear usuario = Asignar rol automáticamente**

```
Usuario → rol → permisos

Cuando creas un usuario con idRol: 1
↓
Automáticamente hereda los permisos del rol Médico
↓
Al hacer login, recibe todos esos permisos en userData.permisos
```

---

¡Listo! Ya sabes crear usuarios con roles. 🎉
