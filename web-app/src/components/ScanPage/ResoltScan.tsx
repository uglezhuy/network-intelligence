type ResoltScanProps = {
  resultScan: string;
};

function ResoltScan({ resultScan }: ResoltScanProps) {
  return (
    <aside>
      <div>{resultScan}</div>
    </aside>
  );
}

export default ResoltScan;
