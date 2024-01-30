import React, { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

const PageHeaderWrapper: React.FC<PageHeaderWrapperProps> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        "p-4",
        "w-full h-21",
        "flex items-center",
        "border-b border-black200",
        className
      )}
      {...otherProps}
    >
      {children}
    </div>
  );
};

export default PageHeaderWrapper;

interface PageHeaderWrapperProps extends ComponentPropsWithoutRef<"div"> {}
