package sn.pointage.backend.fleet.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.Instant;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = false)
    private String make;

    @Column(nullable = false)
    private String model;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status = VehicleStatus.DISPONIBLE;

    private String currentTrackerId;

    private Long assignedDriverId;

    private String assignedDriverName;

    private String assignedDriverPhone;

    @Column(nullable = false)
    private Integer odometerKm = 0;

    // Conformité & Documents
    private LocalDate technicalInspectionExpiry;

    private LocalDate insuranceExpiry;

    private String registrationCardNumber;

    // Télématique & Commande boîtier
    private Boolean canCutEngineRemotely = false;

    // Dernière position GPS connue
    private Double lastLatitude;

    private Double lastLongitude;

    private Double lastSpeedKph;

    private Integer lastHeading;

    private Boolean lastIgnition;

    private Instant lastGpsTime;

    private Instant createdAt = Instant.now();

    public Vehicle() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public VehicleType getType() {
        return type;
    }

    public void setType(VehicleType type) {
        this.type = type;
    }

    public VehicleStatus getStatus() {
        return status;
    }

    public void setStatus(VehicleStatus status) {
        this.status = status;
    }

    public String getCurrentTrackerId() {
        return currentTrackerId;
    }

    public void setCurrentTrackerId(String currentTrackerId) {
        this.currentTrackerId = currentTrackerId;
    }

    public Long getAssignedDriverId() {
        return assignedDriverId;
    }

    public void setAssignedDriverId(Long assignedDriverId) {
        this.assignedDriverId = assignedDriverId;
    }

    public String getAssignedDriverName() {
        return assignedDriverName;
    }

    public void setAssignedDriverName(String assignedDriverName) {
        this.assignedDriverName = assignedDriverName;
    }

    public String getAssignedDriverPhone() {
        return assignedDriverPhone;
    }

    public void setAssignedDriverPhone(String assignedDriverPhone) {
        this.assignedDriverPhone = assignedDriverPhone;
    }

    public Integer getOdometerKm() {
        return odometerKm;
    }

    public void setOdometerKm(Integer odometerKm) {
        this.odometerKm = odometerKm;
    }

    public LocalDate getTechnicalInspectionExpiry() {
        return technicalInspectionExpiry;
    }

    public void setTechnicalInspectionExpiry(LocalDate technicalInspectionExpiry) {
        this.technicalInspectionExpiry = technicalInspectionExpiry;
    }

    public LocalDate getInsuranceExpiry() {
        return insuranceExpiry;
    }

    public void setInsuranceExpiry(LocalDate insuranceExpiry) {
        this.insuranceExpiry = insuranceExpiry;
    }

    public String getRegistrationCardNumber() {
        return registrationCardNumber;
    }

    public void setRegistrationCardNumber(String registrationCardNumber) {
        this.registrationCardNumber = registrationCardNumber;
    }

    public Boolean getCanCutEngineRemotely() {
        return canCutEngineRemotely;
    }

    public void setCanCutEngineRemotely(Boolean canCutEngineRemotely) {
        this.canCutEngineRemotely = canCutEngineRemotely;
    }

    public Double getLastLatitude() {
        return lastLatitude;
    }

    public void setLastLatitude(Double lastLatitude) {
        this.lastLatitude = lastLatitude;
    }

    public Double getLastLongitude() {
        return lastLongitude;
    }

    public void setLastLongitude(Double lastLongitude) {
        this.lastLongitude = lastLongitude;
    }

    public Double getLastSpeedKph() {
        return lastSpeedKph;
    }

    public void setLastSpeedKph(Double lastSpeedKph) {
        this.lastSpeedKph = lastSpeedKph;
    }

    public Integer getLastHeading() {
        return lastHeading;
    }

    public void setLastHeading(Integer lastHeading) {
        this.lastHeading = lastHeading;
    }

    public Boolean getLastIgnition() {
        return lastIgnition;
    }

    public void setLastIgnition(Boolean lastIgnition) {
        this.lastIgnition = lastIgnition;
    }

    public Instant getLastGpsTime() {
        return lastGpsTime;
    }

    public void setLastGpsTime(Instant lastGpsTime) {
        this.lastGpsTime = lastGpsTime;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
