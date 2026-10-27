
package ru.networkintelligence.monitor.monitoring;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MonitorRepository
        extends JpaRepository<MonitorResult, Long> {

    List<MonitorResult> findTop2ByMonitorIdOrderByIdDesc(Long monitorId);      // доразаоьрат ьправли запроссов!!!!!!!!!!!!!
}
