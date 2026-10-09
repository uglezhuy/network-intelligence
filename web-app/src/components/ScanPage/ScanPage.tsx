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
  const [includeSubdomains, setIncludeSubdomains] = useState<boolean>(false);

  async function scan() {
    console.log("Сканирование URL:", URL);

    const response = await fetch(
      `${API_BASE}/api/scan/${URL}/${TEST_USER_ID}/${TEST_PLATFORM}`,
    );

    const data = await response.json();

    console.log("Результат сканирования:", data);

    setResultScan(data.scan);
    if (includeSubdomains == true) {
      console.log("скан поддмоенов");
      setSubdomains(data.subdomains);
    } else {
      console.log("! НЕскан поддмоенов НЕ ");
    }
  }
  console.log("Результат чекбокса", includeSubdomains);
  return (
    <aside>
      <div>
        <h1>{page}</h1>

        <div>Введите URL для сканирования</div>

        <input
          type="text"
          value={URL}
          onChange={(event) => setURL(event.target.value)}
        />
        <label>
          <input
            type="checkbox"
            id="myCheck"
            checked={includeSubdomains}
            onChange={(e) => setIncludeSubdomains(e.target.checked)}
          />
          Включить поиск поддоменов (скрость запроса значительно увеличивается и
          работа не гарнтироввана// https://crt.sh/ стрый api новый новый
          https://crt.sh/?q=%25.URL.com&output=json.) )
        </label>
      </div>

      <button onClick={scan}>Сканировать</button>

      <div>Результат сканирования:</div>

      <ResoltScan resultScan={resultScan} subdomains={subdomains} />
    </aside>
  );
}

export default ScanPage;
