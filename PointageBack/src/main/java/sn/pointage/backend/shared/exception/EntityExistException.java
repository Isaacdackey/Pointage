package sn.pointage.backend.shared.exception;

public class EntityExistException extends RuntimeException {
    public EntityExistException(String message) {
        super(message);
    }
}
