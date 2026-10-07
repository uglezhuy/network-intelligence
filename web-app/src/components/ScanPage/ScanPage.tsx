import { useState } from "react";
import ResoltScan from "./ResoltScan";
import { API_BASE } from "../../api";

type ScanPageProps = {
  page: string;
};

const TEST_USER_ID = 503362430;
const TEST_PLATFORM = "telegram";

function ScanPage({ page }: ScanPageProps) {
  const [URL, setURL] = useState("");
  const [resultScan, setResultScan] = useState<any>(null);
  const [subdomains, setSubdomains] = useState<string[]>([]);

  async function scan() {
    console.log("Сканирование URL:", URL);

    const response = await fetch(
      `${API_BASE}/api/scan/${URL}/${TEST_USER_ID}/${TEST_PLATFORM}`,
    );

    const data = await response.json();

    console.log("Результат сканирования:", data);

    setResultScan(data.scan);
    setSubdomains(data.subdomains);
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

      <ResoltScan resultScan={resultScan} subdomains={subdomains} />
    </aside>
  );
}

export default ScanPage;
