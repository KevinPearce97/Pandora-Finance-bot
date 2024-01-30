import React, { ComponentPropsWithRef, useMemo } from "react";
import { twMerge } from "tailwind-merge";

const CommonButton: React.FC<CommonButtonProps> = ({
  variant = CommonButtonVariantEnum.Primary,
  children,
  disabled,
  className,
  ...otherProps
}) => {
  const buttonBackgroundColor = useMemo(() => {
    switch (variant) {
      case CommonButtonVariantEnum.Primary:
        return "bg-primary5";
      case CommonButtonVariantEnum.Success:
        return "bg-characterUp";
      case CommonButtonVariantEnum.Error:
        return "bg-characterDown";
      default:
        return "";
    }
  }, [variant]);

  return (
    <button
      className={twMerge(
        "text-neutral1",
        "py-2 px-4 rounded",
        "font-inter font-medium",
        disabled && "opacity-40",
        buttonBackgroundColor,
        className
      )}
      disabled={disabled}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default CommonButton;

export interface CommonButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: CommonButtonVariantEnum;
}

export enum CommonButtonVariantEnum {
  Primary = "primary",
  Success = "success",
  Error = "error",
}
