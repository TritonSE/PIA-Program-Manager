import { useEffect, useState } from "react";

import ArchiveIcon from "../../../../public/icons/archive.svg";
import GreenCheckMarkIcon from "../../../../public/icons/green_check_mark.svg";

import { User, editAccountType, editArchiveStatus, getAllTeamAccounts } from "@/api/user";
import { Button } from "@/components/Button";
import ModalConfirmation from "@/components/Modals/ModalConfirmation";
import { UserData } from "@/pages/profile";

type TeamAccountsListProps = {
  accountType: string;
  userData: UserData;
};

export default function TeamAccountsList({ accountType, userData }: TeamAccountsListProps) {
  const { firebaseUser } = userData;
  const [firebaseToken, setFirebaseToken] = useState<string>("");
  const [allAccounts, setAllAccounts] = useState<User[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<User[]>([]);

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser
        ?.getIdToken()
        .then((token) => {
          getAllTeamAccounts(token).then(
            (result) => {
              setFirebaseToken(token);
              if (result.success) {
                console.log("Fetched all users", result.data);
                setAllAccounts(result.data);
                setFilteredAccounts(result.data);
              } else {
                console.error(result.error);
              }
            },
            (error) => {
              console.error(error);
            },
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [firebaseUser]);

  useEffect(() => {
    const tempAccounts = allAccounts.filter((account) => {
      if (accountType === "current") {
        return !account.archived;
      } else if (accountType === "archived") {
        return account.archived;
      }
      return true;
    });
    setFilteredAccounts(tempAccounts);
  }, [accountType, allAccounts]);

  const handleArchive = (accountId: string) => {
    editArchiveStatus(accountId, firebaseToken)
      .then(
        (result) => {
          if (result.success) {
            console.log("Archived user", result.data);
          } else {
            console.error(result.error);
          }
        },
        (error) => {
          console.error(error);
        },
      )
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAccountUpdate = (accountId: string) => {
    editAccountType(accountId, firebaseToken)
      .then(
        (result) => {
          if (result.success) {
            console.log("Updated user", result.data);
          } else {
            console.error(result.error);
          }
        },
        (error) => {
          console.error(error);
        },
      )
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <ul
      className={`${filteredAccounts.length > 0 ? "border-[2px]" : ""} overflow-hidden rounded-lg border-pia_neutral_gray`}
    >
      {filteredAccounts.map((account) => {
        return (
          <li
            key={account._id}
            className="relative items-center justify-between bg-white px-8 py-12 before:absolute
            before:bottom-0 before:left-0 before:h-[1px] before:w-full before:bg-[#B4B4B4] before:content-[''] last:before:hidden
            sm:flex"
          >
            <div className="mb-5 sm:mb-0">
              <h3 className="font-bold">Name: {account.name}</h3>
              <p>Email: {account.email}</p>
              <p>Account Type: Team</p>
            </div>
            <div className="flex gap-5">
              {accountType === "current" ? (
                <>
                  <ModalConfirmation
                    icon={<ArchiveIcon />}
                    triggerElement={
                      <Button label="Archive" kind="secondary" rounded={true} className="flex-1" />
                    }
                    title="Archive this account?"
                    description={`It will be moved to the 'Archived' accounts tab`}
                    cancelText="Cancel"
                    confirmText="Archive"
                    onConfirmClick={() => {
                      handleArchive(account._id);
                    }}
                    kind="destructive"
                  />
                  <ModalConfirmation
                    icon={<GreenCheckMarkIcon />}
                    triggerElement={<Button label="Update" rounded={true} className="flex-1" />}
                    title="Update this team account to admin?"
                    cancelText="Cancel"
                    confirmText="Update"
                    onConfirmClick={() => {
                      handleAccountUpdate(account._id);
                    }}
                    kind="primary"
                  />
                </>
              ) : (
                ""
              )}{" "}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
