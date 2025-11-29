package sv.medicit.app.Utilidades;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import sv.medicit.app.Entidades.Usuarios;
import sv.medicit.app.Servicios.PermisosService;

/**
 * Componente para verificar permisos en controladores.
 * Proporciona métodos de utilidad para validar acceso.
 */
@Component
public class VerificadorPermisos {

    @Autowired
    private PermisosService permisosService;

    /**
     * Verifica si un usuario tiene acceso a un módulo.
     * Lanza excepción si no tiene acceso.
     * 
     * @param usuario Usuario a verificar
     * @param idModulo ID del módulo
     * @throws AccesoDenegadoException Si no tiene acceso
     */
    public void verificarAccesoAlModulo(Usuarios usuario, Integer idModulo) {
        if (!permisosService.tieneAccesoAlModulo(usuario, idModulo)) {
            throw new AccesoDenegadoException(
                "El usuario no tiene acceso al módulo solicitado"
            );
        }
    }

    /**
     * Verifica si un usuario tiene un permiso específico.
     * Lanza excepción si no tiene el permiso.
     * 
     * @param usuario Usuario a verificar
     * @param idModulo ID del módulo
     * @param nombrePermiso Nombre del permiso (Ver, Crear, Editar, Eliminar)
     * @throws AccesoDenegadoException Si no tiene el permiso
     */
    public void verificarPermiso(Usuarios usuario, Integer idModulo, String nombrePermiso) {
        if (!permisosService.tienePermiso(usuario, idModulo, nombrePermiso)) {
            throw new AccesoDenegadoException(
                "El usuario no tiene permiso para " + nombrePermiso + " en este módulo"
            );
        }
    }

    /**
     * Excepción personalizada para cuando se deniega acceso.
     */
    public static class AccesoDenegadoException extends RuntimeException {
        public AccesoDenegadoException(String mensaje) {
            super(mensaje);
        }
    }
}
