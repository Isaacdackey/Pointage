package sn.pointage.backend.site.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "geo_sites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeoSite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SiteCategory category;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Builder.Default
    @Column(nullable = false)
    private Integer radiusMeters = 20; // 15 à 20 mètres comme spécifié dans les audios

    @Builder.Default
    @Column(nullable = false)
    private Integer minStopDurationMinutes = 2; // > 2 min pour confirmer l'arrêt réel

    private String contactName;

    private String contactPhone;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
