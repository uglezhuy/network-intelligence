type GetMessegePageProps = {
  getMessege: string[];
  getMessegeTyping: string[];
    getSizeSessions: string[];
    getAutorizationsUsers:string[];
};

function GetMessegePage({ getMessege, getMessegeTyping, getSizeSessions, getAutorizationsUsers }: GetMessegePageProps) {
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
      {getMessege.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
        <hr/>
        <hr/>
        <hr/>
        <hr/>





    </>
  );
}

export default GetMessegePage;
