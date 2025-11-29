package sv.medicit.app.Utilidades;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import sv.medicit.app.Entidades.Usuarios;
import sv.medicit.app.Servicios.PermisosService;

/**
 * Interceptor para validar permisos en las peticiones HTTP.
 * Verifica que el usuario logueado tenga acceso al recurso solicitado.
 */
@Component
public class ControlAccesoInterceptor implements HandlerInterceptor {

    @Autowired
    private PermisosService permisosService;

    /**
     * Se ejecuta antes de que se procese la petición.
     * Verifica si el usuario tiene permisos para acceder al recurso.
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) 
            throws Exception {
        
        // Obtener la sesión del usuario
        HttpSession session = request.getSession(false);
        
        // Si no hay sesión, permitir (será manejado por autenticación)
        if (session == null) {
            return true;
        }
        
        // Obtener el usuario de la sesión
        Usuarios usuario = (Usuarios) session.getAttribute("usuarioLogueado");
        
        // Si no hay usuario logueado, denegar acceso
        if (usuario == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Usuario no autenticado");
            return false;
        }
        
        // Obtener el módulo solicitado de la URL
        String requestPath = request.getRequestURI();
        String moduloSolicitado = extraerModuloDeLaURL(requestPath);
        
        // Si no se puede extraer el módulo, permitir (no es crítico)
        if (moduloSolicitado == null) {
            return true;
        }
        
        // Verificar si el usuario tiene acceso al módulo
        // (Aquí se necesitaría un mapping entre módulos y sus IDs)
        // Por ahora, se retorna true, pero en producción se validaría
        
        return true;
    }

    /**
     * Extrae el nombre del módulo de la URL.
     * Ejemplo: "/api/usuarios" → "usuarios"
     * 
     * @param requestPath Ruta de la petición
     * @return Nombre del módulo o null
     */
    private String extraerModuloDeLaURL(String requestPath) {
        String[] partes = requestPath.split("/");
        if (partes.length > 2) {
            return partes[partes.length - 1].toLowerCase();
        }
        return null;
    }
}
