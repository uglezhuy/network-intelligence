import { API_BASE } from "../../../api";
import { useEffect, useState } from "react";

/////////////////////////////AVERAGE/////////////////////////////////////////
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
////////////////////////////MIN/////////////////////////////////////////
function Min({
  monitorId,
  period,
}: {
  monitorId: number | null;
  period: string;
}) {
  const [minResponseTime, setMinResponseTime] = useState<number | null>(null);

  useEffect(() => {
    if (!monitorId) return;

    fetch(`${API_BASE}/api/monitorHistory/${monitorId}?period=${period}`)
      .then((response) => response.json())
      .then((result) => {
        const responseTimes = result
          .map((item: any) => item.responseTime)
          .filter((time: number | null) => time !== null);

        if (responseTimes.length > 0) {
          const min = responseTimes.reduce(
            (min: number, responseTime: number) => Math.min(min, responseTime),
            Infinity,
          );

          setMinResponseTime(min);
        } else {
          setMinResponseTime(null);
        }
      })
      .catch((error) => {
        console.error("Ошибка загрузки истории:", error);
      });
  }, [monitorId, period]);

  return (
    <>
      <div>минимальное значение задержки за: {period}</div>

      <div>{minResponseTime}</div>
    </>
  );
}
/////////////////////////////MAX/////////////////////////////////////////
function Max({
  monitorId,
  period,
}: {
  monitorId: number | null;
  period: string;
}) {
  const [maxResponseTime, setMaxResponseTime] = useState<number | null>(null);

  useEffect(() => {
    if (!monitorId) return;

    fetch(`${API_BASE}/api/monitorHistory/${monitorId}?period=${period}`)
      .then((response) => response.json())
      .then((result) => {
        const responseTimes = result
          .map((item: any) => item.responseTime)
          .filter((time: number | null) => time !== null);

        if (responseTimes.length > 0) {
          const max = responseTimes.reduce(
            (max: number, responseTime: number) => Math.max(max, responseTime),
            -Infinity,
          );

          setMaxResponseTime(max);
        } else {
          setMaxResponseTime(null);
        }
      })
      .catch((error) => {
        console.error("Ошибка загрузки истории:", error);
      });
  }, [monitorId, period]);

  return (
    <>
      <div>максимальное значение задержки за: {period}</div>

      <div>{maxResponseTime}</div>
    </>
  );
}
/////////////////////////////Доступность/////////////////////////////////////////

function Availability({
  monitorId,
  period,
}: {
  monitorId: number | null;
  period: string;
}) {
  const [availability, setAvailability] = useState<number | null>(null);

  useEffect(() => {
    if (!monitorId) return;

    fetch(`${API_BASE}/api/monitorHistory/${monitorId}?period=${period}`)
      .then((response) => response.json())
      .then((result) => {
        const totalCount = result.length;
        const successCount = result.filter(
          (item: any) => item.status === 200,
        ).length;

        if (totalCount > 0) {
          setAvailability((successCount / totalCount) * 100);
        } else {
          setAvailability(null);
        }
      })
      .catch((error) => {
        console.error("Ошибка загрузки истории:", error);
      });
  }, [monitorId, period]);

  return (
    <>
      <div>Доступность за: {period}%</div>

      <div>{availability}</div>
    </>
  );
}
///////////Проверок//////////////
function CheckCount({
  monitorId,
  period,
}: {
  monitorId: number | null;
  period: string;
}) {
  const [checkCount, setCheckCount] = useState<number | null>(null);

  useEffect(() => {
    if (!monitorId) return;

    fetch(`${API_BASE}/api/monitorHistory/${monitorId}?period=${period}`)
      .then((response) => response.json())
      .then((result) => {
        setCheckCount(result.length);
      })
      .catch((error) => {
        console.error("Ошибка загрузки истории:", error);
      });
  }, [monitorId, period]);

  return (
    <>
      <div>Количество проверок за: {period}</div>

      <div>{checkCount}</div>
    </>
  );
}

export { Average, Min, Max, Availability, CheckCount };
