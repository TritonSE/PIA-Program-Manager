import CalendarTable from "@/components/CalendarTable/CalendarTable";
// import Back from '../../public/icons/back.svg'
// import { Calendar as C } from "@/components/Calendar/Calendar"
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/redirect";
// import { useWindowSize } from "@/hooks/useWindowSize";
// import { useMemo } from "react";

export default function Calendar() {
  useRedirectToLoginIfNotSignedIn();

  // const { windowSize } = useWindowSize();
  // const isMobile = useMemo(() => windowSize.width < 640, [windowSize.width]);
  // const isTablet = useMemo(() => windowSize.width < 1024, [windowSize.width]);
  // const extraLarge = useMemo(() => windowSize.width >= 2000, [windowSize.width]);

  // let mainClass = "h-full overflow-y-scroll no-scrollbar flex flex-col";
  // let headerClass = "mb-5 font-[alternate-gothic] text-2xl lg:text-4xl ";
  // let titleClass = "font-[alternate-gothic]";
  // const backButton = "flex space-x-0 text-lg";

  // if (isTablet) {
  //     titleClass += " text-2xl leading-none h-6";
  //     mainClass += " p-0";

  //     if (isMobile) {
  //       headerClass += " pt-2 pb-3";
  //     } else {
  //       headerClass += " p-2 py-4";
  //     }
  // } else {
  //     headerClass += "pt-10 pb-5";

  //     if (extraLarge) {
  //       headerClass += " max-w-[1740px]";
  //     } else {
  //       headerClass += " max-w-[1160px]";
  //     }
  // }

  return (
    // <main className={mainClass}>
    //     <div className={headerClass}>
    //         <div className={backButton}>
    //             <Back width="50" height="50" />
    //             {!isTablet && <p>Student List</p>}
    //         </div>
    //         <h1 className={titleClass}>
    //             Alice Anderson - UCI # 123456
    //         </h1>
    //     </div>

    //     <C />
    // </main>
    <CalendarTable />
  );
}
