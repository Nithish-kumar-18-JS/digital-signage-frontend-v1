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
      <div className="min-h-screen flex">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div
          className={clsx(
            "flex-1 transition-all duration-500",
            isOpen ? "ml-74" : "ml-20"
          )}
        >
          <Header open={isOpen}/>
          <main>{children}</main>
        </div>
      </div>
    </ThemeProvider>
    </Provider>
  );
}
