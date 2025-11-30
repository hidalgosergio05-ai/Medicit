# 🔐 PermisosRestController - Documentación

## Descripción General

El `PermisosRestController` es un nuevo endpoint REST que permite gestionar de forma completa el CRUD (Create, Read, Update, Delete) de permisos en el sistema Medicit.

Los permisos controlan qué acciones puede realizar cada rol (Medico, Paciente, Administrador, etc.) en cada módulo (usuarios, citas, reportes, etc.).

---

## Endpoints Disponibles

### 1. GET /api/permisos
**Descripción:** Obtiene TODOS los permisos del sistema

```
GET http://localhost:8080/api/permisos
```

**Respuesta (200 OK):**
```json
[
  {
    "idPermiso": 1,
    "rol": {
      "idRol": 1,
      "nombreRol": "Medico"
    },
    "modulo": "modulo_usuarios",
    "ver": true,
    "crear": true,
    "editar": true,
    "eliminar": true,
    "descargar": false
  },
  {
    "idPermiso": 2,
    "rol": {
      "idRol": 1,
      "nombreRol": "Medico"
    },
    "modulo": "modulo_citas",
    "ver": true,
    "crear": true,
    "editar": false,
    "eliminar": false,
    "descargar": true
  }
]
```

---

### 2. GET /api/permisos/{id}
**Descripción:** Obtiene un permiso específico por su ID

```
GET http://localhost:8080/api/permisos/1
```

**Parámetros:**
- `id` (path param): ID del permiso a obtener

**Respuesta (200 OK):**
```json
{
  "idPermiso": 1,
  "rol": {
    "idRol": 1,
    "nombreRol": "Medico"
  },
  "modulo": "modulo_usuarios",
  "ver": true,
  "crear": true,
  "editar": true,
  "eliminar": true,
  "descargar": false
}
```

**Error (404 NOT FOUND):**
Si el permiso no existe

---

### 3. GET /api/permisos/rol/{idRol}
**Descripción:** Obtiene TODOS los permisos asignados a un rol específico

```
GET http://localhost:8080/api/permisos/rol/1
```

**Parámetros:**
- `idRol` (path param): ID del rol (1=Medico, 2=Paciente, etc.)

**Respuesta (200 OK):**
```json
[
  {
    "idPermiso": 1,
    "rol": {
      "idRol": 1,
      "nombreRol": "Medico"
    },
    "modulo": "modulo_usuarios",
    "ver": true,
    "crear": true,
    "editar": true,
    "eliminar": true,
    "descargar": false
  },
  {
    "idPermiso": 2,
    "rol": {
      "idRol": 1,
      "nombreRol": "Medico"
    },
    "modulo": "modulo_citas",
    "ver": true,
    "crear": true,
    "editar": false,
    "eliminar": false,
    "descargar": true
  }
]
```

---

### 4. POST /api/permisos
**Descripción:** CREA un nuevo permiso

```
POST http://localhost:8080/api/permisos
Content-Type: application/json

{
  "rol": {
    "idRol": 2
  },
  "modulo": "modulo_reportes",
  "ver": true,
  "crear": true,
  "editar": true,
  "eliminar": false,
  "descargar": true
}
```

**Body Requerido:**
```json
{
  "rol": {
    "idRol": 2  // ID del rol
  },
  "modulo": "modulo_reportes",  // Nombre del módulo
  "ver": true,                   // Puede ver
  "crear": true,                 // Puede crear
  "editar": true,                // Puede editar
  "eliminar": false,             // No puede eliminar
  "descargar": true              // Puede descargar
}
```

**Respuesta (201 CREATED):**
```json
{
  "idPermiso": 15,
  "rol": {
    "idRol": 2,
    "nombreRol": "Paciente"
  },
  "modulo": "modulo_reportes",
  "ver": true,
  "crear": true,
  "editar": true,
  "eliminar": false,
  "descargar": true
}
```

**Error (400 BAD REQUEST):**
Si los datos son inválidos

---

### 5. PUT /api/permisos/{id}
**Descripción:** ACTUALIZA un permiso existente

```
PUT http://localhost:8080/api/permisos/15
Content-Type: application/json

{
  "rol": {
    "idRol": 2
  },
  "modulo": "modulo_reportes",
  "ver": true,
  "crear": false,  // CAMBIO: Ahora no puede crear
  "editar": true,
  "eliminar": false,
  "descargar": true
}
```

**Parámetros:**
- `id` (path param): ID del permiso a actualizar

**Body Requerido:**
Mismo formato que POST (todos los campos de permiso)

**Respuesta (200 OK):**
```json
{
  "idPermiso": 15,
  "rol": {
    "idRol": 2,
    "nombreRol": "Paciente"
  },
  "modulo": "modulo_reportes",
  "ver": true,
  "crear": false,  // Actualizado
  "editar": true,
  "eliminar": false,
  "descargar": true
}
```

**Error (404 NOT FOUND):**
Si el permiso no existe

---

### 6. DELETE /api/permisos/{id}
**Descripción:** ELIMINA un permiso

```
DELETE http://localhost:8080/api/permisos/15
```

**Parámetros:**
- `id` (path param): ID del permiso a eliminar

**Respuesta (204 NO CONTENT):**
Sin body (solo confirma la eliminación)

**Error (404 NOT FOUND):**
Si el permiso no existe

---

## Campos de Permiso Explicados

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `idPermiso` | Integer | ID único del permiso (auto-generado) |
| `rol` | Object | El rol al que se asigna el permiso |
| `rol.idRol` | Integer | ID del rol |
| `modulo` | String | Nombre del módulo (ej: "modulo_usuarios", "modulo_citas") |
| `ver` | Boolean | Puede visualizar datos del módulo |
| `crear` | Boolean | Puede crear nuevos registros |
| `editar` | Boolean | Puede editar registros existentes |
| `eliminar` | Boolean | Puede eliminar registros |
| `descargar` | Boolean | Puede descargar reportes/datos |

---

## Flujo Completo: Crear Rol + Permisos + Usuario

### Paso 1: Crear un nuevo rol
```
POST /api/roles

{
  "nombreRol": "Especialista",
  "descripcion": "Rol para especialistas"
}

Respuesta: idRol = 5
```

### Paso 2: Crear permisos para el rol (múltiples requests)

#### 2a. Permiso para módulo de usuarios
```
POST /api/permisos

{
  "rol": { "idRol": 5 },
  "modulo": "modulo_usuarios",
  "ver": true,
  "crear": true,
  "editar": false,
  "eliminar": false,
  "descargar": false
}
```

#### 2b. Permiso para módulo de citas
```
POST /api/permisos

{
  "rol": { "idRol": 5 },
  "modulo": "modulo_citas",
  "ver": true,
  "crear": true,
  "editar": true,
  "eliminar": false,
  "descargar": true
}
```

#### 2c. Permiso para módulo de antecedentes
```
POST /api/permisos

{
  "rol": { "idRol": 5 },
  "modulo": "modulo_antecedentes",
  "ver": true,
  "crear": false,
  "editar": false,
  "eliminar": false,
  "descargar": true
}
```

### Paso 3: Verificar permisos creados
```
GET /api/permisos/rol/5

Retorna array con los 3 permisos creados
```

### Paso 4: Crear usuario con el rol
```
POST /api/usuarios

{
  "nombreUsuario": "especialista1",
  "nombres": "Carlos",
  "apellidos": "Gómez",
  "correo": "carlos@mail.com",
  "idRol": 5,  // Asignar el rol con permisos
  "idEstado": 1
}

Respuesta: idUsuario = 10
```

### Paso 5: Crear contraseña
```
POST /api/contrasenias

{
  "usuario": { "idUsuario": 10 },
  "contrasenia": "password123"
}
```

### Paso 6: Login - Validar que recibe los permisos
```
POST /api/auth/login

{
  "nombreUsuario": "especialista1",
  "contrasenia": "password123"
}

Respuesta incluye:
{
  "success": true,
  "userData": {
    "id_usuario": 10,
    "nombre_rol": "Especialista",
    "permisos": {
      "modulo_usuarios": {
        "ver": true,
        "crear": true,
        ...
      },
      "modulo_citas": {
        "ver": true,
        "crear": true,
        ...
      },
      "modulo_antecedentes": {
        "ver": true,
        "crear": false,
        ...
      }
    }
  }
}
```

---

## Casos de Uso Comunes

### Caso 1: Permitir que Pacientes creen citas

```
1. Obtén permisos del rol Paciente:
   GET /api/permisos/rol/2

2. Encuentra el permiso de modulo_citas (supongamos ID 5)

3. Actualiza permitiendo crear:
   PUT /api/permisos/5
   {
     "rol": { "idRol": 2 },
     "modulo": "modulo_citas",
     "ver": true,
     "crear": true,  // CAMBIO
     "editar": false,
     "eliminar": false,
     "descargar": false
   }

4. Próximo login de Paciente incluirá:
   "permisos.modulo_citas.crear": true
```

### Caso 2: Crear nuevo módulo para todos los roles

```
Supongamos que creas "modulo_telehealth"

Para cada rol existente (Medico, Paciente, Admin):
  POST /api/permisos
  
  Rol Medico:
  {
    "rol": { "idRol": 1 },
    "modulo": "modulo_telehealth",
    "ver": true,
    "crear": true,
    "editar": true,
    "eliminar": false,
    "descargar": false
  }
  
  Rol Paciente:
  {
    "rol": { "idRol": 2 },
    "modulo": "modulo_telehealth",
    "ver": true,
    "crear": true,
    "editar": false,
    "eliminar": false,
    "descargar": false
  }
```

### Caso 3: Auditoría - Ver qué hace cada rol

```
1. GET /api/roles → Obtén todos los roles

2. Para cada rol, GET /api/permisos/rol/{idRol}

3. Tabula los resultados:
   
   ROL         | MÓDULO          | VER | CREAR | EDITAR | ELIMINAR | DESCARGAR
   Medico      | modulo_usuarios | ✓   | ✓     | ✓      | ✓        | ✗
   Medico      | modulo_citas    | ✓   | ✓     | ✗      | ✗        | ✓
   Paciente    | modulo_citas    | ✓   | ✓     | ✗      | ✗        | ✗
   Paciente    | modulo_antece.. | ✓   | ✗     | ✗      | ✗        | ✗
```

---

## Códigos de Error

| Código | Descripción | Solución |
|--------|-------------|----------|
| 200 | OK | Solicitud exitosa |
| 201 | CREATED | Permiso creado exitosamente |
| 204 | NO CONTENT | Permiso eliminado exitosamente |
| 400 | BAD REQUEST | Datos inválidos. Verifica el formato JSON |
| 404 | NOT FOUND | Permiso no existe. Verifica el ID |
| 500 | SERVER ERROR | Error del servidor. Revisa los logs |

---

## Integración con Frontend

Después del login, el frontend recibe:

```javascript
userData.permisos = {
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
```

Usa esto para controlar la UI:

```javascript
// Mostrar/ocultar botón de crear usuario
if (userData.permisos?.modulo_usuarios?.crear) {
  document.getElementById("btn-crear-usuario").style.display = "block";
}

// Mostrar/ocultar botón de eliminar cita
if (userData.permisos?.modulo_citas?.eliminar) {
  document.getElementById("btn-eliminar-cita").style.display = "block";
}

// Mostrar/ocultar sección de descargas
if (userData.permisos?.modulo_reportes?.descargar) {
  document.getElementById("seccion-descargas").style.display = "block";
}
```

---

## Archivos de Apoyo

- `Medicit_API_Collection_v2.postman_collection.json` - Colección Postman importable
- `POSTMAN_EJEMPLOS_PERMISOS.js` - Ejemplos JavaScript detallados
- `GUIA_POSTMAN.md` - Guía completa de uso

---

¡Listo! Ya tienes acceso completo al control de permisos del sistema. 🔐
