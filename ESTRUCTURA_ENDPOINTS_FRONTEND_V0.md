# 📱 Estructura de Endpoints para Desarrollo Frontend en V0

## 🎯 Propósito
Este documento describe la estructura completa de todos los endpoints de la API para que el Frontend pueda consumirlos correctamente en V0.

---

## 🔐 1. AUTENTICACIÓN Y LOGIN

### 1.1 Login (Obtener Token/Sesión)
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "nombreUsuario": "drmartinez",
  "contrasenia": "Mi@Password2025"
}

Response (200 OK):
{
  "success": true,
  "userData": {
    "id_usuario": 11,
    "nombre_usuario": "drmartinez",
    "nombres": "Juan",
    "apellidos": "Martínez",
    "correo": "juan@hospital.com",
    "id_rol": 1,
    "nombre_rol": "Medico",
    "id_estado": 1,
    "nombre_estado": "Activo",
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
      },
      "modulo_preguntas": {
        "ver": true,
        "crear": false,
        "editar": false,
        "eliminar": false,
        "descargar": true
      }
    }
  }
}

Errores:
- 401 Unauthorized: Credenciales inválidas
- 400 Bad Request: Datos incompletos
```

---

## 👥 2. USUARIOS

### 2.1 Crear Usuario Completo
```
POST /api/usuarios/completo
Content-Type: application/json

Request:
{
  "nombreUsuario": "drmartinez",
  "nombres": "Juan",
  "apellidos": "Martínez",
  "dui": "12345678-9",
  "fechaNacimiento": "1985-03-15",
  "idRol": 1,
  "idEstado": 1,
  "idEspecialidades": [1, 2],
  "contrasenia": "Mi@Password2025",
  "telefono": "7123456789",
  "correo": "juan@hospital.com",
  "preguntasRespuestas": [
    {
      "pregunta": "¿Cuál es tu animal favorito?",
      "respuesta": "gato"
    }
  ]
}

Response (201 CREATED):
{
  "idUsuario": 11,
  "nombreUsuario": "drmartinez",
  "nombres": "Juan",
  "apellidos": "Martínez",
  "correo": "juan@hospital.com",
  "idRol": 1,
  "nombreRol": "Medico",
  "permisos": { ... }
}

Errores:
- 400 Bad Request: Campos inválidos
- 409 Conflict: Usuario duplicado
```

### 2.3 Obtener Todos los Usuarios
```
GET /api/usuarios

Response (200 OK):
[
  {
    "idUsuario": 1,
    "nombreUsuario": "admin",
    "nombres": "Administrador",
    "apellidos": "Sistema",
    "correo": "admin@medicit.com",
    "idRol": 3,
    "nombreRol": "Administrador",
    "idEstado": 1,
    "nombreEstado": "Activo"
  },
  {
    "idUsuario": 2,
    "nombreUsuario": "drmartinez",
    "nombres": "Juan",
    "apellidos": "Martínez",
    "correo": "juan@hospital.com",
    "idRol": 1,
    "nombreRol": "Medico",
    "idEstado": 1,
    "nombreEstado": "Activo"
  }
]

Errores:
- 500 Internal Server Error
```

### 2.4 Obtener Usuario por ID
```
GET /api/usuarios/{id}

Ejemplo:
GET /api/usuarios/11

Response (200 OK):
{
  "idUsuario": 11,
  "nombreUsuario": "drmartinez",
  "nombres": "Juan",
  "apellidos": "Martínez",
  "correo": "juan@hospital.com",
  "idRol": 1,
  "nombreRol": "Medico"
}

Errores:
- 404 Not Found: Usuario no existe
```

### 2.5 Actualizar Usuario
```
PUT /api/usuarios/{id}
Content-Type: application/json

Ejemplo:
PUT /api/usuarios/11

Request:
{
  "nombreUsuario": "drmartinez",
  "nombres": "Juan Carlos",
  "apellidos": "Martínez García",
  "correo": "juancarlos@hospital.com",
  "idRol": 1,
  "idEstado": 1
}

Response (200 OK):
{
  "idUsuario": 11,
  "nombreUsuario": "drmartinez",
  "nombres": "Juan Carlos",
  "apellidos": "Martínez García",
  "correo": "juancarlos@hospital.com",
  "idRol": 1
}

Errores:
- 404 Not Found: Usuario no existe
- 400 Bad Request: Datos inválidos
```

### 2.6 Eliminar/Desactivar Usuario
```
DELETE /api/usuarios/{id}

Ejemplo:
DELETE /api/usuarios/11

Response (200 OK):
{
  "idUsuario": 11,
  "nombreUsuario": "drmartinez",
  "nombres": "Juan",
  "apellidos": "Martínez",
  "idEstado": 2,
  "nombreEstado": "Inactivo"
}

Errores:
- 404 Not Found: Usuario no existe
```

### 2.7 Asignar Especialidades a Usuario
```
POST /api/usuarios/{id}/especialidades
Content-Type: application/json

Ejemplo:
POST /api/usuarios/11/especialidades

Request (lista de IDs):
[1, 2, 3]

Response (200 OK):
{
  "idUsuario": 11,
  "nombreUsuario": "drmartinez",
  "especialidades": [
    {
      "idEspecialidad": 1,
      "nombreEspecialidad": "Cardiología"
    },
    {
      "idEspecialidad": 2,
      "nombreEspecialidad": "Neurología"
    }
  ]
}

Errores:
- 404 Not Found: Usuario no existe
- 400 Bad Request: Especialidad no existe
```

---

## 🔑 3. ROLES

### 3.1 Obtener Todos los Roles
```
GET /api/roles

Response (200 OK):
[
  {
    "idRol": 1,
    "nombreRol": "Medico"
  },
  {
    "idRol": 2,
    "nombreRol": "Paciente"
  },
  {
    "idRol": 3,
    "nombreRol": "Administrador"
  }
]

Errores:
- 500 Internal Server Error
```

### 3.2 Obtener Rol por ID
```
GET /api/roles/{id}

Ejemplo:
GET /api/roles/1

Response (200 OK):
{
  "idRol": 1,
  "nombreRol": "Medico"
}

Errores:
- 404 Not Found: Rol no existe
```

### 3.3 Crear Rol
```
POST /api/roles
Content-Type: application/json

Request:
{
  "nombreRol": "Enfermero"
}

Response (201 CREATED):
{
  "idRol": 4,
  "nombreRol": "Enfermero"
}

Errores:
- 400 Bad Request: Nombre vacío
- 409 Conflict: Rol duplicado
```

### 3.4 Actualizar Rol
```
PUT /api/roles/{id}
Content-Type: application/json

Ejemplo:
PUT /api/roles/4

Request:
{
  "nombreRol": "Enfermera"
}

Response (200 OK):
{
  "idRol": 4,
  "nombreRol": "Enfermera"
}

Errores:
- 404 Not Found: Rol no existe
- 409 Conflict: Nombre duplicado
```

### 3.5 Eliminar Rol
```
DELETE /api/roles/{id}

Ejemplo:
DELETE /api/roles/4

Response (204 NO CONTENT)

Errores:
- 404 Not Found: Rol no existe
- 400 Bad Request: Rol tiene usuarios asignados
```

---

## 🔐 4. PERMISOS

### 4.1 Obtener Todos los Permisos
```
GET /api/permisos

Response (200 OK):
[
  {
    "idPermiso": 1,
    "idRol": 1,
    "rol": {
      "idRol": 1,
      "nombreRol": "Medico"
    },
    "idModulo": 1,
    "nombreModulo": "Usuarios",
    "ver": true,
    "crear": true,
    "editar": true,
    "eliminar": false,
    "descargar": true
  }
]

Errores:
- 500 Internal Server Error
```

### 4.2 Obtener Permiso por ID
```
GET /api/permisos/{id}

Ejemplo:
GET /api/permisos/1

Response (200 OK):
{
    "idPermiso": 1,
    "rol": {
        "idRol": 1,
        "nombreRol": "paciente",
        "descripcion": "ninguno",
        "rolesPermisosModulos": []
    },
    "modulo": "modulo_inicio",
    "ver": true,
    "crear": true,
    "editar": true,
    "eliminar": false,
    "descargar": true
}

Errores:
- 404 Not Found: Permiso no existe
```

### 4.3 Obtener Permisos por Rol
```
GET /api/permisos/rol/{idRol}

Ejemplo:
GET /api/permisos/rol/1

Response (200 OK):
[
  {
    "idPermiso": 1,
    "idRol": 1,
    "nombreModulo": "Usuarios",
    "ver": true,
    "crear": true,
    "editar": true,
    "eliminar": false,
    "descargar": true
  },
  {
    "idPermiso": 2,
    "idRol": 1,
    "nombreModulo": "Citas",
    "ver": true,
    "crear": true,
    "editar": false,
    "eliminar": false,
    "descargar": true
  }
]

Errores:
- 404 Not Found: Rol no existe
```

### 4.4 Crear Permiso
```
POST /api/permisos
Content-Type: application/json

Request:
{
  "rol": {
    "idRol": 1
  },
  "modulo": "modulo_dshboard",
  "ver": true,
  "crear": true,
  "editar": true,
  "eliminar": false,
  "descargar": false
}

Response (201 CREATED):
{
    "idPermiso": 2,
    "rol": {
        "idRol": 2,
        "nombreRol": null,
        "descripcion": null,
        "rolesPermisosModulos": null
    },
    "modulo": "citas",
    "ver": true,
    "crear": true,
    "editar": true,
    "eliminar": false,
    "descargar": false
}

Errores:
- 400 Bad Request: Campos faltantes
- 409 Conflict: Permiso duplicado
```

### 4.5 Actualizar Permiso
```
PUT /api/permisos/{id}
Content-Type: application/json

Ejemplo:
PUT /api/permisos/1

Request:
{
  "idRol": 1,
  "idModulo": 1,
  "ver": true,
  "crear": false,
  "editar": true,
  "eliminar": false,
  "descargar": true
}

Response (200 OK):
{
  "idPermiso": 1,
  "idRol": 1,
  "idModulo": 1,
  "ver": true,
  "crear": false,
  "editar": true,
  "eliminar": false,
  "descargar": true
}

Errores:
- 404 Not Found: Permiso no existe
- 400 Bad Request: Datos inválidos
```

### 4.6 Eliminar Permiso
```
DELETE /api/permisos/{id}

Ejemplo:
DELETE /api/permisos/1

Response (204 NO CONTENT)

Errores:
- 404 Not Found: Permiso no existe
```

---

## 📅 5. CITAS

### 5.1 Obtener Todas las Citas
```
GET /api/citas

Response (200 OK):
[
  {
        "idCita": 2,
        "paciente": {
            "idUsuario": 3,
            "nombreUsuario": "8sergsioh",
            "nombres": "Juan",
            "apellidos": "Martínez",
            "dui": "12342673-9",
            "fechaNacimiento": "1985-03-14",
            "rol": {
                "idRol": 1,
                "nombreRol": "paciente",
                "descripcion": "ninguno",
                "rolesPermisosModulos": []
            },
            "estado": {
                "idEstado": 1,
                "estado": "Activo",
                "descripcion": "ningnuo"
            },
            "especialidades": []
        },
        "medico": {
            "idUsuario": 4,
            "nombreUsuario": "MarlonA",
            "nombres": "Marlon",
            "apellidos": "Pineda",
            "dui": "12322673-9",
            "fechaNacimiento": "1985-03-14",
            "rol": {
                "idRol": 2,
                "nombreRol": "Medico",
                "descripcion": "ninguno",
                "rolesPermisosModulos": []
            },
            "estado": {
                "idEstado": 1,
                "estado": "Activo",
                "descripcion": "ningnuo"
            },
            "especialidades": [
                {
                    "idEspecialidad": 1,
                    "nombreEspecialidad": "Hurologo",
                    "descripcion": "se la meto a la Minimi"
                }
            ]
        },
        "fechaHora": "2025-12-05T14:30:00",
        "motivo": "Revisión anual y chequeo de rutina.",
        "estado": {
            "idEstado": 1,
            "estado": "Activo",
            "descripcion": "ningnuo"
        }
    }
]

Errores:
- 500 Internal Server Error
```

### 5.2 Obtener Cita por ID
```
GET /api/citas/{id}

Ejemplo:
GET /api/citas/1

Response (200 OK):
{
    "idCita": 1,
    "paciente": {
        "idUsuario": 3,
        "nombreUsuario": "8sergsioh",
        "nombres": "Juan",
        "apellidos": "Martínez",
        "dui": "12342673-9",
        "fechaNacimiento": "1985-03-14",
        "rol": {
            "idRol": 1,
            "nombreRol": "paciente",
            "descripcion": "ninguno",
            "rolesPermisosModulos": []
        },
        "estado": {
            "idEstado": 1,
            "estado": "Activo",
            "descripcion": "ningnuo"
        },
        "especialidades": []
    },
    "medico": {
        "idUsuario": 4,
        "nombreUsuario": "MarlonA",
        "nombres": "Marlon",
        "apellidos": "Pineda",
        "dui": "12322673-9",
        "fechaNacimiento": "1985-03-14",
        "rol": {
            "idRol": 2,
            "nombreRol": "Medico",
            "descripcion": "ninguno",
            "rolesPermisosModulos": []
        },
        "estado": {
            "idEstado": 1,
            "estado": "Activo",
            "descripcion": "ningnuo"
        },
        "especialidades": [
            {
                "idEspecialidad": 1,
                "nombreEspecialidad": "Hurologo",
                "descripcion": "se la meto a la Minimi"
            }
        ]
    },
    "fechaHora": "2025-12-05T14:30:00",
    "motivo": "Revisión anual y chequeo de rutina.",
    "estado": {
        "idEstado": 1,
        "estado": "Activo",
        "descripcion": "ningnuo"
    }
}

Errores:
- 404 Not Found: Cita no existe
```

### 5.3 Crear Cita
```
POST /api/citas
Content-Type: application/json

Request:
{
  "paciente": {
    "idUsuario": 5
  },
  "medico": {
    "idUsuario": 2
  },
  "fechaHora": "2025-12-15T14:30:00",
  "motivo": "Consulta general",
  "estado": {
    "idEstado": 1
  }
}

Response (201 CREATED):
{
  "idCita": 1,
  "idPaciente": 5,
  "nombrePaciente": "Carlos Pérez",
  "idMedico": 2,
  "nombreMedico": "Dr. Juan Martínez",
  "fechaHora": "2025-12-15T14:30:00",
  "motivo": "Consulta general",
  "estadoCita": "Activo"
}

Errores:
- 400 Bad Request: Campos faltantes
- 404 Not Found: Paciente o Médico no existe
- 409 Conflict: Cita duplicada
```

### 5.4 Actualizar Cita
```
PUT /api/citas/{id}
Content-Type: application/json

Ejemplo:
PUT /api/citas/1

Request:
{
  "paciente": {
    "idUsuario": 5
  },
  "medico": {
    "idUsuario": 2
  },
  "fechaHora": "2025-12-16T10:00:00",
  "motivo": "Consulta de seguimiento",
  "estado": {
    "idEstado": 1
  }
}

Response (200 OK):
{
  "idCita": 1,
  "idPaciente": 5,
  "nombrePaciente": "Carlos Pérez",
  "idMedico": 2,
  "nombreMedico": "Dr. Juan Martínez",
  "fechaHora": "2025-12-16T10:00:00",
  "motivo": "Consulta de seguimiento",
  "estadoCita": "Activo"
}

Errores:
- 404 Not Found: Cita no existe
- 400 Bad Request: Datos inválidos
```

### 5.5 Obtener Citas por Médico
```
GET /api/citas/medico/{idMedico}

Ejemplo:
GET /api/citas/medico/2

Response (200 OK):
[
  [
    {
        "idCita": 1,
        "idPaciente": 3,
        "nombrePaciente": "Juan",
        "idMedico": 4,
        "nombreMedico": "Marlon",
        "fechaHora": "2025-12-05T14:30:00",
        "motivo": "Revisión anual y chequeo de rutina.",
        "estadoCita": "Activo"
    }
]
]

Errores:
- 404 Not Found: Médico no existe
```

### 5.6 Obtener Citas por Paciente
```
GET /api/citas/paciente/{idPaciente}

Ejemplo:
GET /api/citas/paciente/5

Response (200 OK):
[
    {
        "idCita": 1,
        "idPaciente": 3,
        "nombrePaciente": "Juan",
        "idMedico": 4,
        "nombreMedico": "Marlon",
        "fechaHora": "2025-12-05T14:30:00",
        "motivo": "Revisión anual y chequeo de rutina.",
        "estadoCita": "Activo"
    }
]

Errores:
- 404 Not Found: Paciente no existe
```

### 5.7 Eliminar Cita
```
DELETE /api/citas/{id}

Ejemplo:
DELETE /api/citas/1

Response (204 NO CONTENT)

Errores:
- 404 Not Found: Cita no existe
```

---

## 🏥 6. ESPECIALIDADES

### 6.1 Obtener Todas las Especialidades
```
GET /api/especialidades

Response (200 OK):
[
  [
    {
        "idEspecialidad": 1,
        "nombreEspecialidad": "Hurologo",
        "descripcion": "se la meto a la Minimi"
    }
] 
]

Errores:
- 500 Internal Server Error
```

### 6.2 Obtener Especialidad por ID
```
GET /api/especialidades/{id}

Ejemplo:
GET /api/especialidades/1

Response (200 OK):
{
  "idEspecialidad": 1,
  "nombreEspecialidad": "Cardiología",
  "descripcion": "se la meto a la Minimi"
}

Errores:
- 404 Not Found: Especialidad no existe
```

### 6.3 Crear Especialidad
```
POST /api/especialidades
Content-Type: application/json

Request:
{
  "nombreEspecialidad": "Dermatología",
  "descripcion": "se la meto a la Minimi"
}

Response (201 CREATED):
{
  "idEspecialidad": 4,
  "nombreEspecialidad": "Dermatología",
  "descripcion": "se la meto a la Minimi"
}

Errores:
- 400 Bad Request: Nombre vacío
- 409 Conflict: Especialidad duplicada
```

### 6.4 Actualizar Especialidad
```
PUT /api/especialidades/{id}
Content-Type: application/json

Ejemplo:
PUT /api/especialidades/4

Request:
{
  "nombreEspecialidad": "Dermatología Clínica"
}

Response (200 OK):
{
  "idEspecialidad": 4,
  "nombreEspecialidad": "Dermatología Clínica"
}

Errores:
- 404 Not Found: Especialidad no existe
- 409 Conflict: Nombre duplicado
```

### 6.5 Eliminar Especialidad
```
DELETE /api/especialidades/{id}

Ejemplo:
DELETE /api/especialidades/4

Response (204 NO CONTENT)

Errores:
- 404 Not Found: Especialidad no existe
- 400 Bad Request: Especialidad asignada a médicos
```

---

## ❓ 7. PREGUNTAS

### 7.1 Obtener Todas las Preguntas
```
GET /api/preguntas

Response (200 OK):
[
  {
    "idPregunta": 1,
    "descripcion": "¿Cuál es tu animal favorito?"
  },
  {
    "idPregunta": 2,
    "descripcion": "¿Cuál es tu ciudad natal?"
  }
]

Errores:
- 500 Internal Server Error
```

### 7.2 Obtener Pregunta por ID
```
GET /api/preguntas/{id}

Ejemplo:
GET /api/preguntas/1

Response (200 OK):
{
  "idPregunta": 1,
  "descripcion": "¿Cuál es tu animal favorito?"
}

Errores:
- 404 Not Found: Pregunta no existe
```

### 7.3 Crear Pregunta
```
POST /api/preguntas
Content-Type: application/json

Request:
{
  "descripcion": "¿Cuál es tu color favorito?"
}

Response (201 CREATED):
{
  "idPregunta": 3,
  "descripcion": "¿Cuál es tu color favorito?"
}

Errores:
- 400 Bad Request: Descripción vacía
```

### 7.4 Actualizar Pregunta
```
PUT /api/preguntas/{id}
Content-Type: application/json

Ejemplo:
PUT /api/preguntas/3

Request:
{
  "descripcion": "¿Cuál es tu color favorito del arco iris?"
}

Response (200 OK):
{
  "idPregunta": 3,
  "descripcion": "¿Cuál es tu color favorito del arco iris?"
}

Errores:
- 404 Not Found: Pregunta no existe
```

### 7.5 Eliminar Pregunta
```
DELETE /api/preguntas/{id}

Ejemplo:
DELETE /api/preguntas/3

Response (204 NO CONTENT)

Errores:
- 404 Not Found: Pregunta no existe
```

---

## 💬 8. RESPUESTAS

### 8.1 Obtener Todas las Respuestas
```
GET /api/respuestas

Response (200 OK):
[
  {
    "idRespuesta": 1,
    "idUsuario": 5,
    "idPregunta": 1,
    "respuesta": "gato"
  }
]

Errores:
- 500 Internal Server Error
```

### 8.2 Obtener Respuesta por ID
```
GET /api/respuestas/{id}

Ejemplo:
GET /api/respuestas/1

Response (200 OK):
{
  "idRespuesta": 1,
  "idUsuario": 5,
  "idPregunta": 1,
  "respuesta": "gato"
}

Errores:
- 404 Not Found: Respuesta no existe
```

### 8.3 Crear Respuesta
```
POST /api/respuestas
Content-Type: application/json

Request:
{
  "idUsuario": 5,
  "idPregunta": 1,
  "respuesta": "perro"
}

Response (201 CREATED):
{
  "idRespuesta": 2,
  "idUsuario": 5,
  "idPregunta": 1,
  "respuesta": "perro"
}

Errores:
- 400 Bad Request: Campos faltantes
- 404 Not Found: Usuario o Pregunta no existe
```

### 8.4 Actualizar Respuesta
```
PUT /api/respuestas/{id}
Content-Type: application/json

Ejemplo:
PUT /api/respuestas/2

Request:
{
  "idUsuario": 5,
  "idPregunta": 1,
  "respuesta": "pajaro"
}

Response (200 OK):
{
  "idRespuesta": 2,
  "idUsuario": 5,
  "idPregunta": 1,
  "respuesta": "pajaro"
}

Errores:
- 404 Not Found: Respuesta no existe
```

### 8.5 Eliminar Respuesta
```
DELETE /api/respuestas/{id}

Ejemplo:
DELETE /api/respuestas/2

Response (204 NO CONTENT)

Errores:
- 404 Not Found: Respuesta no existe
```

---

## 📋 9. ANTECEDENTES

### 9.1 Obtener Todos los Antecedentes
```
GET /api/antecedentes

Response (200 OK):
[
  {
    "idAntecedente": 1,
    "idPaciente": 5,
    "nombrePaciente": "Carlos Pérez",
    "descripcion": "Alergia a la penicilina",
    "tipo": "Alergia"
  }
]

Errores:
- 500 Internal Server Error
```

### 9.2 Obtener Antecedente por ID
```
GET /api/antecedentes/{id}

Ejemplo:
GET /api/antecedentes/1

Response (200 OK):
{
  "idAntecedente": 1,
  "idPaciente": 5,
  "nombrePaciente": "Carlos Pérez",
  "descripcion": "Alergia a la penicilina",
  "tipo": "Alergia"
}

Errores:
- 404 Not Found: Antecedente no existe
```

### 9.3 Crear Antecedente
```
POST /api/antecedentes
Content-Type: application/json

Request:
{
  "idPaciente": 5,
  "descripcion": "Hipertensión diagnosticada hace 5 años",
  "tipo": "Condición Médica"
}

Response (201 CREATED):
{
  "idAntecedente": 2,
  "idPaciente": 5,
  "nombrePaciente": "Carlos Pérez",
  "descripcion": "Hipertensión diagnosticada hace 5 años",
  "tipo": "Condición Médica"
}

Errores:
- 400 Bad Request: Campos faltantes
- 404 Not Found: Paciente no existe
```

### 9.4 Actualizar Antecedente
```
PUT /api/antecedentes/{id}
Content-Type: application/json

Ejemplo:
PUT /api/antecedentes/2

Request:
{
  "idPaciente": 5,
  "descripcion": "Hipertensión controlada con medicamentos",
  "tipo": "Condición Médica"
}

Response (200 OK):
{
  "idAntecedente": 2,
  "idPaciente": 5,
  "descripcion": "Hipertensión controlada con medicamentos",
  "tipo": "Condición Médica"
}

Errores:
- 404 Not Found: Antecedente no existe
```

### 9.5 Eliminar Antecedente
```
DELETE /api/antecedentes/{id}

Ejemplo:
DELETE /api/antecedentes/2

Response (204 NO CONTENT)

Errores:
- 404 Not Found: Antecedente no existe
```

---

## 📞 10. TELÉFONOS

### 10.1 Obtener Todos los Teléfonos
```
GET /api/telefonos

Response (200 OK):
[
  {
    "idTelefono": 1,
    "idUsuario": 5,
    "nombreUsuario": "carlosgomez",
    "numero": "7123456789",
    "tipo": "Celular"
  }
]

Errores:
- 500 Internal Server Error
```

### 10.2 Obtener Teléfono por ID
```
GET /api/telefonos/{id}

Ejemplo:
GET /api/telefonos/1

Response (200 OK):
{
  "idTelefono": 1,
  "idUsuario": 5,
  "nombreUsuario": "carlosgomez",
  "numero": "7123456789",
  "tipo": "Celular"
}

Errores:
- 404 Not Found: Teléfono no existe
```

### 10.3 Crear Teléfono
```
POST /api/telefonos
Content-Type: application/json

Request:
{
  "idUsuario": 5,
  "numero": "2223456789",
  "tipo": "Fijo"
}

Response (201 CREATED):
{
  "idTelefono": 2,
  "idUsuario": 5,
  "numero": "2223456789",
  "tipo": "Fijo"
}

Errores:
- 400 Bad Request: Campos faltantes
- 404 Not Found: Usuario no existe
```

### 10.4 Actualizar Teléfono
```
PUT /api/telefonos/{id}
Content-Type: application/json

Ejemplo:
PUT /api/telefonos/2

Request:
{
  "idUsuario": 5,
  "numero": "2227654321",
  "tipo": "Fijo"
}

Response (200 OK):
{
  "idTelefono": 2,
  "idUsuario": 5,
  "numero": "2227654321",
  "tipo": "Fijo"
}

Errores:
- 404 Not Found: Teléfono no existe
```

### 10.5 Eliminar Teléfono
```
DELETE /api/telefonos/{id}

Ejemplo:
DELETE /api/telefonos/2

Response (204 NO CONTENT)

Errores:
- 404 Not Found: Teléfono no existe
```

---

## 📧 11. CORREOS

### 11.1 Obtener Todos los Correos
```
GET /api/correos

Response (200 OK):
[
  {
    "idCorreo": 1,
    "idUsuario": 5,
    "nombreUsuario": "carlosgomez",
    "email": "carlos@mail.com",
    "principal": true
  }
]

Errores:
- 500 Internal Server Error
```

### 11.2 Obtener Correo por ID
```
GET /api/correos/{id}

Ejemplo:
GET /api/correos/1

Response (200 OK):
{
  "idCorreo": 1,
  "idUsuario": 5,
  "nombreUsuario": "carlosgomez",
  "email": "carlos@mail.com",
  "principal": true
}

Errores:
- 404 Not Found: Correo no existe
```

### 11.3 Crear Correo
```
POST /api/correos
Content-Type: application/json

Request:
{
  "idUsuario": 5,
  "email": "carlos.gomez@work.com",
  "principal": false
}

Response (201 CREATED):
{
  "idCorreo": 2,
  "idUsuario": 5,
  "email": "carlos.gomez@work.com",
  "principal": false
}

Errores:
- 400 Bad Request: Email inválido
- 404 Not Found: Usuario no existe
```

### 11.4 Actualizar Correo
```
PUT /api/correos/{id}
Content-Type: application/json

Ejemplo:
PUT /api/correos/2

Request:
{
  "idUsuario": 5,
  "email": "c.gomez@trabajo.com",
  "principal": true
}

Response (200 OK):
{
  "idCorreo": 2,
  "idUsuario": 5,
  "email": "c.gomez@trabajo.com",
  "principal": true
}

Errores:
- 404 Not Found: Correo no existe
- 400 Bad Request: Email inválido
```

### 11.5 Eliminar Correo
```
DELETE /api/correos/{id}

Ejemplo:
DELETE /api/correos/2

Response (204 NO CONTENT)

Errores:
- 404 Not Found: Correo no existe
```

---

## 🔑 12. CONTRASEÑAS

### 12.1 Obtener Todas las Contraseñas
```
GET /api/contrasenias

Response (200 OK):
[
  {
    "idContrasenia": 1,
    "idUsuario": 5,
    "nombreUsuario": "carlosgomez"
  }
]

Errores:
- 500 Internal Server Error
```

### 12.2 Obtener Contraseña por ID
```
GET /api/contrasenias/{id}

Ejemplo:
GET /api/contrasenias/1

Response (200 OK):
{
  "idContrasenia": 1,
  "idUsuario": 5,
  "nombreUsuario": "carlosgomez"
}

Errores:
- 404 Not Found: Contraseña no existe
```

### 12.3 Crear Contraseña
```
POST /api/contrasenias
Content-Type: application/json

Request:
{
  "usuario": {
    "idUsuario": 5
  },
  "contrasenia": "Mi@Password2025"
}

Response (201 CREATED):
{
  "idContrasenia": 2,
  "idUsuario": 5,
  "nombreUsuario": "carlosgomez"
}

Errores:
- 400 Bad Request: Contraseña débil
- 404 Not Found: Usuario no existe
```

### 12.4 Actualizar Contraseña
```
PUT /api/contrasenias/{id}
Content-Type: application/json

Ejemplo:
PUT /api/contrasenias/2

Request:
{
  "usuario": {
    "idUsuario": 5
  },
  "contrasenia": "NuevaPassword@2025"
}

Response (200 OK):
{
  "idContrasenia": 2,
  "idUsuario": 5
}

Errores:
- 404 Not Found: Contraseña no existe
- 400 Bad Request: Contraseña débil
```

### 12.5 Eliminar Contraseña
```
DELETE /api/contrasenias/{id}

Ejemplo:
DELETE /api/contrasenias/2

Response (204 NO CONTENT)

Errores:
- 404 Not Found: Contraseña no existe
```

---

## 📊 13. ESTADOS

### 13.1 Obtener Todos los Estados
```
GET /api/estados

Response (200 OK):
[
  {
    "idEstado": 1,
    "nombreEstado": "Activo"
  },
  {
    "idEstado": 2,
    "nombreEstado": "Inactivo"
  }
]

Errores:
- 500 Internal Server Error
```

### 13.2 Obtener Estado por ID
```
GET /api/estados/{id}

Ejemplo:
GET /api/estados/1

Response (200 OK):
{
  "idEstado": 1,
  "nombreEstado": "Activo"
}

Errores:
- 404 Not Found: Estado no existe
```

### 13.3 Crear Estado
```
POST /api/estados
Content-Type: application/json

Request:
{
  "nombreEstado": "Suspendido"
}

Response (201 CREATED):
{
  "idEstado": 3,
  "nombreEstado": "Suspendido"
}

Errores:
- 400 Bad Request: Nombre vacío
```

### 13.4 Actualizar Estado
```
PUT /api/estados/{id}
Content-Type: application/json

Ejemplo:
PUT /api/estados/3

Request:
{
  "nombreEstado": "En Revisión"
}

Response (200 OK):
{
  "idEstado": 3,
  "nombreEstado": "En Revisión"
}

Errores:
- 404 Not Found: Estado no existe
```

### 13.5 Eliminar Estado
```
DELETE /api/estados/{id}

Ejemplo:
DELETE /api/estados/3

Response (204 NO CONTENT)

Errores:
- 404 Not Found: Estado no existe
- 400 Bad Request: Estado en uso
```

---

## 🎨 14. ESTRUCTURA DE RESPUESTAS DE ERROR

Todos los errores siguen este patrón:

### Error 400 Bad Request
```json
{
  "tipo": "Validación fallida",
  "mensaje": "Descripción del error específico"
}
```

### Error 404 Not Found
```json
{
  "tipo": "No encontrado",
  "mensaje": "El recurso solicitado no existe"
}
```

### Error 409 Conflict
```json
{
  "tipo": "Conflicto",
  "mensaje": "Ya existe un recurso con esos datos"
}
```

### Error 500 Internal Server Error
```json
{
  "tipo": "Error",
  "mensaje": "Descripción del error interno del servidor"
}
```

---

## 🔄 15. FLUJOS PRINCIPALES

### Flujo 1: Crear Usuario Completo
```
POST /api/usuarios/completo
↓
Usuario + Contraseña + Teléfono + Correo + Preguntas/Respuestas
↓
Automáticamente asignado el rol y sus permisos
```

### Flujo 2: Login y Obtener Permisos
```
POST /api/auth/login
↓
Retorna userData con permisos del rol
↓
Frontend renderiza UI según permisos
```

### Flujo 3: Crear Rol con Permisos
```
POST /api/roles (Crear rol)
↓
POST /api/permisos (Asignar permisos por módulo)
↓
PUT /api/usuarios/{id} (Asignar rol a usuario)
```

### Flujo 4: Gestionar Citas
```
PASO 1: Crear Paciente (si no existe)
POST /api/usuarios/completo
↓
Crea usuario con rol Paciente, contraseña, teléfono, correo
↓
Retorna idPaciente

PASO 2: Listar Citas Disponibles
GET /api/citas (Todas las citas)
GET /api/citas/medico/{idMedico} (Citas del médico)
GET /api/citas/paciente/{idPaciente} (Citas del paciente)
↓
Visualiza disponibilidad

PASO 3: Crear Cita
POST /api/citas
{
  "paciente": {
    "idUsuario": 3 
  },
  "medico": {
    "idUsuario": 4 
  },
  "fechaHora": "2025-12-05T14:30:00",
  "motivo": "Revisión anual y chequeo de rutina.",
 "estado":{"idEstado": 1} 
}
↓
Cita programada

PASO 4: Actualizar Cita (si es necesario)
PUT /api/citas/{idCita}
↓
Cambiar fecha, motivo, estado

PASO 5: Cancelar Cita
DELETE /api/citas/{idCita}
```

---

## 💡 16. NOTAS IMPORTANTES

✅ **Base URL:** `http://localhost:80/api`

✅ **Headers requeridos:**
```
Content-Type: application/json
```

✅ **CORS:** Habilitado para `*` (todos los orígenes)

✅ **Autenticación:** Se maneja por sesión en login (userData se guarda en frontend)

✅ **Permisos:** Se heredan automáticamente del rol asignado

✅ **Estados HTTP:**
- 200 OK: Éxito en GET, PUT
- 201 CREATED: Éxito en POST
- 204 NO CONTENT: Éxito en DELETE
- 400 Bad Request: Datos inválidos
- 404 Not Found: Recurso no existe
- 409 Conflict: Recurso duplicado
- 500 Internal Server Error: Error del servidor

---

Listo para copiar a V0! 🚀
