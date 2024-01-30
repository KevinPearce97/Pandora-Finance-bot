"use client";

import React, { ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { twJoin, twMerge } from "tailwind-merge";
import { Root, Portal, Overlay, Content } from "@radix-ui/react-dialog";

const CommonDialog: React.FC<CommonDialogProps> = ({
  isOpen,
  onClose,
  children,
  dialogTitle,
  titleClassName,
  headerClassName,
  overlayClassName,
  contentClassName,
}) => {
  return (
    <Root open={isOpen} onOpenChange={onClose}>
      <Portal>
        <Overlay
          className={twMerge(
            "z-20",
            "fixed top-0 left-0 right-0 bottom-0",
            "overflow-y-auto place-items-center bg-blackBlur",
            overlayClassName
          )}
        />
        <Content
          className={twMerge(
            "z-40",
            "font-inter",
            "animate-popUp",
            "bg-white1 shadow-2xl",
            "focus-visible:outline-none",
            "fixed top-1/2 left-1/2 py-6 px-4",
            "-translate-x-1/2 -translate-y-1/2",
            "w-[90vw] max-w-[360px] max-h-[8-vh]",
            "border	rounded-xl border-primary500/30",
            contentClassName
          )}
        >
          <div
            className={twMerge(
              "relative",
              "flex items-center justify-between",
              headerClassName
            )}
          >
            <p
              className={twMerge(
                "font-inter font-medium text-neutral7",
                titleClassName
              )}
            >
              {dialogTitle}
            </p>

            <CloseIcon
              className={twJoin("text-neutral5 cursor-pointer")}
              onClick={onClose}
            />
          </div>

          {children}
        </Content>
      </Portal>
    </Root>
  );
};

export default CommonDialog;

export interface CommonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  dialogTitle: string;

  titleClassName?: string;
  headerClassName?: string;
  overlayClassName?: string;
  contentClassName?: string;
}
