import NotificationCard from "./NotificationCard";

export default function NotificationTable() {
  return (
    <div className="m-auto max-w-full border-collapse border-separate rounded-[15px] border-[1px] border-pia_neutral_gray bg-pia_primary_white">
      <div>
        <NotificationCard
          name="Alice Anderson"
          email="aliceanderson@gmail.com"
          account_type="Team"
        />
      </div>
      <div className="border-[1px] border-pia_neutral_gray" />
      <div>
        <NotificationCard name="Chloe Cai" email="chloe8cai@gmail.com" account_type="Admin" />
      </div>
      <div className="border-[1px] border-pia_neutral_gray" />
      <div>
        <NotificationCard name="Henry Harris" email="henryharris@gmail.com" account_type="Team" />
      </div>
    </div>
  );
}
