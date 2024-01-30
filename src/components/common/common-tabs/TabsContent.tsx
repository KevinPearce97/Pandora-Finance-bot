"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { Content, TabsContentProps } from "@radix-ui/react-tabs";

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className,
  ...otherProps
}) => {
  return (
    <Content value={value} className={twMerge("", className)} {...otherProps}>
      {children}
    </Content>
  );
};

export default TabsContent;
