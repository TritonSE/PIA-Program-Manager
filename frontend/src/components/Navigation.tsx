import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const navigation = [
  {
    title: "Home",
    href: "/",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="inherit"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.743 12.331L12.743 2.33103C12.364 1.90903 11.636 1.90903 11.257 2.33103L2.25698 12.331C2.12744 12.4746 2.04241 12.6528 2.01223 12.8438C1.98205 13.0348 2.00802 13.2305 2.08698 13.407C2.24698 13.768 2.60498 14 2.99998 14H4.99998V21C4.99998 21.2652 5.10534 21.5196 5.29288 21.7071C5.48041 21.8947 5.73477 22 5.99998 22H8.99998C9.2652 22 9.51955 21.8947 9.70709 21.7071C9.89463 21.5196 9.99998 21.2652 9.99998 21V17H14V21C14 21.2652 14.1053 21.5196 14.2929 21.7071C14.4804 21.8947 14.7348 22 15 22H18C18.2652 22 18.5196 21.8947 18.7071 21.7071C18.8946 21.5196 19 21.2652 19 21V14H21C21.1937 14.0009 21.3834 13.9453 21.546 13.8402C21.7087 13.735 21.8372 13.5848 21.916 13.4079C21.9947 13.231 22.0203 13.035 21.9896 12.8438C21.9589 12.6525 21.8732 12.4744 21.743 12.331Z"
          fill="inherit"
        />
      </svg>
    ),
  },
  {
    title: "Programs",
    href: "/programs",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="inherit"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.55 22C8.08333 22 7.675 21.8583 7.325 21.575C6.975 21.2917 6.74167 20.925 6.625 20.475L5.5 16H18.5L17.375 20.475C17.2583 20.925 17.025 21.2917 16.675 21.575C16.325 21.8583 15.9167 22 15.45 22H8.55ZM12 8.00001C12 6.50001 12.5083 5.20001 13.525 4.10001C14.5417 3.00001 15.8083 2.33334 17.325 2.10001C17.4083 2.08334 17.4833 2.09167 17.55 2.12501C17.6167 2.15834 17.6833 2.20001 17.75 2.25001C17.8167 2.30001 17.8627 2.36234 17.888 2.43701C17.9133 2.51167 17.9173 2.59101 17.9 2.67501C17.7167 3.99167 17.1793 5.13734 16.288 6.11201C15.3967 7.08667 14.3007 7.68267 13 7.90001V10H20C20.2833 10 20.521 10.096 20.713 10.288C20.905 10.48 21.0007 10.7173 21 11V13C21 13.55 20.8043 14.021 20.413 14.413C20.0217 14.805 19.5507 15.0007 19 15H5C4.45 15 3.97933 14.8043 3.588 14.413C3.19667 14.0217 3.00067 13.5507 3 13V11C3 10.7167 3.096 10.4793 3.288 10.288C3.48 10.0967 3.71733 10.0007 4 10H11V7.90001C9.7 7.68334 8.60433 7.08767 7.713 6.11301C6.82167 5.13834 6.284 3.99234 6.1 2.67501C6.08333 2.59167 6.08767 2.51267 6.113 2.43801C6.13833 2.36334 6.184 2.30067 6.25 2.25001C6.31667 2.20001 6.38333 2.15834 6.45 2.12501C6.51667 2.09167 6.59167 2.08334 6.675 2.10001C8.19167 2.33334 9.45833 3.00001 10.475 4.10001C11.4917 5.20001 12 6.50001 12 8.00001Z"
          fill="inherit"
        />
      </svg>
    ),
  },
  {
    title: "Profile",
    href: "/profile",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="inherit"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7C16 8.06087 15.5786 9.07828 14.8284 9.82843C14.0783 10.5786 13.0609 11 12 11C10.9391 11 9.92172 10.5786 9.17157 9.82843C8.42143 9.07828 8 8.06087 8 7ZM8 13C6.67392 13 5.40215 13.5268 4.46447 14.4645C3.52678 15.4021 3 16.6739 3 18C3 18.7956 3.31607 19.5587 3.87868 20.1213C4.44129 20.6839 5.20435 21 6 21H18C18.7956 21 19.5587 20.6839 20.1213 20.1213C20.6839 19.5587 21 18.7956 21 18C21 16.6739 20.4732 15.4021 19.5355 14.4645C18.5979 13.5268 17.3261 13 16 13H8Z"
          fill="inherit"
        />
      </svg>
    ),
  },
];

function Navigation({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [offset, setOffset] = React.useState(0);

  useEffect(() => {
    const ordering = navigation.map((item) => item.href);
    const idx = ordering.indexOf(router.pathname) | 0;
    setOffset(idx * 68);
  }, [router.pathname]);

  return (
    <main className="flex h-screen w-full">
      <nav className="h-full w-[240px] pt-16 bg-primaryDarkGreen text-accentGreen">
        <Link href="/" className="flex gap-2 pl-8 pr-8 mb-12 items-center justify-between">
          <img width="40px" height="40px" src="./logo.png" />
          <h1 className="text-white text-2xl font-[alternate-gothic]">PLANT IT AGAIN</h1>
        </Link>
        <div className="flex flex-col gap-7 relative">
          <div
            className="w-2 h-10 rounded-tr-lg rounded-br-lg absolute bg-[white]"
            style={{ top: offset, transition: "0.2s all" }}
          ></div>
          {navigation.map((item, i) => {
            return (
              <Link
                href={item.href}
                className="flex gap-4 fill-accentGreen items-center pl-8 pr-8 h-10"
                key={i}
                style={router.pathname === item.href ? { fill: "white" } : {}}
              >
                {item.icon}
                <div style={router.pathname === item.href ? { color: "white" } : {}}>
                  {item.title}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="p-[24px]">{children}</div>
    </main>
  );
}

export default Navigation;
