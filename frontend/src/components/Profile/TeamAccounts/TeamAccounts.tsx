import { useContext, useState } from "react";

import TeamAccountsList from "./TeamAccountsList";

import { UserContext } from "@/contexts/user";
import { cn } from "@/lib/utils";
import { UserData } from "@/pages/profile";

const filterButtonStyle =
  "aria-current:bg-pia_dark_green aria-current:border-pia_dark_green aria-current:text-white border-[1px] border-[#909090] px-5 py-3";

type TeamAccountsProps = {
  userData: UserData;
};

export type AccountTypes = "current" | "archived";

export default function TeamAccounts({ userData }: TeamAccountsProps) {
  const { isAdmin } = useContext(UserContext);
  const [accountType, setAccountType] = useState<AccountTypes>("current");

  if (!isAdmin) return;

  return (
    <section>
      <h2 className="font-[alternate-gothic] text-4xl">Team Accounts</h2>
      <div className="sm:text-m pt-4 text-sm sm:pt-10">
        Manage the team accounts below by archiving or updating them to admin accounts.
      </div>
      <div className="my-5">
        <button
          onClick={() => {
            setAccountType("current");
          }}
          aria-current={accountType === "current"}
          className={cn(filterButtonStyle, "rounded-bl-md rounded-tl-md")}
        >
          Current
        </button>
        <button
          onClick={() => {
            setAccountType("archived");
          }}
          aria-current={accountType === "archived"}
          className={cn(filterButtonStyle, "rounded-br-md rounded-tr-md")}
        >
          Archived
        </button>
      </div>
      <TeamAccountsList accountType={accountType} userData={userData} />
    </section>
  );
}
