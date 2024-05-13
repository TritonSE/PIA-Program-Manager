export type ProgramProfileTableProps = {
  id: string;
};

export function ProgramProfileTable({ id }: ProgramProfileTableProps) {
  const tableClass = "border-collapse border-separate border-spacing-2 border border-slate-400";

  return (
    <table className={tableClass}>
      <tr className="border-2 border-black">
        <th>Student</th>
        <th>Status</th>
        <th>Days</th>
        <th>Start</th>
        <th>End</th>
        <th>Hrs Left</th>
        <th>Auth No.</th>
      </tr>
      <tr className="border-2 border-black">
        <td>{id}</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
      </tr>
      <tr className="border-2 border-black">
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
      </tr>
      <tr className="border-2 border-black">
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
      </tr>
      <tr className="border-2 border-black">
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
      </tr>
      <tr className="border-2 border-black">
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
      </tr>
      <tr className="border-2 border-black">
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
      </tr>
      <tr className="border-2 border-black">
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
      </tr>
      <tr className="border-2 border-black">
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
        <td>test</td>
      </tr>
    </table>
  );
}
