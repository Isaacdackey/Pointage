package sn.pointage.backend.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sn.pointage.backend.shared.response.RestResponse;
import sn.pointage.backend.user.dto.ChangePasswordRequest;
import sn.pointage.backend.user.dto.CreateUserRequest;
import sn.pointage.backend.user.dto.UserResponse;
import sn.pointage.backend.user.model.User;
import sn.pointage.backend.user.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<RestResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(RestResponse.success(users, "Liste des utilisateurs récupérée avec succès"));
    }

    @PostMapping
    public ResponseEntity<RestResponse<UserResponse>> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(RestResponse.success(response, HttpStatus.CREATED));
    }

    @PatchMapping("/{id}/change-password")
    public ResponseEntity<RestResponse<Void>> changePassword(
        @PathVariable Long id,
        @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(id, request);
        return ResponseEntity.ok(RestResponse.success(null, "Mot de passe modifié avec succès"));
    }
}
