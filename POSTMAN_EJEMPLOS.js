/**
 * EJEMPLOS DE PRUEBAS EN POSTMAN
 * 
 * Base URL: http://localhost:8080
 * 
 * Asegúrate de que tu servidor Spring Boot esté corriendo antes de ejecutar estas pruebas.
 */

// ============================================================================
// 1. LOGIN CONSOLIDADO - Obtener usuario con contraseña y permisos
// ============================================================================

/**
 * POST /api/auth/login
 * 
 * Endpoint: Autenticar usuario y obtener información consolidada
 * 
 * Request body:
 */
{
  "nombreUsuario": "juanperez",
  "contrasenia": "password123"
}

/**
 * Response (200 OK):
 * 
 * {
 *   "success": true,
 *   "userData": {
 *     "id_usuario": 5,
 *     "correo": "juan@mail.com",
 *     "contrasena": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36MbNWc2",
 *     "nombre_usuario": "juanperez",
 *     "nombres": "Juan",
 *     "apellidos": "Pérez",
 *     "id_rol": 1,
 *     "nombre_rol": "Medico",
 *     "permisos": {
 *       "modulo_usuarios": {
 *         "ver": true,
 *         "crear": true,
 *         "editar": true,
 *         "eliminar": true,
 *         "descargar": false
 *       },
 *       "modulo_citas": {
 *         "ver": true,
 *         "crear": true,
 *         "editar": false,
 *         "eliminar": false,
 *         "descargar": true
 *       },
 *       "modulo_pacientes": {
 *         "ver": true,
 *         "crear": false,
 *         "editar": true,
 *         "eliminar": false,
 *         "descargar": true
 *       }
 *     }
 *   }
 * }
 */

// Error: Credenciales inválidas (401)
{
  "success": false,
  "message": "Credenciales inválidas"
}

// ============================================================================
// 2. OBTENER USUARIO CONSOLIDADO - Sin validación de contraseña
// ============================================================================

/**
 * GET /api/auth/usuario/5
 * 
 * Endpoint: Obtener información consolidada de un usuario específico
 * 
 * Response (200 OK):
 * Misma estructura que el login
 * 
 * {
 *   "success": true,
 *   "userData": {
 *     "id_usuario": 5,
 *     "correo": "juan@mail.com",
 *     "contrasena": "$2a$10$...",
 *     "nombre_usuario": "juanperez",
 *     "nombres": "Juan",
 *     "apellidos": "Pérez",
 *     "id_rol": 1,
 *     "nombre_rol": "Medico",
 *     "permisos": { ... }
 *   }
 * }
 */

// Error: Usuario no encontrado (404)
{
  "success": false,
  "message": "Usuario no encontrado"
}

// ============================================================================
// 3. CITAS POR PACIENTE
// ============================================================================

/**
 * GET /api/citas/paciente/3
 * 
 * Endpoint: Obtener todas las citas de un paciente en formato simplificado
 * 
 * Response (200 OK):
 */
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
  },
  {
    "idCita": 2,
    "idPaciente": 3,
    "nombrePaciente": "Juan",
    "idMedico": 6,
    "nombreMedico": "Dra. María",
    "fechaHora": "2025-12-20T10:00:00",
    "motivo": "Revisión de análisis",
    "estadoCita": "Pendiente"
  }
]

// Error: Sin citas (404)
{
  "tipo": "No encontrado",
  "mensaje": "El paciente no tiene citas registradas"
}

// ============================================================================
// 4. CITAS POR MÉDICO
// ============================================================================

/**
 * GET /api/citas/medico/5
 * 
 * Endpoint: Obtener todas las citas de un médico en formato simplificado
 * 
 * Response (200 OK):
 */
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
  },
  {
    "idCita": 3,
    "idPaciente": 7,
    "nombrePaciente": "María",
    "idMedico": 5,
    "nombreMedico": "Dr. Carlos",
    "fechaHora": "2025-12-16T15:00:00",
    "motivo": "Seguimiento",
    "estadoCita": "Confirmada"
  }
]

// ============================================================================
// 5. RESPUESTAS/PREGUNTAS DE USUARIO
// ============================================================================

/**
 * GET /api/respuestas/usuario/5
 * 
 * Endpoint: Obtener todas las respuestas/preguntas de un usuario con su ID incluido
 * 
 * Response (200 OK):
 */
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
  },
  {
    "idRespuesta": 2,
    "usuario": {
      "idUsuario": 5,
      "nombreUsuario": "juanperez",
      "nombres": "Juan",
      "apellidos": "Pérez"
    },
    "pregunta": {
      "idPregunta": 2,
      "pregunta": "¿Cuál es tu comida favorita?",
      "creado": "2025-11-29T10:30:00",
      "creadoPor": "admin"
    },
    "respuesta": "Pizza"
  }
]

// ============================================================================
// 6. CONTRASEÑA POR USUARIO
// ============================================================================

/**
 * GET /api/contrasenias/usuario/5
 * 
 * Endpoint: Obtener la contraseña de un usuario con su información
 * 
 * Response (200 OK):
 */
{
  "idContrasenia": 1,
  "usuario": {
    "idUsuario": 5,
    "nombreUsuario": "juanperez",
    "nombres": "Juan",
    "apellidos": "Pérez"
  },
  "contrasenia": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36MbNWc2"
}

// ============================================================================
// 7. ANTECEDENTES POR USUARIO (SIMPLIFICADOS)
// ============================================================================

/**
 * GET /api/antecedentes/usuario/5
 * 
 * Endpoint: Obtener antecedentes de un usuario (solo ID y descripción)
 * 
 * Response (200 OK):
 */
[
  {
    "idAntecedente": 1,
    "antecedente": "Alergia a la penicilina"
  },
  {
    "idAntecedente": 2,
    "antecedente": "Diabetes tipo 2"
  },
  {
    "idAntecedente": 3,
    "antecedente": "Hipertensión arterial"
  }
]

// ============================================================================
// 8. CREAR ANTECEDENTE
// ============================================================================

/**
 * POST /api/antecedentes
 * 
 * Endpoint: Crear un nuevo antecedente
 * 
 * Request body:
 */
{
  "usuario": {
    "idUsuario": 5
  },
  "antecedente": "Alergia a la penicilina"
}

/**
 * Response (201 CREATED):
 */
{
  "idAntecedente": 1,
  "usuario": {
    "idUsuario": 5,
    "nombreUsuario": "juanperez",
    "nombres": "Juan",
    "apellidos": "Pérez"
  },
  "antecedente": "Alergia a la penicilina"
}

// ============================================================================
// 9. ASIGNAR ESPECIALIDADES A USUARIO
// ============================================================================

/**
 * POST /api/usuarios/5/especialidades
 * 
 * Endpoint: Asignar múltiples especialidades a un usuario (médico)
 * 
 * Request body (array de IDs):
 */
[1, 2, 3]

/**
 * Response (200 OK):
 */
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

/**
 * Asignar una sola especialidad:
 * POST /api/usuarios/5/especialidades/1
 */

/**
 * Eliminar una especialidad:
 * DELETE /api/usuarios/5/especialidades/2
 */

// ============================================================================
// 10. FLUJO COMPLETO DE LOGIN EN POSTMAN
// ============================================================================

/**
 * PASO 1: Hacer LOGIN
 * 
 * POST http://localhost:8080/api/auth/login
 * Content-Type: application/json
 * 
 * {
 *   "nombreUsuario": "juanperez",
 *   "contrasenia": "password123"
 * }
 * 
 * Respuesta: Guardar el id_usuario en una variable de Postman
 * 
 * En la pestaña "Tests":
 * 
 * if (pm.response.code === 200) {
 *   var jsonData = pm.response.json();
 *   pm.environment.set("usuario_id", jsonData.userData.id_usuario);
 *   pm.environment.set("usuario_data", JSON.stringify(jsonData.userData));
 * }
 */

/**
 * PASO 2: Usar el id_usuario para obtener citas
 * 
 * GET http://localhost:8080/api/citas/paciente/{{usuario_id}}
 * 
 * O si es médico:
 * GET http://localhost:8080/api/citas/medico/{{usuario_id}}
 */

/**
 * PASO 3: Obtener preguntas del usuario
 * 
 * GET http://localhost:8080/api/respuestas/usuario/{{usuario_id}}
 */

/**
 * PASO 4: Obtener antecedentes
 * 
 * GET http://localhost:8080/api/antecedentes/usuario/{{usuario_id}}
 */

// ============================================================================
// NOTAS IMPORTANTES PARA POSTMAN
// ============================================================================

/**
 * 1. VARIABLES DE ENTORNO
 * 
 * Crear variables en Postman:
 * 
 * base_url = http://localhost:8080
 * usuario_id = 5
 * medico_id = 5
 * paciente_id = 3
 * 
 * Luego usar: {{base_url}}/api/auth/login
 */

/**
 * 2. SCRIPTS DE PRUEBA (Tests)
 * 
 * Agregar en la pestaña "Tests" después de cada request:
 * 
 * pm.test("Status code is 200", function () {
 *     pm.response.to.have.status(200);
 * });
 * 
 * pm.test("Response has success flag", function () {
 *     var jsonData = pm.response.json();
 *     pm.expect(jsonData.success).to.equal(true);
 * });
 */

/**
 * 3. ORDEN RECOMENDADO DE PRUEBAS
 * 
 * 1. POST /api/auth/login (autenticarse)
 * 2. GET /api/auth/usuario/{{usuario_id}} (obtener datos consolidados)
 * 3. GET /api/citas/paciente/{{usuario_id}} (si es paciente)
 * 4. GET /api/citas/medico/{{usuario_id}} (si es médico)
 * 5. GET /api/respuestas/usuario/{{usuario_id}}
 * 6. GET /api/antecedentes/usuario/{{usuario_id}}
 */

/**
 * 4. HEADERS RECOMENDADOS
 * 
 * Content-Type: application/json
 * Accept: application/json
 */
