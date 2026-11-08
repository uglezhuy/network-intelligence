package ru.networkintelligence.monitor.monitoring;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.core.JsonProcessingException;
import ru.networkintelligence.monitor.monitoring.getDataLast2Monitors.MonitorRepository;
import ru.networkintelligence.monitor.monitoring.getDataLast2Monitors.MonitorResult;

import ru.networkintelligence.monitor.monitoring.getDataParameterMonitorsDyID.MonitorParameter;
import ru.networkintelligence.monitor.monitoring.getDataParameterMonitorsDyID.MonitorParameterRepository;

@Service
public class MonitorService {
    public record ComparisonResult(List<MonitorResult> results, List<ParameterChange> changes) {}


    private final MonitorRepository monitorRepository;
    private  final MonitorComparator monitorComparator;

    private final MonitorParameterRepository monitorParameterRepository;





    public MonitorService(MonitorRepository monitorRepository, MonitorComparator monitorComparator,        MonitorParameterRepository monitorParameterRepository) {

        this.monitorRepository = monitorRepository;
        this.monitorComparator = monitorComparator;
        this.monitorParameterRepository = monitorParameterRepository;
    }

    public long countResults() {
        return monitorRepository.count();
    }



    public ComparisonResult getLastTwoResults(Long monitorId) {












        // 1) находим последний результат ЛЮБОГО типа — чтобы узнать result_type
        Optional<MonitorResult> lastOpt =
                monitorRepository.findTop1ByMonitorIdOrderByIdDesc(monitorId);

        if (lastOpt.isEmpty()) {
            return new ComparisonResult(List.of(), List.of());        }

        MonitorResult last = lastOpt.get();
        String resultType = last.getResultType();

        // 2) ищем два последних результата ТОГО ЖЕ типа
        List<MonitorResult> results =
                monitorRepository.findTop2ByMonitorIdAndResultTypeOrderByIdDesc(
                        monitorId, resultType);

        if (results.size() < 2) {
            // есть только один скан этого типа — сравнивать не с чем
            return new ComparisonResult(List.of(), List.of());        }

        MonitorResult lastResult     = results.get(0);
        MonitorResult previousResult = results.get(1);

        System.out.println("Last result     = " + lastResult);
        System.out.println("Previous result = " + previousResult);

        // 3) парсим data
        ObjectMapper mapper = new ObjectMapper();
        JsonNode lastRoot;
        JsonNode prevRoot;
        try {
            lastRoot = mapper.readTree(lastResult.getData());
            prevRoot = mapper.readTree(previousResult.getData());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Не удалось прочитать JSON результатов мониторинга", e);
        }

        // 4) сравнение — теперь по реальной форме data





        List<MonitorParameter> parameters =
                monitorParameterRepository.findByMonitorId(monitorId);

        List<ParameterChange> changes =
                monitorComparator.difference(prevRoot, lastRoot, parameters);


        return new ComparisonResult(results, changes);
    }

    public String detectEvents(Long monitorId) {
        return "Получен монитор: " + monitorId;
    }


}
