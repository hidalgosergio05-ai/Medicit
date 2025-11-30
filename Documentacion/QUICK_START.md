# ⚡ QUICK START - 5 Minutos

## 🎯 En 5 Minutos tendrás permisos funcionando

### Paso 1: Verificar que Spring Boot está corriendo
```
¿Ves "Tomcat started on port(s): 8080" en la consola?
✅ SÍ → Continúa al Paso 2
❌ NO → Inicia: npm start
```

### Paso 2: Abrir Postman (30 segundos)
```
1. Descargar: https://www.postman.com/downloads/
2. Instalar
3. Abrir
```

### Paso 3: Importar colección (1 minuto)
```
1. Click en "Import" (arriba izquierda)
2. Click en "Upload Files"
3. Selecciona: Medicit_API_Collection_v2.postman_collection.json
4. Click en "Import"
```

### Paso 4: Configurar variables (1 minuto)
```
1. Click en ⚙️ (arriba derecha)
2. Click en "Manage Environments"
3. Click en "Create new environment"
4. Nombre: "Medicit Local"
5. Variables:
   - base_url: http://localhost:8080
   - usuario_id: 5
   - medico_id: 5
   - paciente_id: 3
   - rol_id: 1
6. Click "Save"
7. Selecciona "Medicit Local" en el dropdown
```

### Paso 5: Hacer login (1 minuto)
```
1. Ve a carpeta "3. Login y Autenticación"
2. Click en "Login - Obtener usuario con permisos"
3. Cambia "nombreUsuario" y "contrasenia" con datos reales de tu BD
4. Click en "Send"
5. Verifica que la respuesta incluye "permisos" ✅
```

### Paso 6: Probar permisos (30 segundos)
```
1. Ve a carpeta "1. Gestión de Permisos"
2. Click en "1.1 - Obtener todos los permisos"
3. Click en "Send"
4. Verifica que ves la lista de permisos ✅
```

---

## 📝 Explicación Rápida

### ¿Qué es un Permiso?
Definen qué puede hacer un rol en cada módulo.

**Ejemplo:**
```
Rol: Medico
Módulo: modulo_citas
Permisos: 
  - Ver citas: SÍ
  - Crear citas: SÍ
  - Editar citas: NO
  - Eliminar citas: NO
  - Descargar citas: SÍ
```

### ¿Cómo funciona el Login?
```
1. Usuario hace login
2. Sistema obtiene su rol
3. Sistema busca permisos del rol
4. Sistema devuelve todo junto en userData.permisos
5. Frontend usa permisos para mostrar/ocultar botones
```

### Ejemplo de respuesta del login:
```json
{
  "success": true,
  "userData": {
    "id_usuario": 5,
    "nombre_usuario": "juanperez",
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

## 🧪 Pruebas Rápidas (Orden recomendado)

| # | Endpoint | Qué hace |
|---|----------|----------|
| 1 | GET /api/permisos | Ve todos los permisos |
| 2 | GET /api/permisos/rol/1 | Ve permisos del rol Medico |
| 3 | POST /api/auth/login | Login (con permisos incluidos) |
| 4 | POST /api/permisos | Crea nuevo permiso |
| 5 | PUT /api/permisos/{id} | Modifica un permiso |
| 6 | DELETE /api/permisos/{id} | Elimina un permiso |

---

## 💡 Casos de Uso Comunes

### Caso 1: "¿Qué puede hacer el rol Medico?"
```
GET /api/permisos/rol/1
```

### Caso 2: "¿Qué puede hacer el rol Paciente?"
```
GET /api/permisos/rol/2
```

### Caso 3: "Permitir que Pacientes creen citas"
```
1. GET /api/permisos/rol/2
   → Busca el ID del permiso modulo_citas (supongamos 5)

2. PUT /api/permisos/5
   → Cambia "crear": false a "crear": true

3. Listo ✅
```

### Caso 4: "Crear nuevo rol con permisos"
```
1. POST /api/roles
   → Crea rol "Especialista"

2. POST /api/permisos (x3)
   → Crea permisos para modulo_usuarios
   → Crea permisos para modulo_citas
   → Crea permisos para modulo_antecedentes

3. POST /api/usuarios
   → Asigna idRol: [ID del nuevo rol]

4. Listo ✅
```

---

## 🔥 Próximos 10 Minutos (Opcional)

### Para los que quieren más:

1. **Lee RESUMEN_PERMISOS.md** (5 min)
   - Entiende la arquitectura

2. **Prueba el flujo completo** (5 min)
   - Ve a "2. Flujo: Crear Rol + Permisos + Usuario"
   - Ejecuta los 8 pasos

---

## ⚠️ Errores Comunes

### ❌ "No veo permisos en el login"
**Solución:**
```
1. Verifica que el usuario tiene id_rol asignado
2. Verifica que ese rol tiene permisos creados
   GET /api/permisos/rol/[el_rol_del_usuario]
3. Si está vacío, crea permisos:
   POST /api/permisos
```

### ❌ "401 Unauthorized en login"
**Solución:**
```
1. Verifica que el usuario existe
2. Verifica que la contraseña es correcta
3. Verifica que el usuario tiene una contraseña en la BD
```

### ❌ "404 Not Found"
**Solución:**
```
1. Verifica que el ID existe
   GET /api/permisos/[el_id]
2. Si no aparece, el ID es incorrecto
```

### ❌ "500 Server Error"
**Solución:**
```
1. Revisa la consola de Spring Boot
2. Probablemente faltan datos en la BD
3. Verifica que el rol existe:
   GET /api/roles
```

---

## 🎯 Tu Siguiente Objetivo

**Después de esto, necesitas:**

1. **Integrar permisos en frontend**
   - Guardar userData.permisos en localStorage
   - Usar para mostrar/ocultar botones

2. **Validar permisos antes de requests**
   - Verificar que el usuario tiene permiso antes de hacer DELETE
   - Mostrar alerta si no tiene permiso

---

## 📚 Si necesitas más detalles

| Quiero... | Abre... |
|-----------|---------|
| Un paso a paso completo | CHECKLIST_IMPLEMENTACION.md |
| Documentación técnica | PERMISOS_DOCUMENTACION.md |
| Más ejemplos | POSTMAN_EJEMPLOS_PERMISOS.js |
| Ejemplos con cURL | medicit_curl_examples.sh |
| Visión general | RESUMEN_PERMISOS.md |

---

## ✅ Checklist de los Primeros 5 Minutos

- [ ] Spring Boot corriendo (puerto 8080)
- [ ] Postman instalado
- [ ] Colección importada
- [ ] Variables configuradas
- [ ] Login exitoso con permisos
- [ ] Obtener todos los permisos exitoso

**Si está todo ✅ → ¡Felicidades! Ya tienes permisos funcionando** 🎉

---

¿Listo? ¡Comienza ya! ⚡

Siguiente: Abre Postman → Click en "Import" → Busca el archivo .json

🚀 Go!
