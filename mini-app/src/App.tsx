import { useEffect, useState } from "react";
import { API_BASE } from "./api";

declare global {
    interface Window {
        Telegram?: {
            WebApp: {
                initDataUnsafe: {
                    user?: {
                        id: number;
                        username?: string;
                    };
                };
            };
        };
    }
}

function App() {
    const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

    const [monitors, setMonitors] = useState<any[]>([]);

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        fetch(
            `${API_BASE}/api/monitorsUser/${user.id}`
        )
            .then(response => {
                console.log("Ответ API:", response);

                return response.json();
            })
            .then(data => {
                console.log("Данные мониторов:", data);

                setMonitors(data);
            })
            .catch(error => {
                console.error("Ошибка API:", error);
            });

    }, [user?.id]);

    console.log("monitors state:", monitors);

    return (
        <div>
            <h1>Пользователь</h1>

            <p>
                ID: {user?.id}
            </p>

            <h2>Мои мониторы</h2>

            {monitors.map(monitor => (
                <div key={monitor.id}>
                    <p>
                        #{monitor.id} {monitor.target}
                    </p>

                    <p>
                        Интервал: {monitor.interval_minutes} мин.
                    </p>

                    <p>
                        Статус: {monitor.status}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default App;