package ru.networkintelligence.monitor.monitoring.saveMonitorEvents;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "monitor_events")
public class MonitorEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "monitor_id", nullable = false)
    private Long monitorId;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "parameter", nullable = false, length = 50)
    private String parameter;

    @Column(name = "old_value", nullable = false, length = 255)
    private String oldValue;

    @Column(name = "new_value", nullable = false, length = 255)
    private String newValue;

    public Long getId() {
        return id;
    }

    public Long getMonitorId() {
        return monitorId;
    }

    public void setMonitorId(Long monitorId) {
        this.monitorId = monitorId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getParameter() {
        return parameter;
    }

    public void setParameter(String parameter) {
        this.parameter = parameter;
    }

    public String getOldValue() {
        return oldValue;
    }

    public void setOldValue(String oldValue) {
        this.oldValue = oldValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }
}