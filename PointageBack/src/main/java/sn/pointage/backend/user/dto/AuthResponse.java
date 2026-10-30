package sn.pointage.backend.user.dto;

import sn.pointage.backend.user.model.Role;

public record AuthResponse(
    String token,
    Long id,
    String email,
    String fullName,
    Role role,
    String location
) {}

