#!/usr/bin/env bash
# ============================================================
# Network Intelligence — обновление на сервере одной командой:
#
#   ./deploy.sh
#
# Что делает:
#   1) забирает свежий код из Git (git pull);
#   2) пересобирает и перезапускает контейнеры (docker compose up --build -d);
#   3) ждёт готовности API;
#   4) проверяет, что web-app и mini-app отвечают.
#
# Данные БД не затрагиваются: они лежат в volume `mysql-data`.
# Git и Docker напрямую не связаны — связку выполняет этот скрипт.
# ============================================================
set -euo pipefail

cd "$(dirname "$0")"

# На сервере может стоять standalone docker-compose вместо плагина compose v2.
if docker compose version >/dev/null 2>&1; then
    DC="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DC="docker-compose"
else
    echo "Ошибка: не найден ни 'docker compose', ни 'docker-compose'" >&2
    exit 1
fi

API_CHECK_URL="http://localhost:3000/api/scan/example.com/503362430/web"

echo "=== 1/4. Получение изменений из Git ==="
git pull --ff-only

echo "=== 2/4. Сборка и запуск контейнеров ==="
$DC up --build -d

echo "=== 3/4. Ожидание готовности API (до 60 с) ==="
API_OK=0
for _ in $(seq 1 30); do
    if curl -fsS "$API_CHECK_URL" >/dev/null 2>&1; then
        API_OK=1
        break
    fi
    sleep 2
done

if [ "$API_OK" -ne 1 ]; then
    echo "API не ответил за 60 с. Посмотрите логи: $DC logs -f api" >&2
    exit 1
fi
echo "API отвечает: $API_CHECK_URL"

echo "=== 4/4. Проверка HTTP-сервисов ==="
curl -fsS -o /dev/null -w "web-app  (:5173) → %{http_code}\n" http://localhost:5173/ || true
curl -fsS -o /dev/null -w "mini-app (:5174) → %{http_code}\n" http://localhost:5174/ || true

echo
echo "Готово. Состояние контейнеров:"
$DC ps
