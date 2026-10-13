type SubdomainsTableProps = {
  subdomains: string[];
  details: any[];
};

function SubdomainsTable({ subdomains, details }: SubdomainsTableProps) {
  function getStatusColor(httpStatus: number | null) {
    let stat;
    if (httpStatus === null) {
      stat = "⚪" + httpStatus;
      return stat;
    }

    if (httpStatus >= 200 && httpStatus < 300) {
      stat = "🟢" + httpStatus;
      return stat;
    }

    if (httpStatus >= 300 && httpStatus < 400) {
      stat = "#eab308 " + httpStatus;
      return stat;
    }

    if (httpStatus >= 400 && httpStatus < 600) {
      stat = "🔴 " + httpStatus;
      return stat;
    }

    return "⚪ " + httpStatus;
  }

  return (
    <>
      <h3>Таблица поддоменов</h3>

      <table>
        <thead>
          <tr>
            <th>Поддомен</th>
            <th>IPv4</th>
            <th>IPv6</th>
            <th>HTTP</th>
            <th>Обнаружен</th>
          </tr>
        </thead>

        <tbody>
          {subdomains.map(function (subdomain) {
            const dnsResult = details.find(function (item) {
              return item.hostname === subdomain;
            });

            const httpStatus = dnsResult?.http?.status ?? null;
            const dns = dnsResult?.dns;

            const ipv4 =
              dns?.ipv4?.status === "fulfilled"
                ? dns.ipv4.value.join(", ")
                : "—";

            const ipv6 =
              dns?.ipv6?.status === "fulfilled"
                ? dns.ipv6.value.join(", ")
                : "—";

            return (
              <tr key={subdomain}>
                <td>{subdomain}</td>
                <td>{ipv4}</td>
                <td>{ipv6}</td>

                <td>{getStatusColor(httpStatus)}</td>

                <td>—</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default SubdomainsTable;
