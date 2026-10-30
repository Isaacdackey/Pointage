package sn.pointage.backend.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.pointage.backend.shared.exception.EntityExistException;
import sn.pointage.backend.shared.exception.EntityNotFoundException;
import sn.pointage.backend.user.dto.AuthResponse;
import sn.pointage.backend.user.dto.ChangePasswordRequest;
import sn.pointage.backend.user.dto.CreateUserRequest;
import sn.pointage.backend.user.dto.LoginRequest;
import sn.pointage.backend.user.dto.UserResponse;
import sn.pointage.backend.user.model.Role;
import sn.pointage.backend.user.model.User;
import sn.pointage.backend.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
            .map(UserResponse::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable"));
        return UserResponse.fromEntity(user);
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email().toLowerCase())) {
            throw new EntityExistException("Un compte avec cette adresse email existe déjà");
        }

        User user = User.builder()
            .fullName(request.fullName().trim())
            .email(request.email().trim().toLowerCase())
            .password(passwordEncoder.encode(request.password()))
            .role(request.role() != null ? request.role() : Role.USER)
            .phone(request.phone() != null ? request.phone().trim() : null)
            .location(request.location() != null ? request.location().trim() : "Exploitation")
            .active(true)
            .build();

        return UserResponse.fromEntity(userRepository.save(user));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
            .orElseThrow(() -> new IllegalArgumentException("Identifiants incorrects (email ou mot de passe)"));

        if (!user.isActive()) {
            throw new IllegalStateException("Ce compte utilisateur a été désactivé par un administrateur");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Identifiants incorrects (email ou mot de passe)");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Token de session sécurisé
        String sessionToken = "geofleet_" + UUID.randomUUID().toString();

        return new AuthResponse(
            sessionToken,
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            user.getRole(),
            user.getLocation()
        );
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Le mot de passe actuel est incorrect");
        }

        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new IllegalArgumentException("La confirmation ne correspond pas au nouveau mot de passe");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
