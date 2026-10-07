type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
};

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div>
      <div>{title}</div>
      <div>{value}</div>
      <div>{description}</div>
      <hr />
    </div>
  );
}

export default StatCard;
