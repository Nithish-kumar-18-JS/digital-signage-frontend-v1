"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./modeToggle";
import clsx from "clsx";

interface HeaderProps {
  open: boolean;
}

export default function Header({ open }: HeaderProps) {
  const pathname = usePathname();
  const header =
    pathname === "/"
      ? "Dashboard"
      : pathname
          .slice(1)
          .charAt(0)
          .toUpperCase() + pathname.slice(2);

  return (
    <div className={clsx("h-16 px-3 lg:px-6 xl:px-10 fixed top-0 flex items-center justify-end bg-[#ffffff] dark:bg-[#191919] transition-colors duration-200", open ? "w-[calc(100%-200px)]" : "w-full")}>
      {/* Right-side controls */}
      <div className="flex w-full items-center gap-5 justify-end mr-[100px] ">
        <Image
          src="/icons/notification.png"
          alt="Notification"
          width={30}
          height={30}
          className="border border-[#dcdcdc] rounded-full p-1 cursor-pointer dark:border-gray-600"
        />
        <ModeToggle />
      </div>
    </div>
  );
}
