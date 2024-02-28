import { DialogClose, DialogContent } from "../ui/dialog";

type ProfileDialogProps = {
  children: React.ReactNode;
  title: string;
  description: string;
};

export default function ProfileDialogContent({ children, title, description }: ProfileDialogProps) {
  return (
    <DialogContent className="max-h-[95%] max-w-[90%] rounded-[13px] sm:max-w-[500px]">
      <div className="grid gap-5 px-[40px] py-[30px]">
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
        <h2 className="text-xl sm:text-2xl ">{title}</h2>
        <p>{description}</p>
        {children}
      </div>
    </DialogContent>
  );
}
