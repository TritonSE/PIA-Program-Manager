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
          <DialogClose className="w-fit py-2">
            <svg
              className="transition-opacity hover:opacity-50"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.88388 1.11612C2.39573 0.627961 1.60427 0.627961 1.11612 1.11612C0.627961 1.60427 0.627961 2.39573 1.11612 2.88388L5.23223 7L1.11612 11.1161C0.627961 11.6043 0.627961 12.3957 1.11612 12.8839C1.60427 13.372 2.39573 13.372 2.88388 12.8839L7 8.76777L11.1161 12.8839C11.6043 13.372 12.3957 13.372 12.8839 12.8839C13.372 12.3957 13.372 11.6043 12.8839 11.1161L8.76777 7L12.8839 2.88388C13.372 2.39573 13.372 1.60427 12.8839 1.11612C12.3957 0.627962 11.6043 0.627962 11.1161 1.11612L7 5.23223L2.88388 1.11612Z"
                fill="#484848"
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
