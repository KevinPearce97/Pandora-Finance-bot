import React from "react";
import { twJoin } from "tailwind-merge";

const HeaderWrapper: React.FC<HeaderWrapperProps> = ({ children }) => {
  return (
    <div className={twJoin("h-16 w-full", "fixed top-0")}>
      <div className="center-vertical-root h-16">
        <div
          className={twJoin("w-full px-6", "flex justify-between items-center")}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default HeaderWrapper;

interface HeaderWrapperProps {
  children: React.ReactNode;
}
