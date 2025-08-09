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
    <div className={clsx("h-16 px-3 lg:px-6 xl:px-10 fixed top-0 flex items-center justify-between bg-[#FAFAFA] dark:bg-[#222222] transition-colors duration-200", open ? "w-[calc(100%-200px)]" : "w-full")}>
      {/* Title */}
      <header className="text-xl font-semibold text-black dark:text-white">
        {header}
      </header>

      {/* Right-side controls */}
      <div className="flex items-center gap-5 mr-[100px]">
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
