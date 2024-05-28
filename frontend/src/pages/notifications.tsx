import NotificationTable from "@/components/NotificationCard/NotificationTable";
import RenewalTable from "@/components/NotificationCard/RenewalTable";
import { useRedirectTo404IfNotAdmin, useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export default function Notifications() {
  useRedirectToLoginIfNotSignedIn();
  useRedirectTo404IfNotAdmin();
  return (
    <main>
      <div className="my-[30px] ml-[20px] mr-[80px] space-y-[20px]">
        <div className="mb-[60px] font-[alternate-gothic] text-4xl text-[40px] uppercase">
          Notifications
        </div>
        <div className="text-2x2 font-['Poppins-Bold'] text-[24px] font-bold">
          New Account Creations
        </div>
        <div className="font-[Poppins] text-[16px]">
          Review information of new account creations below to approve or deny them.{" "}
        </div>
        <NotificationTable />
        <div className="text-2x2 pt-[60px] font-['Poppins-Bold'] text-[24px] font-bold">
          Upcoming Student End Dates in Programs
        </div>
        <div className="font-[Poppins] text-[16px]">
          The enrollment end dates for following students are approaching. Please visit their
          student profiles to add new programs.{" "}
        </div>
        <RenewalTable />
      </div>
    </main>
  );
}
