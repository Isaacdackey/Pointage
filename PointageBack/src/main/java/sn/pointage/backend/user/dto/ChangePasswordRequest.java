package sn.pointage.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
    @NotBlank(message = "Le mot de passe actuel est obligatoire")
    String currentPassword,

    @NotBlank(message = "Le nouveau mot de passe est obligatoire")
    @Size(min = 6, message = "Le nouveau mot de passe doit comporter au moins 6 caractères")
    String newPassword,

    @NotBlank(message = "La confirmation du mot de passe est obligatoire")
    String confirmPassword
) {}
