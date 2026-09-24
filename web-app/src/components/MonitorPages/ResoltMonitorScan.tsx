import { useEffect, useState } from "react";

type ResoltMonitorScanProps = {
  page: string;
  monitorId: number | null;
};

function ResoltMonitorScan({ page, monitorId }: ResoltMonitorScanProps) {
  const [resultMonitor, setResultMonitor] = useState("Идет загрузка монитора");

  console.log("Вывод монитора с ID:", monitorId);

  useEffect(() => {
    async function getMonitorResult() {
      if (monitorId === null) {
        setResultMonitor("Монитор не выбран");
        return;
      }

      try {
        const resoltMonitor = await fetch(
          `http://localhost:3000/api/monitorsResolts/${monitorId}`,
        );

        const data = await resoltMonitor.json();

        console.log("Все данные монитора:", data);

        setResultMonitor(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error("Ошибка получения результата монитора:", error);

        setResultMonitor("Ошибка получения данных монитора");
      }
    }

    getMonitorResult();
  }, [monitorId]);

  return (
    <>
      <div>Результат сканирования:</div>

      <div>МОНИТОРИНГ:</div>

      <div>Выбран монитор с ID: {monitorId}</div>

      <div>{resultMonitor}</div>
    </>
  );
}

export default ResoltMonitorScan;
