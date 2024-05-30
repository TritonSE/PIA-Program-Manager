import { MouseEventHandler } from "react";

export default function AlertCard({
  message,
  open,
  onClose,
}: {
  message: string;
  open: boolean;
  onClose: MouseEventHandler;
}) {
  if (!open) return <></>;
  return (
    <div className="absolute bottom-0 left-0 flex min-h-12 w-full justify-center sm:min-h-16">
      <div className="z-20 flex max-h-8 min-w-[10%] max-w-[90%] items-center rounded-sm bg-black sm:max-h-12 sm:max-w-[40%]">
        <div className="flex max-w-full flex-row items-center overflow-hidden " onClick={onClose}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="m-4"
          >
            <path
              d="M1.70711 0.292894C1.31658 -0.0976312 0.683417 -0.0976312 0.292893 0.292894C-0.0976311 0.683418 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683418 9.70711 0.292894C9.31658 -0.0976301 8.68342 -0.0976301 8.29289 0.292894L5 3.58579L1.70711 0.292894Z"
              fill="White"
            />
          </svg>
          <p className="truncate pr-4 text-sm text-white sm:text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
}
