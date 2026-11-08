
package ru.networkintelligence.monitor.monitoring.getDataParameterMonitorsDyID;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "monitor_parameters")
public class MonitorParameter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "monitor_id")
    private Long monitorId;

    private String parameter;

    private Boolean enabled;

    private BigDecimal threshold;

    @Column(name = "min_diff_to_report")
    private BigDecimal minDiffToReport;

    public Long getId() {
        return id;
    }

    public Long getMonitorId() {
        return monitorId;
    }

    public String getParameter() {
        return parameter;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public BigDecimal getThreshold() {
        return threshold;
    }

    public BigDecimal getMinDiffToReport() {
        return minDiffToReport;
    }
}
