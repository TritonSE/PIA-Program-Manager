import NotificationTable from "@/components/NotificationCard/NotificationTable";
import { useRedirectTo404IfNotAdmin, useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";

export default function Notifications() {
  useRedirectToLoginIfNotSignedIn();
  useRedirectTo404IfNotAdmin();
  return (
    <main>
      <div className="space-y-[20px]">
        <div className="font-[alternate-gothic] text-4xl">Notifications</div>
        <div className="font-[Poppins] text-[16px]">
          Review information of new account creations below to approve or deny them.{" "}
        </div>
        <NotificationTable />
      </div>
    </main>
  );
}
