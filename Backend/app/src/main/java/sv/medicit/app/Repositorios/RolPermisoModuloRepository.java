package sv.medicit.app.Repositorios;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sv.medicit.app.Entidades.RolPermisoModulo;

/**
 * Repositorio para la entidad RolPermisoModulo.
 * Proporciona métodos para consultar permisos de roles en módulos.
 */
@Repository
public interface RolPermisoModuloRepository extends JpaRepository<RolPermisoModulo, Integer> {

    /**
     * Encuentra todos los permisos de un rol para un módulo específico.
     * 
     * @param idRol ID del rol
     * @param idModulo ID del módulo
     * @return Lista de permisos
     */
    List<RolPermisoModulo> findByRol_IdRolAndModulo_IdModulo(Integer idRol, Integer idModulo);

    /**
     * Encuentra un permiso específico de un rol para un módulo.
     * 
     * @param idRol ID del rol
     * @param idModulo ID del módulo
     * @param nombrePermiso Nombre del permiso
     * @return Lista de permisos que coincidan
     */
    List<RolPermisoModulo> findByRol_IdRolAndModulo_IdModuloAndPermiso_Estado(
        Integer idRol, 
        Integer idModulo, 
        String nombrePermiso
    );

    /**
     * Obtiene todos los módulos a los que un rol tiene acceso.
     * 
     * @param idRol ID del rol
     * @return Lista de IDs de módulos
     */
    @Query("SELECT DISTINCT rpm.modulo.idModulo FROM RolPermisoModulo rpm WHERE rpm.rol.idRol = :idRol")
    List<Integer> findModulosIdByRol(@Param("idRol") Integer idRol);

    /**
     * Encuentra todos los permisos de un rol.
     * 
     * @param idRol ID del rol
     * @return Lista de permisos
     */
    List<RolPermisoModulo> findByRol_IdRol(Integer idRol);
}
