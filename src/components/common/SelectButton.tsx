import React from "react";
import { twMerge } from "tailwind-merge";
import CommonButton from "./CommonButton";

const SelectButton: React.FC<SelectButtonProps> = ({
  children,
  className,
  isSelected = false,
  ...otherProps
}) => {
  return (
    <CommonButton
      className={twMerge(
        "border rounded-lg",
        isSelected
          ? "bg-primary5 border-primary5 text-neutral1"
          : "bg-neutral2 border-neutral3 text-neutral5",
        className
      )}
      {...otherProps}
    >
      {children}
    </CommonButton>
  );
};

export default SelectButton;

export interface SelectButtonProps
  extends React.ComponentPropsWithRef<"button"> {
  isSelected?: boolean;
}
