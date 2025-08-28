"use client";

import { useState } from "react";
import clsx from "clsx";
import Header from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        {/* Show on mobile & tablet */}
        <div className="min-h-screen flex md:hidden items-center justify-center bg-black px-4">
          <h1 className="text-2xl font-bold text-white text-center">
            Digital Signage doesn't support mobile devices. <br /> Please use a
            Desktop or Laptop.
          </h1>
        </div>

        {/* Show on desktop only */}
        <div className="min-h-screen hidden md:flex">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          <div
            className={clsx(
              "flex-1 transition-all duration-500",
              isOpen ? "ml-74" : "ml-20"
            )}
          >
            <Header open={isOpen} />
            <main>{children}</main>
          </div>
        </div>
      </ThemeProvider>
    </Provider>

  );
}
