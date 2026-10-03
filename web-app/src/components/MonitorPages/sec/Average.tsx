import { API_BASE } from "../../../api";
import { useEffect, useState } from "react";

function Average({
  monitorId,
  period,
}: {
  monitorId: number | null;
  period: string;
}) {
  const [averageResponseTime, setAverageResponseTime] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!monitorId) return;

    fetch(`${API_BASE}/api/monitorHistory/${monitorId}?period=${period}`)
      .then((response) => response.json())
      .then((result) => {
        const responseTimes = result
          .map((item: any) => item.responseTime)
          .filter((time: number | null) => time !== null);

        if (responseTimes.length > 0) {
          const sum = responseTimes.reduce(
            (sum: number, responseTime: number) => sum + responseTime,
            0,
          );

          setAverageResponseTime(sum / responseTimes.length);
        } else {
          setAverageResponseTime(null);
        }
      })
      .catch((error) => {
        console.error("Ошибка загрузки истории:", error);
      });
  }, [monitorId, period]);

  return (
    <>
      <div>Среднее значение задержки за: {period}</div>

      <div>{averageResponseTime}</div>
    </>
  );
}

export default Average;
