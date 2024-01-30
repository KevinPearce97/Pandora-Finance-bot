"use client";

import React from "react";
import { twJoin } from "tailwind-merge";

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  return (
    <div className={twJoin("ml-0", "overflow-y-scroll", "h-full bg-white")}>
      {children}
    </div>
  );
};

export default ContentWrapper;

interface ContentWrapperProps {
  children: React.ReactNode;
}
