import React, { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

const CommonInput: React.FC<CommonInputProps> = ({
  className,
  isError = false,
  directionText = InputDirectionEnum.Left,
  ...otherProps
}) => {
  return (
    <input
      className={twMerge(
        "w-64 h-12 px-4",
        "text-sm font-inter",
        "border border-solid rounded-lg",
        "outline-none focus-visible:outline-none",
        isError ? "text-error1" : "text-neutral5",
        isError ? "border-error1" : "border-neutral4/60",
        directionText === InputDirectionEnum.Right && "text-right",
        isError
          ? "focus-within:border-error1"
          : "focus-within:border-neutral4/60",
        className
      )}
      {...otherProps}
    />
  );
};

export default CommonInput;

interface CommonInputProps extends ComponentPropsWithRef<"input"> {
  isError?: boolean;
  directionText?: InputDirectionEnum;
}

export enum InputDirectionEnum {
  Right = "right",
  Left = "left",
}
