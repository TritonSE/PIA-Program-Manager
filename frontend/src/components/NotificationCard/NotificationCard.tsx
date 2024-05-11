import { Button } from "../Button";

type UserInfo = {
  name: string;
  email: string;
  account_type: string;
};

export default function NotificationCard({ name, email, account_type }: UserInfo) {
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

        <div id="buttons" className="flex w-[calc(8em*2)] items-center gap-5">
          <Button label="Deny" kind="secondary" rounded={true} className="flex-1" />
          <Button label="Approve" rounded={true} className="flex-1" />
        </div>
      </div>
    </>
  );
}
