import RenewalCard from "./RenewalCard";

export default function RenewalTable() {
  return (
    <div className="m-auto max-w-full border-collapse border-separate rounded-[15px] border-[1px] border-pia_neutral_gray bg-pia_primary_white">
      <div>
        <RenewalCard name="Alice Anderson" end_date="4/22/2024" program="Entrepreneurship" />
      </div>
      <div className="border-[1px] border-pia_neutral_gray" />
      <div>
        <RenewalCard name="Ben Bill" end_date="4/25/2024" program="Entrepreneurship" />
      </div>
      <div className="border-[1px] border-pia_neutral_gray" />
      <div>
        <RenewalCard name="Alice Anderson" end_date="4/28/2024" program="Entrepreneurship" />
      </div>
    </div>
  );
}
