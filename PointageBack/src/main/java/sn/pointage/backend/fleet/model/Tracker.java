package sn.pointage.backend.fleet.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "trackers")
public class Tracker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String identifier; // ex: TRK-001, IMEI

    @Column(nullable = false)
    private String vendor; // Teltonika, Coban, Concox

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String protocol = "TCP/GT06";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrackerStatus status = TrackerStatus.ACTIF;

    private Integer batteryPercent = 100;

    private Instant lastSeenAt;

    private Long vehicleId;

    public Tracker() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getVendor() {
        return vendor;
    }

    public void setVendor(String vendor) {
        this.vendor = vendor;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public TrackerStatus getStatus() {
        return status;
    }

    public void setStatus(TrackerStatus status) {
        this.status = status;
    }

    public Integer getBatteryPercent() {
        return batteryPercent;
    }

    public void setBatteryPercent(Integer batteryPercent) {
        this.batteryPercent = batteryPercent;
    }

    public Instant getLastSeenAt() {
        return lastSeenAt;
    }

    public void setLastSeenAt(Instant lastSeenAt) {
        this.lastSeenAt = lastSeenAt;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }
}
