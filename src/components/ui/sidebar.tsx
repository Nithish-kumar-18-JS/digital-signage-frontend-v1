"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LucideChevronLeftCircle, LucideChevronRightCircle } from "lucide-react";
import clsx from "clsx";

export const Sidebar = ({isOpen,setIsOpen}: {isOpen: boolean,setIsOpen: (value: boolean) => void}) => {
  const pathname = usePathname();
 

  const navLinks = [
    { name: "Dashboard", href: "/", icon: "/icons/dashboard.png" },
    { name: "Media Library", href: "/media", icon: "/icons/media.png" },
    { name: "Playlists", href: "/playlists", icon: "/icons/playlist.png" },
    { name: "Screens", href: "/screens", icon: "/icons/screens.png" },
    { name: "Schedule", href: "/schedule", icon: "/icons/schedule.png" },
    { name: "Users", href: "/users", icon: "/icons/users.png" }
  ];

  return (
    <aside
      className={clsx(
        "h-screen fixed top-0 left-0 z-10 border-r border-gray-100 dark:border-gray-600 bg-white dark:bg-black flex flex-col transition-all duration-500 ease-in-out",
        isOpen ? "w-74" : "w-20"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-gray-600 overflow-hidden">
        {isOpen && <h1
          className={clsx(
            "text-xl font-semibold dark:text-white whitespace-nowrap transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          Digital Signage
        </h1>}
        {!isOpen && <span className="text-xl font-semibold dark:text-white">DS</span>}
      </div>
      {/* Navigation */}
      <nav
        className={clsx(
          "mt-5 flex-1 border-b border-gray-100 dark:border-gray-600",
          isOpen ? "mx-5" : "mx-3 w-[50px]"
        )}
      >
        {navLinks.map(({ name, href, icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={name} href={href}>
              <div
                className={clsx(
                  "flex items-center p-4 rounded mt-4 cursor-pointer transition-colors duration-200",
                  "hover:bg-gray-100 hover:text-black dark:hover:bg-gray-600 dark:hover:text-white",
                  isActive && "bg-red-400 text-white dark:bg-red-400 dark:text-white"
                )}
              >
                {/* Fixed-size icon container */}
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <Image src={icon} alt={name} width={24} height={24} />
                </div>
                <span
                  className={clsx(
                    "whitespace-nowrap transition-opacity duration-300 overflow-hidden",
                    isOpen ? "opacity-100 ml-2" : "opacity-0 w-0"
                  )}
                >
                  {name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>


      {/* Footer */}
      <div
        className={clsx(
          "h-16 flex items-center justify-center border-t border-gray-100 dark:border-gray-600",
          isOpen ? "px-5" : ""
        )}
      >
        <div className="flex items-center p-4 hover:bg-gray-100 rounded w-full cursor-pointer dark:hover:bg-gray-600 dark:hover:text-white">
          <Image src="/icons/logout.png" alt="Logout" width={24} height={24} className="mr-2" />
          <span
            className={clsx(
              "dark:text-white whitespace-nowrap transition-opacity duration-300 overflow-hidden",
              isOpen ? "opacity-100" : "opacity-0 w-0"
            )}
          >
            Logout
          </span>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-8 bg-white dark:bg-black rounded-full shadow p-1 cursor-pointer hover:scale-105 transition-transform"
      >
        {isOpen ? (
          <LucideChevronLeftCircle className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <LucideChevronRightCircle className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>
    </aside>
  );
};
