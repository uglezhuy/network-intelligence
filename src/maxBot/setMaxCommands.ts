import "dotenv/config";

async function setMaxCommands() {

    const token = process.env.MAX_BOT_TOKEN;

    if (!token) {
        console.log("MAX_BOT_TOKEN не найден");
        return;
    }

    try {

        const response = await fetch(
            "https://platform-api2.max.ru/me/commands",
            {
                method: "PATCH",

                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    commands: [

                        {
                            name: "help",
                            description: "Подробная инструкция и примеры"
                        },

                        {
                            name: "scan",
                            description: "Проверить сайт или IP"
                        },

                        {
                            name: "monitor",
                            description: "Запустить мониторинг сайта"
                        },

                        {
                            name: "events",
                            description: "Отслеживать изменения"
                        },

                        {
                            name: "monitors",
                            description: "Показать мои мониторы"
                        },

                        {
                            name: "stop",
                            description: "Остановить мониторинг"
                        },

                        {
                            name: "app",
                            description: "Открыть тестовую (!пока что не mini app!)Web-версию Network Intelligence"
                        }

                    ]
                })
            }
        );

        const data = await response.json();

        console.log(
            "MAX commands:",
            data
        );

    } catch (error) {

        console.error(
            "Ошибка установки команд MAX:",
            error
        );

    }
}

export { setMaxCommands };