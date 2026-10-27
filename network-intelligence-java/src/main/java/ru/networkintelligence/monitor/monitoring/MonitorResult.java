
package ru.networkintelligence.monitor.monitoring;

import jakarta.persistence.*;

@Entity
@Table(name = "monitor_results")
public class MonitorResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "monitor_id")
    private Long monitorId;

    @Column(name = "data", columnDefinition = "json")
    private String data;

    public Long getId() {
        return id;
    }

    public Long getMonitorId() {
        return monitorId;
    }
    public String getData() {
        return data;
    }
}
