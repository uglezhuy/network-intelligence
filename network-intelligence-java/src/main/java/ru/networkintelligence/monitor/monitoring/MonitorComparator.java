
package ru.networkintelligence.monitor.monitoring;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import ru.networkintelligence.monitor.monitoring.getDataParameterMonitorsDyID.MonitorParameter;

@Component
public class MonitorComparator {

    public List<ParameterChange> difference(JsonNode prevRoot, JsonNode lastRoot,  List<MonitorParameter> parameters) {

        int  threshold =1;
        int bodySize=1;

        ParameterChange resolt = null;
        List<ParameterChange> resoltsDifferent = new ArrayList<>();



        if (lastRoot.isObject() && prevRoot.isObject()) {
            int lastTime     = lastRoot.path("http").path("responseTime").asInt();
            int previousTime = prevRoot.path("http").path("responseTime").asInt();

            int lastBodySize     = lastRoot.path("http").path("bodySize").asInt();
            int previousBodySize = prevRoot.path("http").path("bodySize").asInt();

            String lastPorts     = lastRoot.path("ports").toString();
            String previousPorts = prevRoot.path("ports").toString();

            int lastServerStatus = lastRoot.path("http").path("status").asInt();
            int previousServerStatus = prevRoot.path("http").path("serverStatus").asInt();

            String lastdnsInfoIPv4 = lastRoot.path("dns").path("ipv4").path("value").toString();
            String previousDnsInfoIPv4 = prevRoot.path("dns").path("ipv4").path("value").toString();


            System.out.println("=== PREVIOUS JSON ===");
            System.out.println(prevRoot.toPrettyString());

            System.out.println("=== LAST JSON ===");
            System.out.println(lastRoot.toPrettyString());

            System.out.println("parameters");
            for (MonitorParameter parameter : parameters) {
                System.out.println(parameter);
            }




            if (Math.abs(lastTime - previousTime) > threshold) {
                resolt = ParameterChange.numeric("responseTime", previousTime, lastTime, threshold);
                resoltsDifferent.add(resolt);
                // запись в бд сделать
            }

            if (Math.abs(lastBodySize - previousBodySize) > bodySize){
                resolt = ParameterChange.numeric(
                        "bodySize",
                        previousBodySize,
                        lastBodySize,
                        bodySize
                );                resoltsDifferent.add(resolt);
                // запись в бд сделать
            }

            if (!lastPorts.equals(previousPorts)) {
                resoltsDifferent.add(
                        ParameterChange.text("ports", previousPorts, lastPorts)
                );
            }

            if (lastServerStatus!=previousServerStatus){
                resoltsDifferent.add(
                        ParameterChange.numeric("serverStatus", previousServerStatus, lastServerStatus, threshold)
                );
            }

            if (!lastdnsInfoIPv4.equals(previousDnsInfoIPv4)) {
                resoltsDifferent.add(
                        ParameterChange.text("dnsInfo", previousDnsInfoIPv4, lastdnsInfoIPv4)
                );
            }

        }
        return resoltsDifferent;
    }
}




