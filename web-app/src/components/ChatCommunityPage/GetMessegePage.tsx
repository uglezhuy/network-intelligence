type GetMessegePageProps = {
    username: string;
  getMessege: string[];
  getMessegeTyping: string[];
    getSizeSessions: string[];
    getAutorizationsUsers:string[];
};

function GetMessegePage({username, getMessege, getMessegeTyping, getSizeSessions, getAutorizationsUsers }: GetMessegePageProps) {
  return (
    <>

        <hr/>
        <hr/>
        <hr/>
        <hr/>
        <div> Весего чел в сесиии</div>
        {getSizeSessions.map((message, index) => (
            <div key={index}>{message}</div>
        ))}

        <hr/>
        <hr/>
        <hr/>
        <hr/>

        <div> Автризированныые сесии: </div>

        <div> Весего чел в сесиии</div>
        {getAutorizationsUsers.map((message, index) => (
            <div key={index}>{message}</div>
        ))}





            <hr/>
            <hr/>
            <hr/>
            <hr/>
        <div>Челвоек печатет:</div>
        {getMessegeTyping.map((message, index) => (
            <div key={index}>{message}</div>
        ))}

        <hr/>
        <hr/>
        <hr/>
        <hr/>



        <div>Сообщения:</div>

        {getMessege.map((message, index) => {
            const isMine = message.startsWith(`[${username}]:`);

            return (
                <div
                    key={index}
                    style={{
                        backgroundColor: isMine ? "#EDE9FE" : "#DBEAFE",
                        width: "fit-content",
                        marginLeft: isMine ? "auto" : "0"
                    }}
                >
                    {message}
                </div>
            );
        })}
        <hr/>
        <hr/>
        <hr/>
        <hr/>





    </>
  );
}

export default GetMessegePage;
