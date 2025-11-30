# Actualización de Matriz de Permisos

## Cambios Realizados

### 1. Página de Gestión de Permisos (`permisos/page.tsx`)

**Nuevos módulos agregados:**
- `modulo_dashboard` - Dashboard (editable)
- `modulo_inicio` - Inicio (editable)
- `modulo_usuarios` - Gestión de Usuarios (editable)
- `modulo_citas` - Gestión de Citas (editable)
- `modulo_medico` - Gestión Médica (editable)
- `modulo_administrativo` - Gestión Administrativa (Permisos) **NO EDITABLE**
- `modulo_catalogos` - Catálogos (Roles/Estados/Especialidades) **NO EDITABLE**
- `modulo_configuracion` - Configuración Personal (editable)

**Restricciones implementadas:**
- Los módulos marcados como "NO EDITABLE" aparecen con una etiqueta roja
- Los switches están deshabilitados para módulos no editables
- Se agregó una nota informativa en la interfaz

### 2. Permisos por Rol

#### PACIENTE (idRol = 1)
```
✅ modulo_dashboard:      ver
✅ modulo_inicio:         ver
✅ modulo_citas:          ver, crear, eliminar (puede cancelar citas)
✅ modulo_configuracion:  ver, editar
```

#### MÉDICO (idRol = 2)
```
✅ modulo_dashboard:      ver
✅ modulo_inicio:         ver
✅ modulo_citas:          ver, editar, eliminar (puede aceptar/rechazar y cancelar citas)
✅ modulo_medico:         ver, crear, editar, eliminar, descargar
✅ modulo_configuracion:  ver, editar
```

#### ADMINISTRADOR (idRol = 3)
```
✅ modulo_dashboard:      ver
✅ modulo_inicio:         ver
✅ modulo_usuarios:       ver, crear, editar, eliminar, descargar
✅ modulo_citas:          ver, crear, editar, eliminar, descargar
✅ modulo_medico:         ver, crear, editar, eliminar, descargar
✅ modulo_administrativo: ver, crear, editar, eliminar (gestiona permisos)
✅ modulo_catalogos:      ver, crear, editar, eliminar (gestiona roles, estados, especialidades)
✅ modulo_configuracion:  ver, editar
```

### 3. Cambios en Data Seeds

**DATA_SEEDS.sql:**
- Agregados DELETE statements para limpiar datos viejos antes de insertar
- Admin: permisos para `modulo_administrativo` y `modulo_catalogos` cambiados a `false`

**DATA_SEEDS.json:**
- Actualizada descripción de permisos del médico en citas
- Admin: permisos para módulos críticos documentados como SIN ACCESO

## Implementación Técnica

### En Frontend
```tsx
// MODULOS ahora incluye propiedad editable
const MODULOS = [
  { key: "modulo_...", label: "...", editable: true/false }
]

// En renderizado:
disabled={!modulo.editable || !canEdit("modulo_administrativo")}
```

### En Backend
Los permisos se almacenan en la tabla `permisos`:
- `id_rol`: FK a roles
- `modulo`: STRING (ej: "modulo_administrativo")
- `ver, crear, editar, eliminar, descargar`: BOOLEAN

### En contexto de autenticación
```typescript
canEdit("moduloAdministrativo") // Returns false para Admin
```

## Instrucciones para Aplicar

1. **Ejecutar DATA_SEEDS.sql** para actualizar la BD:
   ```bash
   mysql -u user -p medicit < DATA_SEEDS.sql
   ```

2. **Limpiar localStorage** y cerrar sesión:
   - Abrir DevTools → Application → Storage → LocalStorage
   - Eliminar `medicit_user`

3. **Volver a loguearse** con cualquier usuario para cargar los nuevos permisos

4. **Verificar:**
   - Admin: No puede ver ni editar permisos ni catálogos
   - Médico: Puede cancelar citas (botón visible)
   - Paciente: Puede cancelar sus citas (botón visible)

## Restricciones de Seguridad

El diseño actual **permite al administrador**:
- ✅ Editar permisos por rol y módulo
- ✅ Crear/editar/eliminar roles
- ✅ Crear/editar/eliminar estados
- ✅ Crear/editar/eliminar especialidades
- ✅ Gestionar usuarios completamente
- ✅ Gestionar todas las citas

**Esto es apropiado para un administrador operacional.**
