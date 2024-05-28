type UserInfo = {
  name: string;
  end_date: string;
  program: string;
};

export default function RenewalCard({ name, end_date, program }: UserInfo) {
  return (
    <>
      <div
        className={
          "flex items-center justify-between px-[40px] py-[60px] font-['Poppins'] text-[18px] "
        }
      >
        <div id="person_info" className="">
          <div className="font-['Poppins-Bold']">Name: {name}</div>
          End Date: {end_date}
          <br></br>
          Program: {program}
        </div>

        <div id="buttons" className="flex items-center space-x-[30px]">
          <button className="h-[48px] w-[116px] rounded-full border border-pia_dark_green bg-pia_primary_white text-pia_dark_green">
            Dismiss
          </button>
        </div>
      </div>
    </>
  );
}
