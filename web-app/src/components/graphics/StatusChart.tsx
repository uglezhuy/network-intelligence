import { useEffect, useState } from "react";
import { API_BASE } from "../../api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type StatusData = {
  status: number;
  count: number;
};

export function StatusChart({
  monitorId,
  period,
}: {
  monitorId: number | null;
  period: string;
}) {
  const [data, setData] = useState<StatusData[]>([]);

  useEffect(() => {
    if (!monitorId) return;

    fetch(`${API_BASE}/api/monitorHistory/${monitorId}?period=${period}`)
      .then((response) => response.json())
      .then((result) => {
        const statuses: Record<number, number> = {};

        result.forEach((item: any) => {
          const status = item.status;

          if (status) {
            statuses[status] = (statuses[status] || 0) + 1;
          }
        });

        const chartData = Object.entries(statuses).map(([status, count]) => ({
          status: Number(status),
          count,
        }));

        setData(chartData);
      })
      .catch((error) => {
        console.error("Ошибка загрузки статусов:", error);
      });
  }, [monitorId, period]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="status" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
