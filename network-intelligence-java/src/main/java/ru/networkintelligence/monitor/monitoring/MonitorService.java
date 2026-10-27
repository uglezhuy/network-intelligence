package ru.networkintelligence.monitor.monitoring;
import org.springframework.stereotype.Service;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.core.JsonProcessingException;

@Service
public class MonitorService {



    private final MonitorRepository monitorRepository;

    public MonitorService(MonitorRepository monitorRepository) {
        this.monitorRepository = monitorRepository;
    }

    public long countResults() {
        return monitorRepository.count();
    }



    public List<MonitorResult> getLastTwoResults(Long monitorId)
    {

        List<MonitorResult> results= monitorRepository
                .findTop2ByMonitorIdOrderByIdDesc(monitorId);
        if (results.size() < 2) {
            return List.of();
        }
        MonitorResult lastResult = results.get(0);
        MonitorResult previousResult = results.get(1);

 System.out.println("Last result: " + lastResult);
 System.out.println("Previous result: " + previousResult);

        String lastData = lastResult.getData();
        String previousData = previousResult.getData();

        ObjectMapper mapper = new ObjectMapper();

        JsonNode lastDataRoot;
        JsonNode previousDataRoot;

        try {
            lastDataRoot = mapper.readTree(lastData);
            previousDataRoot = mapper.readTree(previousData);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Не удалось прочитать JSON результатов мониторинга", e);
        }
        ////////////////////////////////////////////////////////////////////
        int previousTime = previousDataRoot
                .path("http")
                .path("responseTime")
                .asInt();

        int lastTime = lastDataRoot
                .path("http")
                .path("responseTime")
                .asInt();

        int difference = lastTime - previousTime;

        if (difference>100) {
            System.out.println("Difference >100: " + difference);
        }


        return results;
    }


    public String detectEvents(Long monitorId) {
        return "Получен монитор: " + monitorId;
    }


}
