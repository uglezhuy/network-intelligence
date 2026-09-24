type DashboardProps = {
  page: string;
};

function Dashboard({ page }: DashboardProps) {
  return (
    <aside>
      <div>{page}</div>
    </aside>
  );
}

export default Dashboard;
