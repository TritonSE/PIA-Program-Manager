type UserInfo = {
  name: string;
  email: string;
  account_type: string;
  onApprove: () => void;
  onDeny: () => void;
};

// export default function NotificationCard({ name, email, account_type }: UserInfo) {
export default function NotificationCard({
  name,
  email,
  account_type,
  onApprove,
  onDeny,
}: UserInfo) {
  return (
    <>
      <div
        className={
          "flex flex-col justify-between gap-5 px-[40px] py-[60px] font-['Poppins'] text-[18px]  md:flex-row md:items-center "
        }
      >
        <div id="person_info" className="">
          <div className="font-['Poppins-Bold']">Name: {name}</div>
          Email: {email}
          <br></br>
          Account Type: {account_type}
        </div>

        <div id="buttons" className="flex items-center space-x-[30px]">
          <button
            className="h-[48px] w-[116px] rounded-full border border-pia_dark_green bg-pia_primary_white text-pia_dark_green"
            onClick={onDeny}
          >
            Deny
          </button>
          <button
            className="h-[48px] w-[116px] rounded-full border bg-pia_dark_green text-pia_primary_white"
            onClick={onApprove}
          >
            Approve
          </button>
        </div>
      </div>
    </>
  );
}
