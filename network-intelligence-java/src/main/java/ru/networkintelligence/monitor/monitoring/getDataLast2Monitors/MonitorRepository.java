
package ru.networkintelligence.monitor.monitoring.getDataLast2Monitors;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MonitorRepository extends JpaRepository<MonitorResult, Long> {

    // последний результат по монитору (любой тип)
    Optional<MonitorResult> findTop1ByMonitorIdOrderByIdDesc(Long monitorId);

    // два последних результата того же monitor_id + того же result_type
    List<MonitorResult> findTop2ByMonitorIdAndResultTypeOrderByIdDesc(
            Long monitorId, String resultType);
}
