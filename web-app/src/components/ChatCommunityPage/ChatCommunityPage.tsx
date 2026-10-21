import { useRef, useState } from "react";
import GetMessegePage from "./GetMessegePage";

type ChatCommunityPageProps = {
  page: string;
};

function ChatCommunityPage({ page }: ChatCommunityPageProps) {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const [connected, setConnected] = useState(false);

  const [getMessege, setGetMessege] = useState<string[]>([]);

  const socketRef = useRef<WebSocket | null>(null);

  let socket;

    const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isTypingRef = useRef(false);


    function handleMessageChange(value: string) {
        setMessage(value);

        const socket = socketRef.current;

        if (!socket || socket.readyState !== WebSocket.OPEN) {
            return;
        }

        if (!isTypingRef.current) {
            socket.send(JSON.stringify({
                type: "typing",
                body: "True"
            }));
            isTypingRef.current = true;
        }

        if (typingTimerRef.current !== null) { //индентификатор таймера существует
            clearTimeout(typingTimerRef.current);// отменяем предыдущий таймер так как тут значение между рендерами seRef
        }

        typingTimerRef.current = setTimeout(() => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "typing",
                    body: "False"
                }));
            }

            isTypingRef.current = false;
            typingTimerRef.current = null;
        }, 2000);
    }





  function connect() {
    socket = new WebSocket("ws://localhost:8080/ws/chat");
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      console.log("WebSocket подключён");
    };

    socket.onclose = () => {
      setConnected(false);
      console.log("WebSocket отключён");
    };

    socket.onerror = () => {
      console.log("Ошибка WebSocket");
    };

    socket.onmessage = (event) => {
      console.log("Получено сообщение:", event.data);

      setGetMessege((getMessege) => [...getMessege, event.data]);
    };
  }

  function sentName() {
    if (socketRef.current) {

        socketRef.current.send(JSON.stringify({
            type: "login",
            body: username
        }));

    }
  }
  function sentMesege() {
    if (socketRef.current) {
        socketRef.current.send(JSON.stringify({
            type: "message",
            body: message
        }));
    }
  }

  return (
    <>
      <h1>{page}</h1>
      <div>Нанжимите на кнопку для устновки подключения</div>
      <button onClick={connect}>Подключиться</button>{" "}
      <div> Введите никнейм для подключения</div>
      <input type="text" onChange={(e) => setUsername(e.target.value)} />
      <button onClick={sentName}>Отправить никнейм</button>
      <div> Состояние подключения: {connected ? "Online" : "Offline"}</div>
      <GetMessegePage getMessege={getMessege} />
        <input
            type="text"
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
        />      <button onClick={sentMesege}>Отправить сообщение</button>
    </>
  );
}

export default ChatCommunityPage;
