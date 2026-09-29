import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type MonitorResult = {
  id: number;
  time: string;
  status: number;
  responseTime: number;
};

export function MonitorChart() {
  const [data, setData] = useState<MonitorResult[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/monitorHistory/180?days=1")
      .then((response) => response.json())
      .then((result) => {
        console.log("Данные графика:", result);

        setData(result);
      })
      .catch((error) => {
        console.error("Ошибка загрузки истории:", error);
      });
  }, []);

  const chartData = data.map((item) => ({
    time: new Date(item.time).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }),

    responseTime: item.responseTime,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="responseTime"
            stroke="#3b82f6"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
