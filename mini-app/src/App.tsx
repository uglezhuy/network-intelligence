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

    return (
        <div>
            <h1>Telegram User ID</h1>
            <p>{user?.id ?? "ID пользователя не найден"}</p>
        </div>
    );
}

export default App;