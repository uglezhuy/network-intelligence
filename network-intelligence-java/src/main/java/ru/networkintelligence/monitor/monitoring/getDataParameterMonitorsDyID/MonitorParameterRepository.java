
package ru.networkintelligence.monitor.monitoring.getDataParameterMonitorsDyID;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.networkintelligence.monitor.monitoring.getDataParameterMonitorsDyID.MonitorParameter;
import java.util.List;

public interface MonitorParameterRepository
        extends JpaRepository<MonitorParameter, Long> {

    List<MonitorParameter> findByMonitorId(Long monitorId);
}
