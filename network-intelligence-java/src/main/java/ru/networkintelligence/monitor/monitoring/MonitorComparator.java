
package ru.networkintelligence.monitor.monitoring;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class MonitorComparator {

    public List<ParameterChange> difference(JsonNode prevRoot, JsonNode lastRoot) {

        int  threshold =1;
        int bodySize=1;

        ParameterChange resolt = null;
        List<ParameterChange> resoltsDifferent = new ArrayList<>();



        if (lastRoot.isObject() && prevRoot.isObject()) {
            int lastTime     = lastRoot.path("http").path("responseTime").asInt();
            int previousTime = prevRoot.path("http").path("responseTime").asInt();

            int lastBodySize     = lastRoot.path("http").path("bodySize").asInt();
            int previousBodySize = prevRoot.path("http").path("bodySize").asInt();

            String lastPorts = lastRoot.path("http").path("ports").asText();
            String previousPorts = prevRoot.path("http").path("ports").asText();

            int serverStatus = lastRoot.path("http").path("serverStatus").asInt();
            int previousServerStatus = prevRoot.path("http").path("serverStatus").asInt();

            String dnsInfoIPv4 = lastRoot.path("http").path("dnsInfo").path("ipv4").asText();
            String previousDnsInfoIPv4 = prevRoot.path("http").path("dnsInfo").path("ipv4").asText();





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

            if (serverStatus!=previousServerStatus){
                resoltsDifferent.add(
                        ParameterChange.numeric("serverStatus", previousServerStatus, serverStatus, threshold)
                );
            }

            if (!dnsInfoIPv4.equals(previousDnsInfoIPv4)) {
                resoltsDifferent.add(
                        ParameterChange.text("dnsInfo", previousDnsInfoIPv4, dnsInfoIPv4)
                );
            }

        }
        return resoltsDifferent;
    }
}




