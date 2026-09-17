import { useState } from "react";

type ScanPageProps = {
  page: string;
};

function ScanPage({ page }: ScanPageProps) {
  const [URL, setURL] = useState("");
  const [resultScan, setResultScan] = useState("идет скан");
  async function scan() {
    console.log("Сканирование URL:", URL);

    const response = await fetch(`http://localhost:3000/api/scan/${URL}`);

    const data = await response.json();

    console.log("Результат сканирования:", data);

    setResultScan(JSON.stringify(data, null, 2));
  }

  return (
    <aside>
      <div>
        {page}

        <div>Введите URL для сканирования</div>

        <input
          type="text"
          value={URL}
          onChange={(event) => setURL(event.target.value)}
        />
      </div>

      <button onClick={scan}>Сканировать</button>

      <div>Результат сканирования:</div>

      <pre>{resultScan}</pre>
    </aside>
  );
}

export default ScanPage;
