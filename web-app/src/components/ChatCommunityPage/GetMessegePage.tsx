type GetMessegePageProps = {
  getMessege: string[];
};

function GetMessegePage({ getMessege }: GetMessegePageProps) {
  return (
    <>
      <div>Сообщения:</div>
      {getMessege.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </>
  );
}

export default GetMessegePage;
