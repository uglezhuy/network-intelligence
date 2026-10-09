import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/mainPage/Dashboard";
import ScanPage from "./components/ScanPage/ScanPage";
import MonitorsPage from "./components/MonitorPages/MonitorsPage";
import EaventsPage from "./components/EaventsPage/EaventsPage";
import SettingPage from "./components/SettingPage/SettingPage.tsx";

function App() {
  const [page, setPage] = useState("Главная");

  return (
    <div>
      <Sidebar setPage={setPage} />

      <main>
        {page === "Главная" && <Dashboard page={page} />}
        {page === "Сканирование" && <ScanPage page={page} />}
        {page === "Мониторы" && <MonitorsPage page={page} />}
        {page === "События" && <EaventsPage page={page} />}
        {page === "Настройки" && <SettingPage page={page} />}
      </main>
    </div>
  );
}

export default App;
