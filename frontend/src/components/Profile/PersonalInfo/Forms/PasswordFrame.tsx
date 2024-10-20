import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { cn } from "../../../../lib/utils";
import { FrameProps } from "../../../../pages/profile";
import { Button } from "../../../Button";
import { Textfield } from "../../../Textfield";
import { Dialog, DialogTrigger } from "../../../ui/dialog";

import ProfileDialogContent from "./ProfileDialogContent";

import { editLastChangedPassword } from "@/api/user";

type PasswordFrameProps = {
  passwordLength: number;
  data: PasswordLastChangedData;
  setData: React.Dispatch<React.SetStateAction<PasswordLastChangedData>>;
  firebaseToken: string;
} & FrameProps;

type PasswordLastChangedData = {
  last_changed: Date | null;
};

type OldPasswordFormData = {
  old_password: string;
};

//This is only used to initialize the textfields. PasswordLastChangedData is used to try to avoid storing the password in state
type NewPasswordFormData = PasswordLastChangedData & {
  new_password: string;
  confirm_password: string;
};

export function PasswordFrame({
  className,
  passwordLength,
  frameFormat,
  data,
  setData,
  firebaseToken,
}: PasswordFrameProps) {
  const [openPasswordForm, setOpenPasswordForm] = useState(false);
  const [clickedContinue, setClickedContinue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const {
    register: oldPasswordRegister,
    reset: resetOldForm,
    handleSubmit: handleOldSubmit,
  } = useForm<OldPasswordFormData>();
  const {
    register: newPasswordRegister,
    reset: resetNewForm,
    handleSubmit: handleNewSubmit,
  } = useForm<NewPasswordFormData>();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (clickedContinue) {
      setPasswordError("");
    }
  }, [clickedContinue]);

  const onOldPasswordSubmit = (formData: OldPasswordFormData) => {
    setLoading(true);
    console.log("formData", formData);
    if (formData.old_password.length === 0) {
      setPasswordError("Please enter your password");
      setLoading(false);
      return;
    }

    if (user?.email) {
      const credential = EmailAuthProvider.credential(user.email, formData.old_password);
      reauthenticateWithCredential(user, credential)
        .then(() => {
          // User re-authenticated.
          setLoading(false);
          setClickedContinue(true);
          resetOldForm();
        })
        .catch((error) => {
          console.log(error);
          setPasswordError("Incorrect password");
          setLoading(false);
        });
    }
  };

  const onNewPasswordSubmit = (formData: NewPasswordFormData) => {
    if (formData.new_password !== formData.confirm_password) {
      setPasswordError("Passwords don't match!");
      return;
    }
    if (formData.new_password.length < 6) {
      setPasswordError("Password must have a minimum length of 6 characters.");
      return;
    }
    if (user) {
      //Add password and last_changed to database
      updatePassword(user, formData.new_password)
        .then(() => {
          // Update successful.
          setOpenPasswordForm(false);
          setClickedContinue(false);
          resetNewForm();
          editLastChangedPassword(firebaseToken)
            .then((res) => {
              if (res.success) {
                setData({ last_changed: new Date(res.data) });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  let formattedDate = null;
  if (data.last_changed) {
    const lastChanged = new Date(data.last_changed);
    formattedDate = `${lastChanged.toLocaleString("default", { month: "short" })} ${lastChanged.getDate()}, ${lastChanged.getFullYear()}`;
  }

  return (
    <section className={cn(frameFormat, className)}>
      {/*Info header*/}
      <div className=" ml-3 flex pb-2 pt-6 text-base sm:ml-10 sm:pt-8 sm:text-xl lg:text-2xl">
        Password
      </div>
      {/*Info Fields */}
      <Dialog open={openPasswordForm} onOpenChange={setOpenPasswordForm}>
        <DialogTrigger asChild>
          <div className=" flex-grow cursor-pointer py-6 text-xs hover:bg-[#e7f0f0] sm:text-base">
            <div className="ml-3 flex h-full w-auto flex-row pr-5 sm:ml-14 ">
              <div className="flex w-1/3 flex-none items-center sm:w-1/5 ">
                {"\u2022".repeat(passwordLength)}
              </div>
              <div className="flex flex-grow items-center">
                Last changed {formattedDate ? formattedDate : ""}
              </div>
              <Image
                src="../caretright.svg"
                alt="caretright"
                className="mx-7 flex w-[7px] items-center sm:mx-11"
                height={0}
                width={0}
              />
            </div>
          </div>
        </DialogTrigger>
        <ProfileDialogContent
          title={clickedContinue ? "Password" : "To continue, first verify it’s you"}
          backIcon={clickedContinue}
          onBackClick={() => {
            setClickedContinue(false);
            setPasswordError("");
          }}
        >
          {clickedContinue ? (
            <form onSubmit={handleNewSubmit(onNewPasswordSubmit)} className="grid gap-5">
              <fieldset>
                <legend>Enter New Password</legend>
                <Textfield
                  className="mt-1"
                  type="password"
                  name="new_password"
                  placeholder="Enter Password"
                  register={newPasswordRegister}
                />
              </fieldset>
              <fieldset>
                <legend>Confirm New Password</legend>
                <Textfield
                  className="mt-1"
                  type="password"
                  name="confirm_password"
                  placeholder="Enter Password"
                  register={newPasswordRegister}
                />
              </fieldset>
              {passwordError ? (
                <p className="flex items-center  text-sm text-red-500">
                  <span>
                    <AlertCircle className="mr-1 w-[1.5em]" aria-hidden="true" />
                  </span>
                  {passwordError}
                </p>
              ) : (
                ""
              )}
              <Button label="Change Password" className="ml-auto mt-8 block" />
            </form>
          ) : (
            // Verify old password
            <form onSubmit={handleOldSubmit(onOldPasswordSubmit)}>
              <p>Old Password</p>
              <Textfield
                className="mt-1"
                type="password"
                name="old_password"
                placeholder="Enter Password"
                register={oldPasswordRegister}
              />
              {passwordError ? (
                <p className="flex items-center pt-3 text-sm text-red-500">
                  <span>
                    <AlertCircle className="mr-1 w-[1.5em]" aria-hidden="true" />
                  </span>
                  {passwordError}
                </p>
              ) : (
                ""
              )}

              {loading ? (
                <div role="status" className="grid place-items-center">
                  <svg
                    aria-hidden="true"
                    className="mt-5 h-8 w-8 animate-spin fill-pia_dark_green text-gray-200 dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              ) : (
                ""
              )}
              <Button label="Continue" className="ml-auto mt-8 block" />
            </form>
          )}
        </ProfileDialogContent>
      </Dialog>
    </section>
  );
}
