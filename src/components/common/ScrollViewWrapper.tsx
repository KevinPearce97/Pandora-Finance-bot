import React, { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

const ScrollViewWrapper: React.FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  children,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        "flex flex-col",
        "w-full h-full max-h-full",
        "overflow-x-hidden overflow-y-auto",
        className
      )}
      {...otherProps}
    >
      {children}
    </div>
  );
};

export default ScrollViewWrapper;
