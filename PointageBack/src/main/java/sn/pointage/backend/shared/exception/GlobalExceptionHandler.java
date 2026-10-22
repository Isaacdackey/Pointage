package sn.pointage.backend.shared.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import sn.pointage.backend.shared.response.RestResponse;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<RestResponse<Void>> handleEntityNotFound(EntityNotFoundException ex) {
        log.debug("EntityNotFoundException : {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(RestResponse.error(ex.getMessage(), HttpStatus.NOT_FOUND));
    }

    
    @ExceptionHandler(EntityExistException.class)
    public ResponseEntity<RestResponse<Void>> handleEntityExist(EntityExistException ex) {
        log.debug("EntityExistException : {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(RestResponse.error(ex.getMessage(), HttpStatus.CONFLICT));
    }

   
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<RestResponse<Void>> handleIllegalState(IllegalStateException ex) {
        log.warn("IllegalStateException : {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.UNPROCESSABLE_ENTITY)
            .body(RestResponse.error(ex.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY));
    }

   
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<RestResponse<Void>> handleIllegalArgument(IllegalArgumentException ex) {
        log.debug("IllegalArgumentException : {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(RestResponse.error("Paramètre invalide : " + ex.getMessage(), HttpStatus.BAD_REQUEST));
    }

   
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<RestResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Acces refuse : {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(RestResponse.error("Accès refusé : vous n'avez pas les permissions nécessaires", HttpStatus.FORBIDDEN));
    }

   
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<RestResponse<Void>> handleAuthentication(AuthenticationException ex) {
        log.debug("AuthenticationException : {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(RestResponse.error("Authentification requise", HttpStatus.UNAUTHORIZED));
    }

   
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<RestResponse<Void>> handleUnreadableBody(HttpMessageNotReadableException ex) {
        log.debug("Corps de la requete illisible : {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(RestResponse.error("Corps de la requête invalide ou absent", HttpStatus.BAD_REQUEST));
    }

   
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<RestResponse<Void>> handleMissingParam(MissingServletRequestParameterException ex) {
        log.debug("Parametre manquant : {}", ex.getParameterName());
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(RestResponse.error("Paramètre requis manquant : " + ex.getParameterName(), HttpStatus.BAD_REQUEST));
    }

   
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<RestResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String msg = String.format("Valeur '%s' invalide pour le paramètre '%s'", ex.getValue(), ex.getName());
        log.debug("MethodArgumentTypeMismatchException : {}", msg);
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(RestResponse.error(msg, HttpStatus.BAD_REQUEST));
    }

   
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RestResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(err ->
            errors.put(err.getField(), err.getDefaultMessage())
        );
        log.debug("Validation echouee : {}", errors);
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(RestResponse.badRequest("Erreur de validation des données", errors));
    }

   
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<RestResponse<Void>> handleDataAccess(DataAccessException ex) {
        log.error("DataAccessException (connexion DB perdue) : {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(RestResponse.error("Service temporairement indisponible — veuillez réessayer dans quelques instants", HttpStatus.SERVICE_UNAVAILABLE));
    }

    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<RestResponse<Void>> handleUnexpected(Exception ex) {
        log.error("Erreur interne non geree [{}] : {}", ex.getClass().getSimpleName(), ex.getMessage(), ex);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(RestResponse.error("Une erreur interne est survenue", HttpStatus.INTERNAL_SERVER_ERROR));
    }
}
