package ru.networkintelligence.monitor.monitoring.saveMonitorEvents;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MonitorEventRepository
        extends JpaRepository<MonitorEvent, Long> {
}