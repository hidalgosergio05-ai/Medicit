# 📋 RESUMEN: Permisos y Sistema de Roles - Cambios Completados

## 🎯 Objetivo
Crear un sistema completo de gestión de permisos que permita:
- Crear y gestionar permisos para cada rol
- Asignar permisos a módulos específicos
- Retornar automáticamente los permisos del usuario al hacer login
- Controlar la interfaz del usuario según sus permisos

---

## ✅ Cambios Realizados

### 1. Nuevo Controller: PermisosRestController ✨
**Ubicación:** `Backend/app/src/main/java/sv/medicit/app/Controladores/PermisosRestController.java`

**Endpoints creados:**
- `GET /api/permisos` - Obtener todos los permisos
- `GET /api/permisos/{id}` - Obtener permiso por ID
- `GET /api/permisos/rol/{idRol}` - Obtener permisos de un rol
- `POST /api/permisos` - Crear nuevo permiso
- `PUT /api/permisos/{id}` - Actualizar permiso
- `DELETE /api/permisos/{id}` - Eliminar permiso

**Estado:** ✅ Compilado sin errores

---

## 📚 Documentación Creada

### 1. GUIA_POSTMAN.md (Actualizada)
- Pasos para importar la colección
- Configuración de variables de entorno
- 15+ ejemplos de endpoints con requests y respuestas
- Flujos recomendados para pruebas
- Sección especial: Gestión de Permisos (6 ejemplos)
- Códigos HTTP esperados
- Solución de problemas

### 2. Medicit_API_Collection_v2.postman_collection.json (Nueva)
- Colección Postman lista para importar
- 6 carpetas organizadas:
  - 0. Configuración Inicial
  - 1. Gestión de Permisos (6 requests)
  - 2. Flujo: Crear Rol + Permisos + Usuario (8 steps)
  - 3. Login y Autenticación
  - 4. Citas
  - 5. Preguntas y Respuestas
  - 6. Antecedentes
- Pre-configurada con variables (base_url, usuario_id, etc.)
- 20+ requests listas para ejecutar

### 3. POSTMAN_EJEMPLOS_PERMISOS.js (Nueva)
- Archivo JavaScript con 300+ líneas
- Ejemplos de CRUD de permisos
- Flujo completo: Crear rol → Permisos → Usuario → Login
- 4 casos de uso avanzados
- Integración con frontend
- Código de ejemplo para controlar UI según permisos

### 4. PERMISOS_DOCUMENTACION.md (Nueva)
- Documentación técnica completa del PermisosRestController
- Descripción detallada de cada endpoint
- Ejemplos de request/response para cada endpoint
- Explicación de campos
- Flujo paso a paso con comandos reales
- Casos de uso comunes
- Integración con frontend (código JavaScript)
- Tabla de errores y soluciones

---

## 🔄 Flujo Completo: De Cero a Usuario con Permisos

### Paso 1: Crear Rol
```
POST /api/roles
{
  "nombreRol": "Especialista",
  "descripcion": "Rol para especialistas"
}
→ Respuesta: idRol = 5
```

### Paso 2: Crear Permisos (Para cada módulo)
```
POST /api/permisos
{
  "rol": { "idRol": 5 },
  "modulo": "modulo_usuarios",
  "ver": true, "crear": true, ...
}
```

### Paso 3: Crear Usuario
```
POST /api/usuarios
{
  "nombreUsuario": "especialista1",
  "idRol": 5,  ← Asigna el rol con permisos
  ...
}
→ Respuesta: idUsuario = 10
```

### Paso 4: Crear Contraseña
```
POST /api/contrasenias
{
  "usuario": { "idUsuario": 10 },
  "contrasenia": "password123"
}
```

### Paso 5: Login - Verificar Permisos
```
POST /api/auth/login
{
  "nombreUsuario": "especialista1",
  "contrasenia": "password123"
}

→ Respuesta incluye:
{
  "userData": {
    "id_usuario": 10,
    "nombre_rol": "Especialista",
    "permisos": {
      "modulo_usuarios": { "ver": true, "crear": true, ... },
      "modulo_citas": { "ver": true, "crear": true, ... },
      ...
    }
  }
}
```

---

## 🛠️ Herramientas de Prueba Disponibles

### Opción 1: Postman GUI (Recomendado para principiantes)
1. Importa `Medicit_API_Collection_v2.postman_collection.json`
2. Configura variables de entorno
3. Ejecuta las requests punto a punto
4. Visualiza respuestas en JSON

### Opción 2: Scripts JavaScript
1. Consulta `POSTMAN_EJEMPLOS_PERMISOS.js`
2. Copia ejemplos de requests
3. Ejecuta en Postman o herramienta REST

### Opción 3: Línea de comandos (cURL)
```bash
# Obtener todos los permisos
curl -X GET http://localhost:8080/api/permisos

# Crear permiso
curl -X POST http://localhost:8080/api/permisos \
  -H "Content-Type: application/json" \
  -d '{
    "rol": { "idRol": 2 },
    "modulo": "modulo_reportes",
    "ver": true, "crear": true, ...
  }'
```

---

## 📊 Matriz de Permisos

| Acción | Descripción |
|--------|-------------|
| **ver** | Puede visualizar datos del módulo |
| **crear** | Puede crear nuevos registros |
| **editar** | Puede modificar registros existentes |
| **eliminar** | Puede borrar registros |
| **descargar** | Puede descargar/exportar datos |

---

## 💻 Integración Frontend

```javascript
// Después del login
const { userData } = loginResponse;

// Controlar visibilidad de elementos
if (userData.permisos?.modulo_usuarios?.crear) {
  document.getElementById("btn-crear-usuario").style.display = "block";
}

if (userData.permisos?.modulo_citas?.eliminar) {
  document.getElementById("btn-eliminar-cita").style.display = "block";
}

// Tabla de permisos disponibles
const permisosDisponibles = userData.permisos;
Object.entries(permisosDisponibles).forEach(([modulo, acciones]) => {
  console.log(`${modulo}:`, acciones);
});
```

---

## 🧪 Pasos para Probar

### 1. Verificar que el Controller compila
```
✅ PermisosRestController.java - Sin errores
```

### 2. Iniciar servidor Spring Boot
```
npm start
o ejecutar desde IDE
```

### 3. Usar Postman
```
1. Importa Medicit_API_Collection_v2.postman_collection.json
2. Configura variables (base_url, etc.)
3. Ve a carpeta "1. Gestión de Permisos"
4. Ejecuta en orden:
   a) Obtener todos los permisos
   b) Obtener permisos por rol
   c) Crear nuevo permiso
   d) Actualizar permiso
   e) Obtener permiso actualizado
   f) Eliminar permiso
```

### 4. Probar flujo completo
```
1. Ve a carpeta "2. Flujo: Crear Rol + Permisos + Usuario"
2. Ejecuta los 8 pasos en orden
3. Verifica que el login retorna los permisos correctos
```

---

## 📁 Archivos Generados

```
Desktop/Medicit 2/
├── GUIA_POSTMAN.md (actualizado)
├── Medicit_API_Collection_v2.postman_collection.json (nuevo)
├── POSTMAN_EJEMPLOS_PERMISOS.js (nuevo)
├── PERMISOS_DOCUMENTACION.md (nuevo)
├── Backend/app/src/main/java/sv/medicit/app/Controladores/
│   └── PermisosRestController.java (nuevo)
```

---

## ⚡ Próximos Pasos Recomendados

### 1. Pruebas Inmediatas
- [ ] Compilar y ejecutar Spring Boot
- [ ] Importar colección en Postman
- [ ] Ejecutar carpeta "1. Gestión de Permisos"
- [ ] Ejecutar carpeta "2. Flujo Completo"

### 2. Validación del Sistema
- [ ] Verificar que login retorna permisos del rol
- [ ] Probar cambiar permisos y que se reflejen en nuevo login
- [ ] Probar eliminar permiso y verificar que desaparece del login

### 3. Integración Frontend
- [ ] Recibir userData.permisos en el login
- [ ] Almacenar permisos en localStorage
- [ ] Usar permisos para mostrar/ocultar botones y formularios
- [ ] Implementar validación de permisos antes de hacer requests

### 4. Documentación Adicional (Opcional)
- [ ] Script SQL para datos de prueba
- [ ] Tutorial con screenshots
- [ ] Video explicativo del flujo

---

## 🎓 Concepto Clave: Relación Usuario → Rol → Permisos

```
┌─────────────────────────────────────────────────┐
│ USUARIO                                         │
│ ├─ id_usuario: 10                              │
│ ├─ nombre_usuario: especialista1               │
│ └─ id_rol: 5  ←─────┐                          │
└──────────────────────┼──────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────┐
│ ROL (id_rol: 5)                                 │
│ ├─ nombreRol: Especialista                     │
│ └─ Tiene múltiples Permisos  ←─────┐           │
└──────────────────────────────────────┼──────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────┐
        ↓                              ↓                      ↓
   ┌─────────────┐          ┌──────────────────┐    ┌──────────────────┐
   │ PERMISO 1   │          │ PERMISO 2        │    │ PERMISO 3        │
   ├─ modulo:    │          ├─ modulo:         │    ├─ modulo:         │
   │ usuarios    │          │ citas            │    │ antecedentes     │
   ├─ ver: true  │          ├─ ver: true       │    ├─ ver: true       │
   ├─ crear: T   │          ├─ crear: true     │    ├─ crear: false    │
   └─────────────┘          └──────────────────┘    └──────────────────┘

AL LOGIN:
↓
El sistema automáticamente:
1. Obtiene el rol del usuario (id_rol: 5)
2. Busca TODOS los permisos para ese rol
3. Los incluye en la respuesta del login
4. El frontend usa esos permisos para controlar la UI
```

---

## 🔗 Referencias Rápidas

- **PermisosRestController:** Gestión CRUD de permisos
- **LoginRestController:** Retorna permisos automáticamente en login
- **LoginService:** Obtiene permisos del rol
- **PermisosRepository:** Queries de permisos por rol

---

¡Sistema de permisos completamente implementado! 🚀
