package sn.pointage.backend.mission.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "missions")
public class Mission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // ex: MIS-2026-088

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MissionStatus status = MissionStatus.PLANIFIEE;

    @Column(nullable = false)
    private Long vehicleId;

    @Column(nullable = false)
    private String vehicleReg;

    @Column(nullable = false)
    private Long driverId;

    @Column(nullable = false)
    private String driverName;

    @Column(nullable = false)
    private String originName;

    @Column(nullable = false)
    private String destinationName;

    private Long originSiteId;

    private Long destinationSiteId;

    @Column(nullable = false)
    private Instant plannedStartTime;

    @Column(nullable = false)
    private Instant plannedEndTime;

    private Instant actualStartTime;

    private Instant actualEndTime;

    private Double distanceKm = 0.0;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Détection passive télématique (Audios Mentor 1, 2, 3)
    private Boolean gpsDepartureDetected = false;

    private Boolean gpsArrivalDetected = false;

    private Boolean hasDeviation = false;

    private String deviationDetails;

    private Integer delayMinutes = 0;

    private Boolean isDelayed = false;

    private Integer currentProgressPercent = 0;

    private String lastCheckpointPassed;

    private Instant createdAt = Instant.now();

    public Mission() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public MissionStatus getStatus() {
        return status;
    }

    public void setStatus(MissionStatus status) {
        this.status = status;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getVehicleReg() {
        return vehicleReg;
    }

    public void setVehicleReg(String vehicleReg) {
        this.vehicleReg = vehicleReg;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getOriginName() {
        return originName;
    }

    public void setOriginName(String originName) {
        this.originName = originName;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public Long getOriginSiteId() {
        return originSiteId;
    }

    public void setOriginSiteId(Long originSiteId) {
        this.originSiteId = originSiteId;
    }

    public Long getDestinationSiteId() {
        return destinationSiteId;
    }

    public void setDestinationSiteId(Long destinationSiteId) {
        this.destinationSiteId = destinationSiteId;
    }

    public Instant getPlannedStartTime() {
        return plannedStartTime;
    }

    public void setPlannedStartTime(Instant plannedStartTime) {
        this.plannedStartTime = plannedStartTime;
    }

    public Instant getPlannedEndTime() {
        return plannedEndTime;
    }

    public void setPlannedEndTime(Instant plannedEndTime) {
        this.plannedEndTime = plannedEndTime;
    }

    public Instant getActualStartTime() {
        return actualStartTime;
    }

    public void setActualStartTime(Instant actualStartTime) {
        this.actualStartTime = actualStartTime;
    }

    public Instant getActualEndTime() {
        return actualEndTime;
    }

    public void setActualEndTime(Instant actualEndTime) {
        this.actualEndTime = actualEndTime;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Boolean getGpsDepartureDetected() {
        return gpsDepartureDetected;
    }

    public void setGpsDepartureDetected(Boolean gpsDepartureDetected) {
        this.gpsDepartureDetected = gpsDepartureDetected;
    }

    public Boolean getGpsArrivalDetected() {
        return gpsArrivalDetected;
    }

    public void setGpsArrivalDetected(Boolean gpsArrivalDetected) {
        this.gpsArrivalDetected = gpsArrivalDetected;
    }

    public Boolean getHasDeviation() {
        return hasDeviation;
    }

    public void setHasDeviation(Boolean hasDeviation) {
        this.hasDeviation = hasDeviation;
    }

    public String getDeviationDetails() {
        return deviationDetails;
    }

    public void setDeviationDetails(String deviationDetails) {
        this.deviationDetails = deviationDetails;
    }

    public Integer getDelayMinutes() {
        return delayMinutes;
    }

    public void setDelayMinutes(Integer delayMinutes) {
        this.delayMinutes = delayMinutes;
    }

    public Boolean getIsDelayed() {
        return isDelayed;
    }

    public void setIsDelayed(Boolean isDelayed) {
        this.isDelayed = isDelayed;
    }

    public Integer getCurrentProgressPercent() {
        return currentProgressPercent;
    }

    public void setCurrentProgressPercent(Integer currentProgressPercent) {
        this.currentProgressPercent = currentProgressPercent;
    }

    public String getLastCheckpointPassed() {
        return lastCheckpointPassed;
    }

    public void setLastCheckpointPassed(String lastCheckpointPassed) {
        this.lastCheckpointPassed = lastCheckpointPassed;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
