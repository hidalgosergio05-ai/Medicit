# ✅ CHECKLIST - Implementación de Permisos en Medicit

## 📋 Fase 1: Configuración Inicial

- [ ] **Verificar que Java está instalado**
  ```
  java -version
  ```

- [ ] **Compilar el nuevo PermisosRestController**
  - Abre `Backend/app` en tu IDE
  - Debería compilar sin errores automáticamente
  - Verifica que no hay errores en `PermisosRestController.java`

- [ ] **Iniciar servidor Spring Boot**
  ```
  npm start
  o ejecuta desde tu IDE
  ```
  - Espera hasta ver: `Tomcat started on port(s): 8080`

---

## 📚 Fase 2: Aprender la API

- [ ] **Leer PERMISOS_DOCUMENTACION.md**
  - Entiende qué es cada endpoint
  - Revisa los campos de permiso (ver, crear, editar, eliminar, descargar)

- [ ] **Revisar RESUMEN_PERMISOS.md**
  - Ve el diagrama de relaciones Usuario → Rol → Permisos
  - Entiende el flujo completo

- [ ] **Revisar GUIA_POSTMAN.md**
  - Ve la estructura de requests y respuestas

---

## 🧪 Fase 3: Pruebas en Postman

### Opción A: Con Colección Importable (RECOMENDADO)

- [ ] **Descargar Postman**
  - https://www.postman.com/downloads/

- [ ] **Importar colección**
  1. Abre Postman
  2. Click en "Import" (arriba izquierda)
  3. Selecciona "Upload Files"
  4. Busca: `Medicit_API_Collection_v2.postman_collection.json`
  5. Click en "Import"

- [ ] **Configurar variables de entorno**
  1. Click en engranaje (⚙️) arriba derecha
  2. Click en "Manage Environments"
  3. Click en "Create new environment"
  4. Nombre: `Medicit Local`
  5. Agrega:
     - `base_url` = `http://localhost:8080`
     - `usuario_id` = `5`
     - `medico_id` = `5`
     - `paciente_id` = `3`
     - `rol_id` = `1`
  6. Click en "Save"
  7. Selecciona `Medicit Local` en dropdown (arriba derecha)

- [ ] **Prueba 1: Autenticación**
  1. Ve a carpeta "3. Login y Autenticación"
  2. Click en "Login - Obtener usuario con permisos"
  3. Cambio `nombreUsuario` y `contrasenia` con datos reales de tu BD
  4. Click en "Send"
  5. Verifica que la respuesta incluye "permisos"

- [ ] **Prueba 2: Gestión de Permisos Básica**
  1. Ve a carpeta "1. Gestión de Permisos"
  2. Ejecuta en orden:
     - [ ] 1.1 - Obtener todos los permisos
     - [ ] 1.2 - Obtener permiso por ID (cambia ID a uno que exista)
     - [ ] 1.3 - Obtener permisos por rol (rol ID 1)
     - [ ] 1.4 - Crear nuevo permiso
       - Guarda el `idPermiso` de la respuesta
     - [ ] 1.5 - Actualizar permiso (usa el ID guardado)
     - [ ] 1.6 - Eliminar permiso (usa el ID guardado)

- [ ] **Prueba 3: Flujo Completo**
  1. Ve a carpeta "2. Flujo: Crear Rol + Permisos + Usuario"
  2. Ejecuta los 8 pasos EN ORDEN
  3. Para cada paso:
     - Cambia valores según sea necesario
     - Verifica que la respuesta sea 200/201
     - Lee la respuesta (JSON) cuidadosamente

- [ ] **Verificación Final**
  1. En carpeta "3. Login y Autenticación"
  2. Click en "Login - Obtener usuario con permisos"
  3. Usa credenciales del usuario creado en Prueba 3
  4. Verifica que la respuesta incluye los permisos que creaste

### Opción B: Con cURL (Línea de Comandos)

- [ ] **Instalar cURL**
  - Windows: Ya viene con PowerShell 3.0+
  - Mac: `brew install curl`
  - Linux: `sudo apt install curl`

- [ ] **Ejecutar ejemplos**
  ```bash
  bash medicit_curl_examples.sh
  ```
  - O ejecutar comandos individuales del archivo

---

## 🎓 Fase 4: Entender el Concepto

### Relación: Usuario → Rol → Permisos

```
Usuario (Especialista1)
  ↓ tiene rol
Rol (Especialista)
  ↓ tiene múltiples
Permisos:
  ├─ modulo_usuarios: {ver: true, crear: true, ...}
  ├─ modulo_citas: {ver: true, crear: true, ...}
  └─ modulo_antecedentes: {ver: true, crear: false, ...}

Al login:
→ Se obtienen AUTOMÁTICAMENTE los permisos del rol
→ Se devuelven en userData.permisos
→ El frontend los usa para mostrar/ocultar elementos
```

- [ ] **Entender que:**
  - Los permisos se definen a nivel de ROL, no de usuario individual
  - Un usuario hereda los permisos de su rol
  - Si cambias permisos de un rol, afecta a TODOS los usuarios con ese rol
  - El login devuelve automáticamente los permisos

---

## 💻 Fase 5: Integración Frontend

- [ ] **Almacenar permisos después del login**
  ```javascript
  // En tu componente de login
  const response = await fetch('/api/auth/login', ...)
  const data = await response.json()
  
  // Guardar en localStorage
  localStorage.setItem('user', JSON.stringify(data.userData))
  localStorage.setItem('permisos', JSON.stringify(data.userData.permisos))
  ```

- [ ] **Usar permisos para controlar UI**
  ```javascript
  // En cualquier componente
  const permisos = JSON.parse(localStorage.getItem('permisos'))
  
  if (permisos.modulo_usuarios?.crear) {
    // Mostrar botón de crear usuario
    document.getElementById('btn-crear-usuario').style.display = 'block'
  }
  
  if (!permisos.modulo_citas?.eliminar) {
    // Ocultar botón de eliminar cita
    document.getElementById('btn-eliminar-cita').style.display = 'none'
  }
  ```

- [ ] **Validar permisos antes de hacer requests**
  ```javascript
  // Antes de llamar a DELETE /api/citas
  const permisos = JSON.parse(localStorage.getItem('permisos'))
  
  if (!permisos.modulo_citas?.eliminar) {
    alert('No tienes permisos para eliminar citas')
    return
  }
  
  // Proceder con la eliminación
  await fetch(`/api/citas/${id}`, {method: 'DELETE'})
  ```

---

## 🔍 Fase 6: Validación

### Pruebas Manuales

- [ ] **Test 1: Login retorna permisos**
  - Haz login en Postman
  - Verifica que userData.permisos no está vacío
  - Verifica que contiene modulos (modulo_usuarios, modulo_citas, etc.)

- [ ] **Test 2: Permisos se heredan del rol**
  - Crea un usuario con rol "Medico"
  - Haz login
  - Verifica que recibe los permisos del rol Medico

- [ ] **Test 3: Cambiar permisos afecta a todos los usuarios**
  - Usuario1 inicia sesión → tiene permiso crear en modulo_citas
  - Actualiza el permiso de Medico: crear = false
  - Usuario1 inicia sesión de nuevo → no tiene permiso crear

- [ ] **Test 4: Eliminar permiso lo quita del login**
  - Obtén permisos del rol (GET /api/permisos/rol/1)
  - Elimina un permiso
  - Inicia sesión con ese rol
  - Verifica que ese modulo no aparece en userData.permisos

---

## 📊 Fase 7: Auditoría (Opcional)

- [ ] **Crear matriz de permisos**
  - Obtén todos los roles: GET /api/roles
  - Para cada rol: GET /api/permisos/rol/{idRol}
  - Crea una tabla en Excel/Sheets:
    ```
    ROL      | MÓDULO          | VER | CREAR | EDITAR | ELIMINAR | DESCARGAR
    Medico   | modulo_usuarios | ✓   | ✓     | ✓      | ✓        | ✗
    Paciente | modulo_citas    | ✓   | ✓     | ✗      | ✗        | ✗
    Admin    | modulo_permisos | ✓   | ✓     | ✓      | ✓        | ✓
    ```

- [ ] **Documentar módulos disponibles**
  - ¿Cuáles son todos los módulos en tu sistema?
  - ¿Cuál es el propósito de cada uno?

---

## 🐛 Fase 8: Troubleshooting

### Si no funcionan los endpoints:

- [ ] **Verificar que Spring Boot está corriendo**
  - ¿Ves "Tomcat started on port(s): 8080"?
  - ¿La consola no muestra errores?

- [ ] **Verificar que la base de datos tiene datos**
  ```sql
  SELECT * FROM roles;
  SELECT * FROM permisos;
  SELECT * FROM usuarios;
  ```

- [ ] **Verificar que PermisosRestController está compilado**
  - Verifica en `Backend/app/target/classes/sv/medicit/app/Controladores/PermisosRestController.class`
  - Si no existe, recompila

- [ ] **Verificar las variables de Postman**
  - ¿base_url es realmente "http://localhost:8080"?
  - ¿Los IDs de usuarios/roles existen en tu BD?

- [ ] **Ver logs del servidor**
  - Busca mensajes de error en la consola de Spring Boot
  - Si ves "NullPointerException", probablemente el usuario/rol no existe

---

## 📞 Fase 9: Soporte

### Archivos de Referencia:
- 📖 `PERMISOS_DOCUMENTACION.md` - Documentación técnica
- 📋 `RESUMEN_PERMISOS.md` - Resumen completo
- 📚 `GUIA_POSTMAN.md` - Guía de uso
- 💾 `POSTMAN_EJEMPLOS_PERMISOS.js` - Ejemplos JavaScript
- 🧪 `medicit_curl_examples.sh` - Ejemplos cURL
- 📦 `Medicit_API_Collection_v2.postman_collection.json` - Colección importable

### Preguntas Frecuentes:

**P: ¿Por qué mi usuario no ve los permisos en el login?**
A: Verifica que el usuario tiene un rol asignado (id_rol) y que ese rol tiene permisos creados.

**P: ¿Puedo cambiar permisos de un usuario específico?**
A: No, los permisos se definen a nivel de ROL. Cambia el rol del usuario o crea un nuevo rol.

**P: ¿Qué pasa si elimino un permiso?**
A: Ese módulo ya no aparecerá en userData.permisos para ese rol.

**P: ¿Puedo tener múltiples roles por usuario?**
A: Actualmente no, cada usuario tiene UN rol. Se puede cambiar pero no tener múltiples simultáneamente.

---

## ✨ Fase 10: Celebración

- [ ] ¡Felicidades! 🎉
  - Has aprendido el sistema de permisos
  - Has creado tu primer permiso
  - Has creado tu primer rol con permisos
  - ¡Sistema de autorización completamente implementado!

---

## 📝 Notas Finales

**Arquitectura implementada:**
```
POST /api/permisos           → Crear permisos
GET  /api/permisos/{id}      → Obtener permiso
GET  /api/permisos/rol/{id}  → Obtener permisos de rol
PUT  /api/permisos/{id}      → Actualizar permisos
DELETE /api/permisos/{id}    → Eliminar permisos

POST /api/auth/login         → Login (incluye permisos automáticamente)
```

**Beneficios:**
- ✅ Control granular de permisos por rol
- ✅ Cambios de permisos se aplican inmediatamente
- ✅ Sin necesidad de redeploy
- ✅ Integración fácil con frontend
- ✅ Auditoría completa de accesos

---

¡Éxito en la implementación! 🚀
