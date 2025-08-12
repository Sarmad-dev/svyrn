import AuthBottomSheet from "@/components/auth/auth-bottom-sheet";
import Ellipses from "@/components/auth/Ellipses";
import Side from "@/components/auth/Side";
import Image from "next/image";
import React from "react";

interface AuthProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthProps) => {
  return (
    <main className="w-full h-screen flex">
      <div className="flex items-center justify-center px-20 max-md:hidden">
        <Side />
        <Ellipses />
      </div>
      <div className="flex flex-col gap-3 h-full bg-[#AFC2D0] w-[1200px] items-center max-md:hidden">
        <div className="2xl:w-[364px] 2xl:h-[655px] w-[264px] h-[475px] relative">
          <Image src="/images/device.png" alt="device" fill />
        </div>
        {children}
      </div>
      <div className="md:hidden flex flex-col h-screen w-full">
        <div className="w-full flex-1 flex items-center justify-center">
          {children}
        </div>
        <AuthBottomSheet />
      </div>
    </main>
  );
};

export default AuthLayout;
