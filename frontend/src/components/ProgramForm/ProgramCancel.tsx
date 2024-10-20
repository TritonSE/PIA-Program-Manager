import { Button } from "../Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../ui/dialog";

type cancelProps = {
  isMobile?: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: () => void;
};

export default function ProgramCancel({ isMobile = false, open, setOpen, onCancel }: cancelProps) {
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        {!isMobile ? (
          <Button
            label="Cancel"
            kind="secondary"
            type="button"
            onClick={() => {
              setOpen(true);
            }}
          />
        ) : (
          <div
            className="absolute flex pl-3 pt-4 text-sm text-neutral-400"
            onClick={() => {
              setOpen(true);
            }}
          >
            Cancel
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="h-auto max-w-[80%] rounded-[8px] sm:max-h-[40%] sm:w-auto sm:max-w-[50%]">
        <div className="p-3 min-[450px]:p-10">
          <div className="flex w-full justify-center">
            <div className="flex h-10 w-10 items-center rounded-full bg-destructive">
              <svg
                className="w-full"
                width="14"
                height="23"
                viewBox="0 0 12 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.39587 6.3333C3.39587 4.87518 4.7034 3.72888 6.00004 3.72888C7.29668 3.72888 8.60421 4.87518 8.60421 6.3333C8.60421 7.08559 8.42537 7.47963 8.23915 7.74343C8.01287 8.064 7.6959 8.31661 7.14587 8.72914L7.0909 8.77032C6.60135 9.13696 5.9092 9.65531 5.37457 10.4127C4.77953 11.2557 4.43754 12.2939 4.43754 13.625C4.43754 14.4879 5.13709 15.1875 6.00004 15.1875C6.86298 15.1875 7.56254 14.4879 7.56254 13.625C7.56254 12.8727 7.74138 12.4786 7.92759 12.2148C8.15388 11.8943 8.47084 11.6417 9.02087 11.2291L9.07584 11.1879C9.5654 10.8213 10.2575 10.303 10.7922 9.54557C11.3872 8.7026 11.7292 7.66435 11.7292 6.3333C11.7292 3.00064 8.87007 0.603882 6.00004 0.603882C3.13001 0.603882 0.270874 3.00064 0.270874 6.3333C0.270874 7.19625 0.970429 7.8958 1.83337 7.8958C2.69632 7.8958 3.39587 7.19625 3.39587 6.3333Z"
                  fill="white"
                />
                <path
                  d="M6.00004 20.9166C7.15063 20.9166 8.08337 19.9839 8.08337 18.8333C8.08337 17.6827 7.15063 16.75 6.00004 16.75C4.84945 16.75 3.91671 17.6827 3.91671 18.8333C3.91671 19.9839 4.84945 20.9166 6.00004 20.9166Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <p className="mb-1 mt-5 text-center text-base font-bold sm:text-xl">
            Are you sure you want to leave?
          </p>
          <p className="font-base mb-6 text-center text-sm sm:text-base">
            Your changes will not be saved
          </p>
          <div className="grid gap-6 min-[450px]:flex min-[450px]:justify-center">
            <DialogClose asChild>
              <Button
                label="Back"
                kind="destructive-secondary"
                onClick={() => {
                  setOpen(false);
                }}
              />
            </DialogClose>
            <DialogClose asChild>
              <Button label="Leave" kind="destructive" onClick={onCancel} />
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
