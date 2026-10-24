package sn.pointage.backend.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import sn.pointage.backend.user.model.Role;

public record CreateUserRequest(
    @NotBlank(message = "Le nom complet est obligatoire")
    String fullName,

    @NotBlank(message = "L'adresse email est obligatoire")
    @Email(message = "Format d'email invalide")
    String email,

    @NotNull(message = "Le rôle est obligatoire")
    Role role,

    String phone,
    String location,

    @NotBlank(message = "Le mot de passe temporaire est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    String password
) {}
