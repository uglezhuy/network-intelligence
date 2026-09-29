import { useState } from "react";
import ResoltScan from "./ResoltScan";
import { API_BASE } from "../../api";

type ScanPageProps = {
  page: string;
};

const TEST_USER_ID = 503362430; //временный тг айди  для тестов  247742272
const TEST_PLATFORM = "telegram"; // telegram  web  max

function ScanPage({ page }: ScanPageProps) {
  const [URL, setURL] = useState("");
  const [resultScan, setResultScan] = useState("идет скан");
  async function scan() {
    console.log("Сканирование URL:", URL);

    const response = await fetch(
      `${API_BASE}/api/scan/${URL}/${TEST_USER_ID}/${TEST_PLATFORM}`,
    );

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

      <ResoltScan resultScan={resultScan} />
    </aside>
  );
}

export default ScanPage;
