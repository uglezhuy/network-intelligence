
package ru.networkintelligence.monitor.monitoring.getDataLast2Monitors;

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

    @Column(name = "result_type")
    private String resultType;


    public Long getId()           { return id; }
    public Long getMonitorId()    { return monitorId; }
    public String getResultType() { return resultType; }
    public String getData()       { return data; }

    public void setId(Long id)                { this.id = id; }
    public void setMonitorId(Long monitorId)  { this.monitorId = monitorId; }
    public void setResultType(String rt)      { this.resultType = rt; }
    public void setData(String data)          { this.data = data; }



}
