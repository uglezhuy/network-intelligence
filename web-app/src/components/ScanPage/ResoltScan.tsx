type ResoltScanProps = {
  resultScan: any;
  subdomains: any;
};

function ResoltScan({ resultScan, subdomains }: ResoltScanProps) {
  if (!resultScan) {
    return <div>Сканирование еще не выполнялось</div>;
  }

  return (
    <>
      <div>
        <h2>Поддомены:</h2>

        {subdomains.map(function (subdomain: string) {
          return <div key={subdomain}>{subdomain}</div>;
        })}
      </div>
      <hr />
      <div>
        <h2>Основная информация</h2>
        <div>Домен: {resultScan.target}</div>
        <div>Hostname: {resultScan.hostname}</div>
        <div>
          HTTP статус: {resultScan.http?.status}{" "}
          {resultScan.http?.status === 200 ? "(🟢успешно)" : "(🔴ошибка)"}
        </div>{" "}
        <div>Задержка: {resultScan.http?.responseTime} ms</div>
        <div>Протокол: {resultScan.http?.proto}</div>
        <div>Конечный URL: {resultScan.http?.finalUrl}</div>
        <div>Сервер: {resultScan.http?.server}</div>
      </div>

      <hr />

      <h2>HTTP</h2>
      <div>
        <div>Тип контента: {resultScan.http?.contentType}</div>
        <div>Размер: {resultScan.http?.bodySizeKB} KB</div>
        <div>Кодировка: {resultScan.http?.contentEncoding}</div>
        <div>Title: {resultScan.http?.title}</div>
      </div>

      <hr />

      <div>
        <h2>Заголовки безопасности</h2>
        <div>HSTS: {resultScan.http?.hsts ?? "Нет"}</div>
        <div>X-Frame-Options: {resultScan.http?.xFrameOptions ?? "Нет"}</div>
        <div>CSP: {resultScan.http?.csp ?? "Нет"}</div>
        <div>X-XSS-Protection: {resultScan.http?.xssProtection ?? "Нет"}</div>
      </div>

      <hr />

      <div>
        <h2>DNS</h2>
        <h2>IPv4</h2>
        {resultScan.dns?.ipv4?.status === "fulfilled" ? (
          resultScan.dns.ipv4.value.map((ip: string) => (
            <div key={ip}>{ip}</div>
          ))
        ) : (
          <div>Нет записи</div>
        )}

        <h2>IPv6</h2>
        {resultScan.dns?.ipv6?.status === "fulfilled" ? (
          resultScan.dns.ipv6.value.map((ip: string) => (
            <div key={ip}>{ip}</div>
          ))
        ) : (
          <div>Нет записи</div>
        )}

        <h2>NS</h2>
        {resultScan.dns?.ns?.status === "fulfilled" ? (
          resultScan.dns.ns.value.map((server: string) => (
            <div key={server}>{server}</div>
          ))
        ) : (
          <div>Нет записи</div>
        )}
      </div>

      <hr />

      <div>
        <h2>Почтовые серверы</h2>
        {resultScan.dns?.mx?.status === "fulfilled" ? (
          resultScan.dns.mx.value.map((server: any) => (
            <div key={server.exchange}>
              {server.exchange} — priority {server.priority}
            </div>
          ))
        ) : (
          <div>Нет записей</div>
        )}
      </div>

      <hr />

      <div>
        <h2>IP / Сеть</h2>
        <div>IP: {resultScan.ip?.ip}</div>
        <div>Страна: {resultScan.ip?.country}</div>
        <div>Регион: {resultScan.ip?.state}</div>
        <div>Город: {resultScan.ip?.city}</div>
        <div>Часовой пояс: {resultScan.ip?.timezone}</div>
        <div>Источник: {resultScan.ip?.source}</div>
      </div>

      <hr />

      <div>
        <h2>TLS</h2>
        <div>Протокол: {resultScan.tls?.Protocol}</div>
        <div>Сертификат: {resultScan.tls?.getCertificate?.subject?.CN}</div>
        <div>Издатель: {resultScan.tls?.getCertificate?.issuer?.CN}</div>
        <div>Действителен с: {resultScan.tls?.getCertificate?.valid_from}</div>
        <div>Действителен до: {resultScan.tls?.getCertificate?.valid_to}</div>
        <div>Ключ: {resultScan.tls?.getCertificate?.bits} бит</div>
      </div>

      <hr />

      <div>
        <h2>Порты</h2>
        {resultScan.ports?.map((item: any) => (
          <div key={item.port}>
            Порт {item.port} — {item.status}
          </div>
        ))}
      </div>

      <hr />

      <div> все данные сканирования:{JSON.stringify(resultScan, null, 2)}</div>
    </>
  );
}

export default ResoltScan;
