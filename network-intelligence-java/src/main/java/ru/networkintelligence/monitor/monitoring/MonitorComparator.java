
package ru.networkintelligence.monitor.monitoring;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import ru.networkintelligence.monitor.monitoring.getDataParameterMonitorsDyID.MonitorParameter;

@Component
public class MonitorComparator {

    public List<ParameterChange> difference(JsonNode prevRoot, JsonNode lastRoot,  List<MonitorParameter> parameters) {


        List<ParameterChange> resoltsDifferent = new ArrayList<>();



        if (lastRoot.isObject() && prevRoot.isObject()) {
            int lastTime     = lastRoot.path("http").path("responseTime").asInt();
            int previousTime = prevRoot.path("http").path("responseTime").asInt();

            int lastBodySize     = lastRoot.path("http").path("bodySize").asInt();
            int previousBodySize = prevRoot.path("http").path("bodySize").asInt();

            JsonNode lastPorts = lastRoot.path("ports");
            JsonNode previousPorts = prevRoot.path("ports");

            int lastServerStatus = lastRoot.path("http").path("status").asInt();
            int previousServerStatus =
                    prevRoot.path("http").path("status").asInt();

            JsonNode lastDnsInfoIPv4 = lastRoot.path("dns").path("ipv4").path("value");
            JsonNode previousDnsInfoIPv4 = prevRoot.path("dns").path("ipv4").path("value");

            System.out.println("=== PREVIOUS JSON ===");
            System.out.println(prevRoot.toPrettyString());

            System.out.println("=== LAST JSON ===");
            System.out.println(lastRoot.toPrettyString());


            System.out.println("parameters");
            for (MonitorParameter parameter : parameters) {
                System.out.println("Параметр: " + parameter.getParameter());
                System.out.println("Включен: " + parameter.getEnabled());
                System.out.println("Порог: " + parameter.getThreshold());
                System.out.println("Минимальная разница: " + parameter.getMinDiffToReport());
                System.out.println("----------------------");
            }





            Map<String, MonitorParameter> parameterMap = new HashMap<>();

            for (MonitorParameter parameter : parameters) {
                parameterMap.put(parameter.getParameter(), parameter);
            }

            MonitorParameter responseTime =
                    parameterMap.get("responseTime");

            MonitorParameter bodySize =
                    parameterMap.get("bodySize");

            MonitorParameter ports =
                    parameterMap.get("ports");

            MonitorParameter serverStatus =
                    parameterMap.get("serverStatus");

            MonitorParameter dnsInfo =
                    parameterMap.get("dnsInfo");



            if (responseTime != null && Boolean.TRUE.equals(responseTime.getEnabled())) {

                BigDecimal threshold = responseTime.getThreshold();

                BigDecimal difference = BigDecimal.valueOf(lastTime)
                        .subtract(BigDecimal.valueOf(previousTime))
                        .abs();

                if (threshold != null && difference.compareTo(threshold) > 0) {

                    resoltsDifferent.add(
                            ParameterChange.numeric(
                                    "responseTime",
                                    previousTime,
                                    lastTime,
                                    threshold.intValue()
                            )
                    );
                }
            }



            if (bodySize != null && Boolean.TRUE.equals(bodySize.getEnabled())) {

                BigDecimal threshold = bodySize.getThreshold();

                BigDecimal difference = BigDecimal.valueOf(lastBodySize)
                        .subtract(BigDecimal.valueOf(previousBodySize))
                        .abs();

                if (threshold != null && difference.compareTo(threshold) > 0) {

                    resoltsDifferent.add(
                            ParameterChange.numeric(
                                    "bodySize",
                                    previousBodySize,
                                    lastBodySize,
                                    threshold.intValue()
                            )
                    );
                }
            }



            if (ports != null && Boolean.TRUE.equals(ports.getEnabled())) {

                if (!lastPorts.equals(previousPorts)) {

                    resoltsDifferent.add(
                            ParameterChange.text(
                                    "ports",
                                    previousPorts.toString(),
                                    lastPorts.toString()
                            )
                    );
                }
            }

            if (serverStatus != null && Boolean.TRUE.equals(serverStatus.getEnabled())) {

                BigDecimal threshold = serverStatus.getThreshold();

                BigDecimal difference = BigDecimal.valueOf(lastServerStatus)
                        .subtract(BigDecimal.valueOf(previousServerStatus))
                        .abs();

                if (threshold == null || difference.compareTo(threshold) > 0) {

                    resoltsDifferent.add(
                            ParameterChange.numeric(
                                    "serverStatus",
                                    previousServerStatus,
                                    lastServerStatus,
                                    threshold == null ? 0 : threshold.intValue()
                            )
                    );
                }
            }

            if (dnsInfo != null && Boolean.TRUE.equals(dnsInfo.getEnabled())) {

                if (!lastDnsInfoIPv4.equals(previousDnsInfoIPv4)) {

                    resoltsDifferent.add(
                            ParameterChange.text(
                                    "dnsInfo",
                                    previousDnsInfoIPv4.toString(),
                                    lastDnsInfoIPv4.toString()
                            )
                    );
                }
            }

        }
        return resoltsDifferent;
    }
}




