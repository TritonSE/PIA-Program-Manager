import { Dispatch, SetStateAction, useEffect } from "react";

import { AccountTypes } from "../TeamAccounts";

import { User, editAccountType, editArchiveStatus } from "@/api/user";

type UseHandleAccountArchiveProps = {
  firebaseToken: string;
  allAccounts: User[];
  setAllAccounts: Dispatch<SetStateAction<User[]>>;
  setFilteredAccounts: Dispatch<SetStateAction<User[]>>;
  accountType: AccountTypes;
};

export const useHandleAccountArchive = ({
  firebaseToken,
  allAccounts,
  setAllAccounts,
  setFilteredAccounts,
  accountType,
}: UseHandleAccountArchiveProps) => {
  useEffect(() => {
    const tempAccounts = allAccounts.filter((account) => {
      if (account.accountType === "admin") return false;
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
            setAllAccounts((prev) => {
              return prev.map((account) => {
                if (account._id === result.data._id) {
                  return { ...account, archived: true };
                }
                return account;
              });
            });
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
            console.log("Updated user account type", result.data);
            setAllAccounts((prev) => {
              return prev.map((account) => {
                if (account._id === result.data._id) {
                  return { ...account, accountType: "admin" };
                }
                return account;
              });
            });
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

  return { handleAccountUpdate, handleArchive };
};
