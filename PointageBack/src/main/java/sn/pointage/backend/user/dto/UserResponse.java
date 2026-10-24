package sn.pointage.backend.user.dto;

import sn.pointage.backend.user.model.Role;
import sn.pointage.backend.user.model.User;

import java.time.LocalDateTime;

public record UserResponse(
    Long id,
    String fullName,
    String email,
    Role role,
    String roleLabel,
    String phone,
    String location,
    boolean active,
    boolean canDelete,
    LocalDateTime lastLogin,
    LocalDateTime createdAt
) {
    public static UserResponse fromEntity(User user) {
        boolean canDelete = user.getRole() == Role.SUPER_ADMIN;
        String roleLabel = user.getRole() == Role.SUPER_ADMIN 
            ? "Super Administrateur" 
            : "Responsable Flotte & Logistique";

        return new UserResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getRole(),
            roleLabel,
            user.getPhone(),
            user.getLocation(),
            user.isActive(),
            canDelete,
            user.getLastLogin(),
            user.getCreatedAt()
        );
    }
}
