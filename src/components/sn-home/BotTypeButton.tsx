"use client";
import React from "react";
import { twJoin } from "tailwind-merge";
import { BotTypeEnum } from "@/models";
import { useAppContext } from "@/context";
import { SelectButton } from "@/components/common";

const BotTypeButton = () => {
  const { selectedBotType, setSelectedBotType } = useAppContext();

  return (
    <div
      className={twJoin(
        "p-1",
        "rounded-full",
        "w-[300px] h-fit",
        "border border-characterStrokeBet",
        "flex items-center justify-between"
      )}
    >
      <SelectButton
        className={twJoin("w-1/2", "border-none", "text-sm", "rounded-full")}
        isSelected={selectedBotType === BotTypeEnum.CONSECUTIVE}
        onClick={() => setSelectedBotType(BotTypeEnum.CONSECUTIVE)}
      >
        Consecutive
      </SelectButton>

      <SelectButton
        className={twJoin("w-1/2", "border-none", "text-sm", "rounded-full")}
        isSelected={selectedBotType === BotTypeEnum.DIFFERENCERATE}
        onClick={() => setSelectedBotType(BotTypeEnum.DIFFERENCERATE)}
      >
        Difference Rate
      </SelectButton>
    </div>
  );
};

export default BotTypeButton;
