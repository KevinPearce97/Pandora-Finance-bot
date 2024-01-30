"use client";

import React from "react";

import { twJoin } from "tailwind-merge";

import HeaderWrapper from "./HeaderWrapper";

const LargeHeader = () => {
  return (
    <HeaderWrapper>
      <div className="center-vertical-root gap-x-2">
        <p className={twJoin("font-inter", "text-base text-neutral3")}>
          BOT SUI
        </p>
      </div>
    </HeaderWrapper>
  );
};

export default LargeHeader;
