package sv.medicit.app.Servicios;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sv.medicit.app.Entidades.RolPermisoModulo;
import sv.medicit.app.Entidades.Roles;
import sv.medicit.app.Entidades.Usuarios;
import sv.medicit.app.Repositorios.RolPermisoModuloRepository;
import sv.medicit.app.Repositorios.RolesRepository;

/**
 * Servicio para gestionar permisos y control de acceso.
 * Verifica qué módulos y acciones puede realizar cada rol.
 */
@Service
public class PermisosService {

    @Autowired
    private RolPermisoModuloRepository rolPermisoModuloRepository;

    @Autowired
    private RolesRepository rolesRepository;

    /**
     * Obtiene todos los permisos asignados a un rol específico.
     * 
     * @param idRol ID del rol
     * @return Lista de permisos del rol
     */
    public List<RolPermisoModulo> obtenerPermisosDelRol(Integer idRol) {
        Optional<Roles> rol = rolesRepository.findById(idRol);
        if (rol.isPresent()) {
            return rol.get().getRolesPermisosModulos();
        }
        throw new RuntimeException("Rol no encontrado con ID: " + idRol);
    }

    /**
     * Obtiene los permisos de un rol para un módulo específico.
     * 
     * @param idRol ID del rol
     * @param idModulo ID del módulo
     * @return Lista de permisos para ese módulo
     */
    public List<RolPermisoModulo> obtenerPermisosDelRolEnModulo(Integer idRol, Integer idModulo) {
        return rolPermisoModuloRepository.findByRol_IdRolAndModulo_IdModulo(idRol, idModulo);
    }

    /**
     * Verifica si un usuario tiene acceso a un módulo específico.
     * 
     * @param usuario Usuario a verificar
     * @param idModulo ID del módulo
     * @return true si tiene acceso, false si no
     */
    public boolean tieneAccesoAlModulo(Usuarios usuario, Integer idModulo) {
        if (usuario == null || usuario.getRol() == null) {
            return false;
        }
        
        List<RolPermisoModulo> permisos = obtenerPermisosDelRolEnModulo(
            usuario.getRol().getIdRol(), 
            idModulo
        );
        
        return !permisos.isEmpty();
    }

    /**
     * Verifica si un usuario tiene un permiso específico en un módulo.
     * 
     * @param usuario Usuario a verificar
     * @param idModulo ID del módulo
     * @param nombrePermiso Nombre del permiso (ej: "Ver", "Crear", "Editar", "Eliminar")
     * @return true si tiene el permiso, false si no
     */
    public boolean tienePermiso(Usuarios usuario, Integer idModulo, String nombrePermiso) {
        if (usuario == null || usuario.getRol() == null) {
            return false;
        }
        
        List<RolPermisoModulo> permisos = rolPermisoModuloRepository
            .findByRol_IdRolAndModulo_IdModuloAndPermiso_Estado(
                usuario.getRol().getIdRol(),
                idModulo,
                nombrePermiso
            );
        
        return !permisos.isEmpty();
    }

    /**
     * Obtiene una lista de módulos a los que un rol tiene acceso.
     * 
     * @param idRol ID del rol
     * @return Lista de IDs de módulos accesibles
     */
    public List<Integer> obtenerModulosAccesiblesDelRol(Integer idRol) {
        return rolPermisoModuloRepository.findModulosIdByRol(idRol);
    }

    /**
     * Asigna un permiso a un rol para un módulo específico.
     * 
     * @param rolPermisoModulo El objeto con la asignación
     * @return El objeto guardado
     */
    public RolPermisoModulo asignarPermiso(RolPermisoModulo rolPermisoModulo) {
        return rolPermisoModuloRepository.save(rolPermisoModulo);
    }

    /**
     * Elimina un permiso asignado a un rol.
     * 
     * @param idRolPermisoModulo ID de la relación
     */
    public void eliminarPermiso(Integer idRolPermisoModulo) {
        if (!rolPermisoModuloRepository.existsById(idRolPermisoModulo)) {
            throw new RuntimeException("Permiso no encontrado con ID: " + idRolPermisoModulo);
        }
        rolPermisoModuloRepository.deleteById(idRolPermisoModulo);
    }
}
