package sv.medicit.app.Controladores;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.medicit.app.Entidades.RolPermisoModulo;
import sv.medicit.app.Entidades.Usuarios;
import sv.medicit.app.Servicios.PermisosService;
import sv.medicit.app.Servicios.UsuariosService;
import sv.medicit.app.Utilidades.VerificadorPermisos;
import sv.medicit.app.Utilidades.VerificadorPermisos.AccesoDenegadoException;

/**
 * Controlador REST para gestionar permisos y control de acceso.
 */
@RestController
@RequestMapping("/api/permisos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PermisosRestController {

    @Autowired
    private PermisosService permisosService;

    @Autowired
    private UsuariosService usuariosService;

    @Autowired
    private VerificadorPermisos verificadorPermisos;

    /**
     * Obtiene todos los permisos de un rol específico.
     * 
     * @param idRol ID del rol
     * @return Lista de permisos del rol
     */
    @GetMapping("/rol/{idRol}")
    public ResponseEntity<?> obtenerPermisosDelRol(@PathVariable Integer idRol) {
        try {
            List<RolPermisoModulo> permisos = permisosService.obtenerPermisosDelRol(idRol);
            return ResponseEntity.ok(permisos);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Obtiene los permisos de un rol en un módulo específico.
     * 
     * @param idRol ID del rol
     * @param idModulo ID del módulo
     * @return Lista de permisos
     */
    @GetMapping("/rol/{idRol}/modulo/{idModulo}")
    public ResponseEntity<?> obtenerPermisosDelRolEnModulo(
            @PathVariable Integer idRol,
            @PathVariable Integer idModulo) {
        try {
            List<RolPermisoModulo> permisos = permisosService.obtenerPermisosDelRolEnModulo(idRol, idModulo);
            return ResponseEntity.ok(permisos);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Verifica si un usuario tiene acceso a un módulo.
     * 
     * @param idUsuario ID del usuario
     * @param idModulo ID del módulo
     * @return true/false
     */
    @GetMapping("/usuario/{idUsuario}/modulo/{idModulo}/acceso")
    public ResponseEntity<?> verificarAccesoAlModulo(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idModulo) {
        try {
            Optional<Usuarios> usuarioOpt = usuariosService.obtenerPorId(idUsuario);
            if (!usuarioOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuario no encontrado");
            }
            
            boolean tieneAcceso = permisosService.tieneAccesoAlModulo(usuarioOpt.get(), idModulo);
            return ResponseEntity.ok(tieneAcceso);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Verifica si un usuario tiene un permiso específico.
     * 
     * @param idUsuario ID del usuario
     * @param idModulo ID del módulo
     * @param nombrePermiso Nombre del permiso
     * @return true/false
     */
    @GetMapping("/usuario/{idUsuario}/modulo/{idModulo}/permiso/{nombrePermiso}")
    public ResponseEntity<?> verificarPermiso(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idModulo,
            @PathVariable String nombrePermiso) {
        try {
            Optional<Usuarios> usuarioOpt = usuariosService.obtenerPorId(idUsuario);
            if (!usuarioOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuario no encontrado");
            }
            
            boolean tienePermiso = permisosService.tienePermiso(usuarioOpt.get(), idModulo, nombrePermiso);
            return ResponseEntity.ok(tienePermiso);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Obtiene todos los módulos a los que un rol tiene acceso.
     * 
     * @param idRol ID del rol
     * @return Lista de IDs de módulos
     */
    @GetMapping("/rol/{idRol}/modulos-accesibles")
    public ResponseEntity<?> obtenerModulosAccesibles(@PathVariable Integer idRol) {
        try {
            List<Integer> modulos = permisosService.obtenerModulosAccesiblesDelRol(idRol);
            return ResponseEntity.ok(modulos);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Asigna un permiso a un rol para un módulo.
     * 
     * @param rolPermisoModulo Objeto con la asignación
     * @return El objeto creado
     */
    @PostMapping("/asignar")
    public ResponseEntity<?> asignarPermiso(@RequestBody RolPermisoModulo rolPermisoModulo) {
        try {
            RolPermisoModulo creado = permisosService.asignarPermiso(rolPermisoModulo);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Elimina un permiso asignado.
     * 
     * @param idRolPermisoModulo ID del permiso a eliminar
     * @return Mensaje de confirmación
     */
    @DeleteMapping("/{idRolPermisoModulo}")
    public ResponseEntity<?> eliminarPermiso(@PathVariable Integer idRolPermisoModulo) {
        try {
            permisosService.eliminarPermiso(idRolPermisoModulo);
            return ResponseEntity.ok("Permiso eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
