type SidebarProps = {
  setPage: (page: string) => void
}




function Sidebar({ setPage }: SidebarProps) {
  return (
    <aside>
      <div>
        NETWORK INTELLIGENCE
      </div>

      <nav>
        <button onClick={() => setPage("Главная")}>
          Главная
        </button>

        <button onClick={() => setPage("Сканирование")}>
          Сканирование
        </button>

        <button onClick={() => setPage("Мониторы")}>
          Мониторы
        </button>

        <button onClick={() => setPage("События")}>
          События
        </button>

        <div>
          АНАЛИЗ
        </div>

        <button onClick={() => setPage("DNS-анализ")}>
          DNS-анализ
        </button>

        <button onClick={() => setPage("HTTP-анализ")}>
          HTTP-анализ
        </button>

        <button onClick={() => setPage("IP / Сеть")}>
          IP / Сеть
        </button>

        <button onClick={() => setPage("TLS-анализ")}>
          TLS-анализ
        </button>

        <button onClick={() => setPage("Порты")}>
          Порты
        </button>

        <div>
          СИСТЕМА
        </div>

        <button onClick={() => setPage("Настройки")}>
          Настройки
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar