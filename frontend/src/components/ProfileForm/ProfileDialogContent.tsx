import { DialogClose, DialogContent } from "../ui/dialog";

type ProfileDialogProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  backIcon?: boolean;
  onBackClick?: () => void;
};

export default function ProfileDialogContent({
  children,
  title,
  description = "",
  backIcon = false,
  onBackClick,
}: ProfileDialogProps) {
  return (
    <DialogContent className="max-h-[95%] max-w-[90%] rounded-[13px] sm:max-w-[500px]">
      <div className="grid gap-5 px-[40px] py-[30px]">
        {backIcon ? (
          <svg
            className="cursor-pointer transition-opacity hover:opacity-50"
            onClick={onBackClick}
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.61612 14.1161C6.12796 14.6043 6.12796 15.3957 6.61612 15.8839L12.8661 22.1339C13.3543 22.622 14.1457 22.622 14.6339 22.1339C15.122 21.6457 15.122 20.8543 14.6339 20.3661L10.5178 16.25L22.5 16.25C23.1904 16.25 23.75 15.6904 23.75 15C23.75 14.3096 23.1904 13.75 22.5 13.75L10.5178 13.75L14.6339 9.63388C15.122 9.14573 15.122 8.35427 14.6339 7.86612C14.1457 7.37796 13.3543 7.37796 12.8661 7.86612L6.61612 14.1161Z"
              fill="#484848"
            />
          </svg>
        ) : (
          <DialogClose className="w-fit">
            <svg
              className="transition-opacity hover:opacity-50"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.8839 9.11612C10.3957 8.62796 9.60427 8.62796 9.11612 9.11612C8.62796 9.60427 8.62796 10.3957 9.11612 10.8839L13.2322 15L9.11612 19.1161C8.62796 19.6043 8.62796 20.3957 9.11612 20.8839C9.60427 21.372 10.3957 21.372 10.8839 20.8839L15 16.7678L19.1161 20.8839C19.6043 21.372 20.3957 21.372 20.8839 20.8839C21.372 20.3957 21.372 19.6043 20.8839 19.1161L16.7678 15L20.8839 10.8839C21.372 10.3957 21.372 9.60427 20.8839 9.11612C20.3957 8.62796 19.6043 8.62796 19.1161 9.11612L15 13.2322L10.8839 9.11612Z"
                fill="currentColor"
              />
            </svg>
          </DialogClose>
        )}
        <h2 className="text-xl sm:text-2xl ">{title}</h2>
        {description ? <p>{description}</p> : ""}
        {children}
      </div>
    </DialogContent>
  );
}
