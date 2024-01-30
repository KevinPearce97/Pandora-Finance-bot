import React, { ComponentPropsWithoutRef } from "react";
import { DateUtils } from "@/utils";
import { ImageAssets } from "public";
import { twJoin } from "tailwind-merge";
import { useCountdownByTimestamp } from "@/hooks/common-hooks";
import Image from "next/image";

const LiveRoundTimer: React.FC<LiveRoundTimerProps> = ({
  endTime,
  roundTime,
  className,
  onTimeRemainOver,
  ...otherProps
}) => {
  const timeRemain = useCountdownByTimestamp(endTime, () => {
    onTimeRemainOver();
  });

  return (
    <div
      className={twJoin(
        "p-2",
        "gap-x-2",
        "bg-white",
        "font-inter",
        "w-auto h-12",
        "rounded-full",
        "min-w-[140px]",
        "flex items-center",
        "border border-characterStrokeBet",
        className
      )}
      {...otherProps}
    >
      <Image
        width={32}
        height={32}
        alt="Clock timer"
        src={ImageAssets.PinkClockImage}
      />

      <p className="font-inter font-semibold text-neutral7 text-lg">
        {DateUtils.convertSecondsToMinuteSecond(timeRemain || 0)}
      </p>

      <p className="font-inter text-xs text-neutral6">
        {Number(roundTime || 0) / 60}m
      </p>
    </div>
  );
};

export default LiveRoundTimer;

interface LiveRoundTimerProps extends ComponentPropsWithoutRef<"div"> {
  endTime?: number;
  roundTime: number;
  onTimeRemainOver: () => void;
}
