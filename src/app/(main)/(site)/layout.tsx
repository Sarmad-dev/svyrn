import Header from "@/components/layout/header/header";
import LeftSideBar from "@/components/layout/sidebar/sidebar";
import React from "react";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full min-h-screen">
      <Header />
      <div className="w-full sm:min-h-[100vh-64px] min-h-[100vh-56px]">
        <div className="container mt-5 max-md:mt-0 flex mx-auto">
          <div className="max-sm:hidden">
            <LeftSideBar />
          </div>
          <div className="flex-1">
            <div className="max-w-4xl max-2xl:max-w-3xl w-full mx-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SiteLayout;
