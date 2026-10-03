import { useEffect, useState } from "react";
import { API_BASE } from "../../api";

import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type MonitorResult = {
  id: number;
  time: string;
  status: number;
  responseTime: number;
  bodySizeKB: number;
};
export function MonitorChart({
  monitorId,
  period,
  type,
}: {
  monitorId: any;
  period: string;
  type: "responseTime" | "bodySizeKB";
}) {
  const [data, setData] = useState<MonitorResult[]>([]);
  const nummonitorId = Number(monitorId);
  useEffect(() => {
    if (!nummonitorId || Number.isNaN(nummonitorId)) return;

    fetch(`${API_BASE}/api/monitorHistory/${nummonitorId}?period=${period}`)
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        console.error("Ошибка загрузки истории:", error);
      });
  }, [nummonitorId, period]);

  const chartData = data.map((item) => ({
    time: new Date(item.time).getTime(),
    [type]: item[type],
  }));

  return (
    <>
      <div>{type}</div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="time"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickCount={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />

            <Tooltip
              labelFormatter={(value) =>
                new Date(Number(value)).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />

            <Line type="monotone" dataKey={type} stroke="#3b82f6" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
