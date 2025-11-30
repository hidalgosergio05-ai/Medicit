// ============================================================================
// SECCIÓN: GESTIÓN DE PERMISOS - EJEMPLOS COMPLETOS
// ============================================================================

/**
 * 9.1 - OBTENER TODOS LOS PERMISOS
 * GET /api/permisos
 * 
 * Retorna una lista de todos los permisos definidos en el sistema.
 * Cada permiso contiene información del rol, módulo y acciones permitidas.
 */

// Respuesta esperada (200 OK)
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

/**
 * 9.2 - CREAR NUEVO PERMISO
 * POST /api/permisos
 * 
 * Crea un nuevo permiso para un rol específico en un módulo.
 * Los permisos incluyen: ver, crear, editar, eliminar, descargar.
 * 
 * Body esperado:
 */
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

// Respuesta esperada (201 CREATED)
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

/**
 * 9.3 - ACTUALIZAR PERMISO
 * PUT /api/permisos/{id}
 * 
 * Actualiza los permisos de una combinación rol-módulo.
 * 
 * Body esperado:
 */
{
  "rol": {
    "idRol": 2
  },
  "modulo": "modulo_reportes",
  "ver": true,
  "crear": false,    // Cambió de true a false
  "editar": true,    // Nuevo permiso
  "eliminar": false,
  "descargar": true
}

/**
 * 9.4 - OBTENER PERMISOS POR ROL
 * GET /api/permisos/rol/{idRol}
 * 
 * Obtiene todos los permisos asignados a un rol específico.
 * Útil para ver qué puede hacer un rol en cada módulo.
 */

// Respuesta esperada (200 OK) - Todos los permisos del rol Medico
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

/**
 * 9.5 - ELIMINAR PERMISO
 * DELETE /api/permisos/{id}
 * 
 * Elimina un permiso específico.
 * Respuesta esperada: 204 NO CONTENT
 */

// ============================================================================
// FLUJO COMPLETO: CREAR PERMISOS Y ASIGNAR A USUARIO
// ============================================================================

/**
 * PASO 1: Crear un nuevo rol
 * POST /api/roles
 */
{
  "nombreRol": "Especialista",
  "descripcion": "Rol para especialistas del sistema"
}

// Respuesta:
{
  "idRol": 5,
  "nombreRol": "Especialista",
  "descripcion": "Rol para especialistas del sistema"
}

/**
 * PASO 2: Crear permisos para el nuevo rol
 * POST /api/permisos (ejecutar para cada módulo)
 */

// Permiso 1: Ver y crear usuarios
{
  "rol": {
    "idRol": 5
  },
  "modulo": "modulo_usuarios",
  "ver": true,
  "crear": true,
  "editar": false,
  "eliminar": false,
  "descargar": false
}

// Permiso 2: Ver y crear citas
{
  "rol": {
    "idRol": 5
  },
  "modulo": "modulo_citas",
  "ver": true,
  "crear": true,
  "editar": true,
  "eliminar": false,
  "descargar": true
}

// Permiso 3: Ver antecedentes (solo lectura)
{
  "rol": {
    "idRol": 5
  },
  "modulo": "modulo_antecedentes",
  "ver": true,
  "crear": false,
  "editar": false,
  "eliminar": false,
  "descargar": true
}

/**
 * PASO 3: Asignar el nuevo rol a un usuario
 * PUT /api/usuarios/{id}
 */
{
  "nombreUsuario": "especialista1",
  "nombres": "Carlos",
  "apellidos": "Gómez",
  "correo": "carlos@mail.com",
  "idRol": 5  // Asignar el rol recién creado
}

/**
 * PASO 4: Crear la contraseña del usuario
 * POST /api/contrasenias
 */
{
  "usuario": {
    "idUsuario": 10
  },
  "contrasenia": "password123"
}

/**
 * PASO 5: Verificar que el usuario tiene los permisos
 * POST /api/auth/login
 */
{
  "nombreUsuario": "especialista1",
  "contrasenia": "password123"
}

// Respuesta - incluye los permisos del rol asignado:
{
  "success": true,
  "userData": {
    "id_usuario": 10,
    "correo": "carlos@mail.com",
    "nombre_usuario": "especialista1",
    "nombres": "Carlos",
    "apellidos": "Gómez",
    "id_rol": 5,
    "nombre_rol": "Especialista",
    "permisos": {
      "modulo_usuarios": {
        "ver": true,
        "crear": true,
        "editar": false,
        "eliminar": false,
        "descargar": false
      },
      "modulo_citas": {
        "ver": true,
        "crear": true,
        "editar": true,
        "eliminar": false,
        "descargar": true
      },
      "modulo_antecedentes": {
        "ver": true,
        "crear": false,
        "editar": false,
        "eliminar": false,
        "descargar": true
      }
    }
  }
}

// ============================================================================
// CASOS DE USO AVANZADOS
// ============================================================================

/**
 * CASO 1: Cambiar permisos de un rol dinámicamente
 * 
 * Escenario: El rol Paciente debe poder crear citas (antes solo podía ver)
 * 
 * Pasos:
 * 1. Obtén los permisos del rol Paciente:
 *    GET /api/permisos/rol/2
 * 
 * 2. Identifica el ID del permiso que maneja modulo_citas
 *    (Por ejemplo, supongamos que es ID 5)
 * 
 * 3. Actualiza ese permiso:
 *    PUT /api/permisos/5
 */
{
  "rol": {
    "idRol": 2
  },
  "modulo": "modulo_citas",
  "ver": true,
  "crear": true,  // ← CAMBIÓ: Ahora los pacientes pueden crear citas
  "editar": false,
  "eliminar": false,
  "descargar": false
}

/**
 * Resultado: 
 * 
 * Cuando un Paciente inicie sesión nuevamente, tendrá:
 * "permisos.modulo_citas.crear": true
 * 
 * Su frontend puede entonces mostrar el botón "Crear Cita"
 */

/**
 * CASO 2: Revocar permiso a un rol
 * 
 * Escenario: Los pacientes no deben poder descargar reportes completos
 * 
 * Pasos:
 * 1. Ejecutar DELETE /api/permisos/{idPermiso}
 *    Donde idPermiso es el que tiene:
 *    - Rol: Paciente (ID 2)
 *    - Módulo: modulo_reportes
 * 
 * 2. Resultado: El paciente no verá "modulo_reportes" en su login
 */

/**
 * CASO 3: Crear un nuevo módulo para un rol existente
 * 
 * Escenario: Se crea un nuevo módulo "modulo_telehealth"
 * Se debe asignar permisos para cada rol existente
 * 
 * Pasos:
 * 1. Para cada rol existente, crear un permiso:
 */

// Para Medico
{
  "rol": {
    "idRol": 1
  },
  "modulo": "modulo_telehealth",
  "ver": true,
  "crear": true,
  "editar": true,
  "eliminar": false,
  "descargar": false
}

// Para Paciente
{
  "rol": {
    "idRol": 2
  },
  "modulo": "modulo_telehealth",
  "ver": true,
  "crear": true,
  "editar": false,
  "eliminar": false,
  "descargar": false
}

// Para Administrador
{
  "rol": {
    "idRol": 3
  },
  "modulo": "modulo_telehealth",
  "ver": true,
  "crear": true,
  "editar": true,
  "eliminar": true,
  "descargar": true
}

/**
 * CASO 4: Auditoría completa de permisos
 * 
 * Obtener una matriz completa de qué puede hacer cada rol en cada módulo
 */

// 1. Obtener todos los roles
// GET /api/roles

// 2. Para cada rol, obtener sus permisos
// GET /api/permisos/rol/{idRol}

// 3. Tabular los resultados (pseudo-código):
/*
┌──────────────────┬──────────────┬─────────┬─────────┬─────────┬──────────┬────────────┐
│ ROL              │ MÓDULO       │ VER     │ CREAR   │ EDITAR  │ ELIMINAR │ DESCARGAR  │
├──────────────────┼──────────────┼─────────┼─────────┼─────────┼──────────┼────────────┤
│ Medico (1)       │ usuarios     │ true    │ true    │ true    │ true     │ false      │
│ Medico (1)       │ citas        │ true    │ true    │ false   │ false    │ true       │
│ Medico (1)       │ permisos     │ true    │ false   │ false   │ false    │ false      │
│ Paciente (2)     │ citas        │ true    │ true    │ false   │ false    │ false      │
│ Paciente (2)     │ antecedentes │ true    │ false   │ false   │ false    │ false      │
│ Administrador(3) │ usuarios     │ true    │ true    │ true    │ true     │ true       │
│ Administrador(3) │ permisos     │ true    │ true    │ true    │ true     │ false      │
└──────────────────┴──────────────┴─────────┴─────────┴─────────┴──────────┴────────────┘
*/

// ============================================================================
// INTEGRACIÓN CON FRONTEND - EJEMPLO DE USO
// ============================================================================

/**
 * Después del login, el frontend recibe los permisos del rol:
 * 
 * {
 *   "modulo_usuarios": { "ver": true, "crear": true, ... },
 *   "modulo_citas": { "ver": true, "crear": true, ... },
 *   ...
 * }
 */

// JavaScript - Controlar visibilidad de botones según permisos
function renderUIsegunPermisos(permisos) {
    
    // Botón de crear usuario - solo si tiene permiso crear en modulo_usuarios
    if (permisos.modulo_usuarios?.crear) {
        document.getElementById("btn-crear-usuario").classList.remove("hidden");
    }
    
    // Botón de eliminar cita - solo si tiene permiso eliminar en modulo_citas
    if (permisos.modulo_citas?.eliminar) {
        document.getElementById("btn-eliminar-cita").classList.remove("hidden");
    }
    
    // Pestaña de configuración de permisos - solo si puede editar permisos
    if (permisos.modulo_permisos?.editar) {
        document.getElementById("tab-permisos").classList.remove("hidden");
    }
    
    // Botón de descargar reporte - solo si puede descargar
    if (permisos.modulo_reportes?.descargar) {
        document.getElementById("btn-descargar-reporte").classList.remove("hidden");
    }
}

// ============================================================================
// RESUMEN DE ENDPOINTS
// ============================================================================

/*
CRUD DE PERMISOS:
  GET     /api/permisos              - Obtener todos los permisos
  GET     /api/permisos/{id}         - Obtener permiso por ID
  POST    /api/permisos              - Crear nuevo permiso
  PUT     /api/permisos/{id}         - Actualizar permiso
  DELETE  /api/permisos/{id}         - Eliminar permiso

PERMISOS POR ROL:
  GET     /api/permisos/rol/{idRol}  - Obtener permisos de un rol

FLUJO: CREAR ROL + PERMISOS + ASIGNAR USUARIO:
  1. POST   /api/roles               - Crear nuevo rol
  2. POST   /api/permisos            - Crear permisos para cada módulo (x N)
  3. POST   /api/usuarios            - Crear usuario
  4. PUT    /api/usuarios/{id}       - Asignar rol al usuario
  5. POST   /api/contrasenias        - Crear contraseña
  6. POST   /api/auth/login          - Login (recibe permisos automáticamente)
*/
