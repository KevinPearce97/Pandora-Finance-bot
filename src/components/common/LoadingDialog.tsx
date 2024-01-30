"use client";

import React, { useMemo } from "react";
import { ImageAssets } from "public";
import { twMerge } from "tailwind-merge";
import CommonDialog from "./common-dialog";
import Image from "next/image";

const LoadingDialog: React.FC<LoadingDialogProps> = ({
  status,
  isOpen,
  onClose,
  dialogTitle,
  statusTitle,
}) => {
  const statusIcon = useMemo(() => {
    switch (status) {
      case LoadingDialogEnum.Loading:
        return (
          <Image
            width={83}
            height={76}
            alt="Processing"
            src={ImageAssets.CalculatingAnimate}
          />
        );
      case LoadingDialogEnum.Error:
        return <Image width={83} height={76} alt="Error" src={""} />;
      case LoadingDialogEnum.Success:
        return <Image width={83} height={76} alt="Success" src={""} />;
      default:
        return <></>;
    }
  }, [status]);

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      dialogTitle={dialogTitle}
      contentClassName="h-72"
    >
      <div
        className={twMerge(
          "w-full h-full",
          "flex flex-col items-center justify-center"
        )}
      >
        {statusIcon}
        <p
          className={twMerge(
            "mt-3",
            "font-medium text-sm uppercase",
            status === LoadingDialogEnum.Loading
              ? "text-black500"
              : status === LoadingDialogEnum.Success
              ? "text-success500"
              : "text-error500"
          )}
        >
          {statusTitle}
        </p>
      </div>
    </CommonDialog>
  );
};

export default LoadingDialog;

interface LoadingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dialogTitle: string;
  statusTitle: string;
  status: LoadingDialogEnum;
}

export enum LoadingDialogEnum {
  Loading = "loading",
  Success = "success",
  Error = "error",
}
