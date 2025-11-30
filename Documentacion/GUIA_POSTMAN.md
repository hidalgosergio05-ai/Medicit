# 🧪 Guía de Pruebas en Postman - Medicit API

## 📋 Requisitos Previos

1. **Postman instalado** - Descargalo desde https://www.postman.com/downloads/
2. **Servidor Spring Boot corriendo** - `npm start` o ejecuta desde tu IDE
3. **Base de datos configurada** - Con al menos un usuario de prueba
4. **Variables de entorno** - Configuradas en Postman

---

## ⚙️ Configuración Inicial

### Paso 1: Importar la Colección

1. Abre Postman
2. Haz clic en **Import** (arriba a la izquierda)
3. Selecciona **Upload Files**
4. Busca y selecciona: `Medicit_API_Collection_v2.postman_collection.json` (incluye ejemplos de permisos)
5. Haz clic en **Import**

**Nota:** Esta colección incluye:
- Todas las requests de autenticación
- Ejemplos de CRUD de permisos
- Flujo completo: crear rol → crear permisos → asignar a usuario

### Paso 2: Configurar Variables de Entorno

1. Haz clic en el ícono de engranaje (⚙️) en la esquina superior derecha
2. Selecciona **Manage Environments**
3. Haz clic en **Create new environment**
4. Nombre: `Medicit Local`
5. Agrega estas variables:

| Variable | Valor | Tipo |
|----------|-------|------|
| `base_url` | `http://localhost:8080` | string |
| `usuario_id` | `5` | string |
| `medico_id` | `5` | string |
| `paciente_id` | `3` | string |

6. Haz clic en **Save**
7. Selecciona `Medicit Local` en el dropdown de ambientes (arriba a la derecha)

---

## 🧪 Pruebas Paso a Paso

### 1️⃣ LOGIN - Obtener Usuario con Permisos

**Método:** POST  
**URL:** `{{base_url}}/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "nombreUsuario": "juanperez",
  "contrasenia": "password123"
}
```

**Resultado esperado (200 OK):**
```json
{
  "success": true,
  "userData": {
    "id_usuario": 5,
    "correo": "juan@mail.com",
    "contrasena": "$2a$10$...",
    "nombre_usuario": "juanperez",
    "nombres": "Juan",
    "apellidos": "Pérez",
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

**En la pestaña Tests, agrega:**
```javascript
pm.test("Login exitoso", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.equal(true);
    pm.environment.set("usuario_id", jsonData.userData.id_usuario);
});
```

---

### 2️⃣ OBTENER USUARIO CONSOLIDADO

**Método:** GET  
**URL:** `{{base_url}}/api/auth/usuario/{{usuario_id}}`

**Resultado esperado (200 OK):**
Misma estructura que el login

**Tests:**
```javascript
pm.test("Usuario obtenido correctamente", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.userData.id_usuario).to.equal(5);
});
```

---

### 3️⃣ OBTENER CITAS DEL PACIENTE

**Método:** GET  
**URL:** `{{base_url}}/api/citas/paciente/3`

**Resultado esperado (200 OK):**
```json
[
  {
    "idCita": 1,
    "idPaciente": 3,
    "nombrePaciente": "Juan",
    "idMedico": 5,
    "nombreMedico": "Dr. Carlos",
    "fechaHora": "2025-12-15T14:30:00",
    "motivo": "Consulta general",
    "estadoCita": "Confirmada"
  }
]
```

---

### 4️⃣ OBTENER CITAS DEL MÉDICO

**Método:** GET  
**URL:** `{{base_url}}/api/citas/medico/{{medico_id}}`

**Resultado esperado (200 OK):**
Array de citas donde el médico es el especificado

---

### 5️⃣ OBTENER PREGUNTAS Y RESPUESTAS DEL USUARIO

**Método:** GET  
**URL:** `{{base_url}}/api/respuestas/usuario/{{usuario_id}}`

**Resultado esperado (200 OK):**
```json
[
  {
    "idRespuesta": 1,
    "usuario": {
      "idUsuario": 5,
      "nombreUsuario": "juanperez",
      "nombres": "Juan",
      "apellidos": "Pérez"
    },
    "pregunta": {
      "idPregunta": 1,
      "pregunta": "¿Cuál es tu deporte favorito?",
      "creado": "2025-11-29T10:30:00",
      "creadoPor": "admin"
    },
    "respuesta": "Fútbol"
  }
]
```

---

### 6️⃣ OBTENER CONTRASEÑA DE USUARIO

**Método:** GET  
**URL:** `{{base_url}}/api/contrasenias/usuario/{{usuario_id}}`

**Resultado esperado (200 OK):**
```json
{
  "idContrasenia": 1,
  "usuario": {
    "idUsuario": 5,
    "nombreUsuario": "juanperez",
    "nombres": "Juan",
    "apellidos": "Pérez"
  },
  "contrasenia": "$2a$10$..."
}
```

---

### 7️⃣ OBTENER ANTECEDENTES DE USUARIO

**Método:** GET  
**URL:** `{{base_url}}/api/antecedentes/usuario/{{usuario_id}}`

**Resultado esperado (200 OK):**
```json
[
  {
    "idAntecedente": 1,
    "antecedente": "Alergia a la penicilina"
  },
  {
    "idAntecedente": 2,
    "antecedente": "Diabetes tipo 2"
  }
]
```

---

### 8️⃣ CREAR ANTECEDENTE

**Método:** POST  
**URL:** `{{base_url}}/api/antecedentes`

**Body:**
```json
{
  "usuario": {
    "idUsuario": 5
  },
  "antecedente": "Nueva alergia descubierta"
}
```

**Resultado esperado (201 CREATED):**
```json
{
  "idAntecedente": 10,
  "usuario": { ... },
  "antecedente": "Nueva alergia descubierta"
}
```

---

### 9️⃣ ASIGNAR ESPECIALIDADES A MÉDICO

**Método:** POST  
**URL:** `{{base_url}}/api/usuarios/5/especialidades`

**Body (array de IDs):**
```json
[1, 2, 3]
```

**Resultado esperado (200 OK):**
```json
{
  "idUsuario": 5,
  "nombreUsuario": "drmartinez",
  "nombres": "Juan",
  "apellidos": "Martínez",
  "especialidades": [
    {
      "idEspecialidad": 1,
      "nombreEspecialidad": "Cardiología",
      "descripcion": "Especialidad del corazón"
    },
    {
      "idEspecialidad": 2,
      "nombreEspecialidad": "Cirugía General",
      "descripcion": "Cirugía general"
    }
  ]
}
```

---

## 🔐 GESTIÓN DE PERMISOS

### 🔟 OBTENER TODOS LOS PERMISOS

**Método:** GET  
**URL:** `{{base_url}}/api/permisos`

**Resultado esperado (200 OK):**
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

### 1️⃣1️⃣ OBTENER PERMISO POR ID

**Método:** GET  
**URL:** `{{base_url}}/api/permisos/1`

**Resultado esperado (200 OK):**
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

---

### 1️⃣2️⃣ CREAR NUEVO PERMISO

**Método:** POST  
**URL:** `{{base_url}}/api/permisos`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
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

**Resultado esperado (201 CREATED):**
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

**Tests:**
```javascript
pm.test("Permiso creado correctamente", function () {
    pm.response.to.have.status(201);
    var jsonData = pm.response.json();
    pm.expect(jsonData.modulo).to.equal("modulo_reportes");
    pm.environment.set("permiso_id", jsonData.idPermiso);
});
```

---

### 1️⃣3️⃣ ACTUALIZAR PERMISO

**Método:** PUT  
**URL:** `{{base_url}}/api/permisos/15`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "rol": {
    "idRol": 2
  },
  "modulo": "modulo_reportes",
  "ver": true,
  "crear": false,
  "editar": true,
  "eliminar": false,
  "descargar": true
}
```

**Resultado esperado (200 OK):**
```json
{
  "idPermiso": 15,
  "rol": {
    "idRol": 2,
    "nombreRol": "Paciente"
  },
  "modulo": "modulo_reportes",
  "ver": true,
  "crear": false,
  "editar": true,
  "eliminar": false,
  "descargar": true
}
```

---

### 1️⃣4️⃣ OBTENER PERMISOS POR ROL

**Método:** GET  
**URL:** `{{base_url}}/api/permisos/rol/1`

**Resultado esperado (200 OK):**
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
  },
  {
    "idPermiso": 3,
    "rol": {
      "idRol": 1,
      "nombreRol": "Medico"
    },
    "modulo": "modulo_permisos",
    "ver": true,
    "crear": false,
    "editar": false,
    "eliminar": false,
    "descargar": false
  }
]
```

---

### 1️⃣5️⃣ ELIMINAR PERMISO

**Método:** DELETE  
**URL:** `{{base_url}}/api/permisos/15`

**Resultado esperado (204 NO CONTENT):**
Sin body

**Tests:**
```javascript
pm.test("Permiso eliminado correctamente", function () {
    pm.response.to.have.status(204);
});
```

---

## 🔄 Flujo Completo de Prueba Recomendado

### Flujo 1: Configuración de Permisos (Administrador)
1. **Obtén todos los roles** - GET `/api/roles`
2. **Crea nuevos permisos** - POST `/api/permisos` para cada combinación rol-módulo
3. **Obtén permisos por rol** - GET `/api/permisos/rol/{idRol}` para validar
4. **Actualiza permisos** - PUT `/api/permisos/{id}` si necesitas ajustar permisos

### Flujo 2: Gestión de Usuarios (Administrador)
1. **Crea usuario** - POST `/api/usuarios`
2. **Asigna especialidades** - POST `/api/usuarios/{id}/especialidades` (si es médico)
3. **Crea contraseña** - POST `/api/contrasenias`
4. **Asigna rol** - PUT `/api/usuarios/{id}` con id_rol

### Flujo 3: Autenticación y Validación (Usuario Final)
1. **Inicia sesión** - POST `/api/auth/login`
2. **Obtén usuario consolidado** - GET `/api/auth/usuario/{id}` (para refrescar)
3. **Valida permisos** - Comprueba el mapa de permisos retornado
4. **Accede a datos** - GET `/api/citas/paciente/{id}` o GET `/api/citas/medico/{id}`

### Flujo 4: Auditoría de Permisos
1. **Obtén permisos por rol** - GET `/api/permisos/rol/{idRol}`
2. **Revisa permisos individuales** - GET `/api/permisos/{id}`
3. **Actualiza según sea necesario** - PUT `/api/permisos/{id}`
4. **Elimina permisos obsoletos** - DELETE `/api/permisos/{id}`

---

## 🐛 Solución de Problemas

### Error 401 - Credenciales Inválidas
- Verifica que el usuario exista en la BD
- Comprueba que la contraseña sea correcta
- Asegúrate de que el usuario tenga un rol asignado

### Error 404 - No Encontrado
- Verifica que el ID del usuario sea correcto
- Confirma que el usuario tiene datos asociados (citas, antecedentes, etc.)

### Error 500 - Error del Servidor
- Revisa los logs de la aplicación Spring Boot
- Verifica que la BD esté conectada
- Asegúrate de que los permisos estén configurados para el rol

### Las respuestas están vacías
- Confirma que el usuario tenga datos en la BD
- Verifica los IDs utilizados

---

## 📊 Códigos de Estado HTTP Esperados

| Método | Endpoint | Código | Significado |
|--------|----------|--------|-------------|
| POST | /api/auth/login | 200 | Login exitoso |
| POST | /api/auth/login | 401 | Credenciales inválidas |
| GET | /api/auth/usuario/:id | 200 | Usuario encontrado |
| GET | /api/auth/usuario/:id | 404 | Usuario no encontrado |
| GET | /api/citas/paciente/:id | 200 | Citas encontradas |
| GET | /api/citas/paciente/:id | 404 | Sin citas |
| POST | /api/antecedentes | 201 | Antecedente creado |
| POST | /api/antecedentes | 400 | Validación fallida |
| GET | /api/permisos | 200 | Permisos obtenidos |
| POST | /api/permisos | 201 | Permiso creado |
| PUT | /api/permisos/:id | 200 | Permiso actualizado |
| DELETE | /api/permisos/:id | 204 | Permiso eliminado |
| GET | /api/permisos/:id | 404 | Permiso no encontrado |
| GET | /api/permisos/rol/:idRol | 200 | Permisos por rol obtenidos |

---

## 💡 Consejos Útiles

1. **Usa variables** - Guarda IDs importantes en variables de entorno
2. **Scripts de Test** - Automatiza validaciones con JavaScript
3. **Colecciones** - Agrupa requests por funcionalidad
4. **Historial** - Postman guarda todas tus requests
5. **Pre-request Scripts** - Ejecuta código antes de cada request
6. **Monitor** - Crea monitoreos automáticos de tus APIs

---

¡Ahora estás listo para probar todos los nuevos endpoints! 🚀
