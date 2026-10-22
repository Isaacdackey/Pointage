package sn.pointage.backend.shared.exception;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String message) {
        super(message);
    }

    public EntityNotFoundException(String entityName, Object id) {
        super(String.format("%s introuvable avec l'identifiant : %s", entityName, id));
    }
}
