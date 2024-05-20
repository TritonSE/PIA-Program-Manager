export type ProgramProfileTableProps = {
  id: string;
};

export function ProgramProfileTable({ id }: ProgramProfileTableProps) {
  const tableClass = "h-full w-full border-collapse";
  const tdClass = "border-pia_neutral_gray border-[1px] p-[12px] border-b-0";
  const thClass = tdClass + " bg-pia_light_gray border-t-0";
  const dotClass = "my-[8px] mr-[8px] h-[8px] w-[8px] rounded-full";
  const programs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const _id = id;

  return (
    <table className={tableClass}>
      <tr>
        <td className={thClass + " border-l-0"}>Student</td>
        <td className={thClass}>Status</td>
        <td className={thClass}>Days</td>
        <td className={thClass}>Start</td>
        <td className={thClass}>End</td>
        <td className={thClass}>Hrs Left</td>
        <td className={thClass + " border-r-0"}>Auth No.</td>
      </tr>
      {programs.map((program) => (
        <tr key={program}>
          <td className={tdClass + " border-l-0"}>Test</td>
          <td className={tdClass}>
            <div className="flex flex-row">
              <p className={dotClass + " bg-joined_green"} />
              <p className="text-joined_green">Joined</p>
            </div>
          </td>
          <td className={tdClass}>Test</td>
          <td className={tdClass}>Test</td>
          <td className={tdClass}>Test</td>
          <td className={tdClass}>Test</td>
          <td className={tdClass + " border-r-0"}>Test</td>
        </tr>
      ))}
    </table>
  );
}
