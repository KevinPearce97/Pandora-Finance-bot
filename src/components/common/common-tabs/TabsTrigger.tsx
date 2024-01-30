"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { Trigger, TabsTriggerProps } from "@radix-ui/react-tabs";

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className,
  ...otherProps
}) => {
  return (
    <Trigger
      value={value}
      className={twMerge("px-2 py-1", "center-root", className)}
      {...otherProps}
    >
      {children}
    </Trigger>
  );
};

export default TabsTrigger;
