package sn.pointage.backend.site.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "site_visit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteVisitLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private GeoSite site;

    @Column(nullable = false)
    private String siteName;

    @Column(nullable = false)
    private String vehicleId;

    @Column(nullable = false)
    private String vehicleReg;

    private String driverName;

    @Column(nullable = false)
    private LocalDateTime enteredAt;

    private LocalDateTime exitedAt;

    @Builder.Default
    private Integer durationMinutes = 0;

    @Builder.Default
    private boolean wasStopConfirmed = false;

    private String missionId;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
