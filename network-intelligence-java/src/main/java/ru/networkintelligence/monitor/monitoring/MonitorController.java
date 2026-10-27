package ru.networkintelligence.monitor.monitoring;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monitor")
public class MonitorController {

    MonitorService monitorService;
    public MonitorController(MonitorService monitorService) {
        this.monitorService = monitorService;
    }



    @PostMapping("/events/{monitorId}")
    public String detectEvents(@PathVariable Long monitorId) {
       return monitorService.detectEvents(monitorId);
    }



    @GetMapping("/results/count")
    public long countResults() {
        return monitorService.countResults();
    }

    @GetMapping("/results/2resolt/{monitorId}")
    public List<MonitorResult> getLastTwoResults(
            @PathVariable Long monitorId) {
        return monitorService.getLastTwoResults(monitorId);
    }




}