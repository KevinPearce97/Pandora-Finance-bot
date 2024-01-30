"use client";
import React from "react";
import { twJoin } from "tailwind-merge";
import { TokenPoolEnum } from "@/models";
import { useAppContext } from "@/context";
import { SelectButton } from "@/components/common";

const TokenPoolButton = () => {
  const { selectedPool, setSelectedPool } = useAppContext();

  return (
    <div
      className={twJoin(
        "p-1",
        "rounded-full",
        "w-[240px] h-fit",
        "border border-characterStrokeBet",
        "flex items-center justify-between"
      )}
    >
      <SelectButton
        className={twJoin("w-1/2", "border-none", "text-sm", "rounded-full")}
        isSelected={selectedPool === TokenPoolEnum.SUI_POOL}
        onClick={() => setSelectedPool(TokenPoolEnum.SUI_POOL)}
      >
        SUI
      </SelectButton>

      <SelectButton
        className={twJoin("w-1/2", "border-none", "text-sm", "rounded-full")}
        disabled
      >
        SCB (Soon)
      </SelectButton>
    </div>
  );
};

export default TokenPoolButton;
