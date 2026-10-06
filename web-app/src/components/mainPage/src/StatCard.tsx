type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  trend: string;
};

function StatCard({ title, value, description, trend }: StatCardProps) {
  return (
    <div>
      <div>{title}</div>
      <div>{value}</div>
      <div>{description}</div>
      <div>{trend}</div>
      <hr />
    </div>
  );
}

export default StatCard;
