type SidebarProps = {
  setPage: (page: string) => void;
};

function Sidebar({ setPage }: SidebarProps) {
  return (
    <aside>
      <div>NETWORK INTELLIGENCE</div>

      <nav>
        <button onClick={() => setPage("Главная")}>Главная</button>

        <button onClick={() => setPage("Сканирование")}>Сканирование</button>

        <button onClick={() => setPage("Мониторы")}>Мониторы</button>

        <button onClick={() => setPage("События")}>События</button>

        <button onClick={() => setPage("Настройки")}>Настройки</button>
      </nav>
    </aside>
  );
}

export default Sidebar;
