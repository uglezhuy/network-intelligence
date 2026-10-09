import { useState } from "react";
import { API_BASE } from "../../api";

type SettingPageProps = {
  page: string;
};

function SettingPage({ page }: SettingPageProps) {
  return (
    <>
      <h1>Настройки</h1>
      <h2>Подключённые платформы</h2>
      <div>
        <h3>Telegram</h3>
        <div>ID пользователя: {503362430}</div>
        <div>Статус подключения: {"off"}</div>
      </div>
      <div>
        <h3>MAX</h3>
        <div>ID пользователя: {247742272}</div>
        <div>Статус подключения: {"off"}</div>
      </div>
    </>
  );
}

export default SettingPage;
