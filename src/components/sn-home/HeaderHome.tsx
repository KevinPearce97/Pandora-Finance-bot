import React, { ComponentPropsWithRef, useEffect, useMemo } from "react";
import { TokenPoolButton } from ".";
import { AppService } from "@/services";
import { useAppContext } from "@/context";
import { twJoin, twMerge } from "tailwind-merge";
import LiveRoundTimer from "./LiveRoundTime";
import BotTypeButton from "./BotTypeButton";

const HeaderHome: React.FC<ComponentPropsWithRef<"div">> = ({
  className,
  ...otherProps
}) => {
  const {
    roundTime,
    selectedPair,
    selectedPool,
    currentEpoch,
    countdownTime,

    setPageNum,
    setRoundTime,
    setRoundsData,
    setCurrentEpoch,
    setCountdownTime,
  } = useAppContext();

  const endTime = useMemo(() => {
    if (!roundTime || !countdownTime) {
      return null;
    } else {
      return roundTime + countdownTime;
    }
  }, [roundTime, countdownTime]);

  const handleGetLiveRoundTime = async () => {
    const startTimestamp = await AppService.handleGetLiveRoundTime(
      currentEpoch,
      selectedPool,
      selectedPair
    );

    setCountdownTime(startTimestamp);
  };

  const handleGetRoundsData = async () => {
    setTimeout(async () => {
      const { roundsData, roundTime, currentEpoch } =
        await AppService.handleGetRoundInfo(selectedPair, selectedPool, 0);
      setRoundTime(roundTime);
      setRoundsData(roundsData);
      setCurrentEpoch(Number(currentEpoch));
      setPageNum(0);
    }, 3000);
  };

  useEffect(() => {
    if (!selectedPair || !selectedPool || currentEpoch <= 0) return;
    handleGetLiveRoundTime();
  }, [currentEpoch, selectedPair, selectedPool]);

  return (
    <div
      className={twMerge(
        "pb-3",
        "w-full h-fit",
        "flex flex-col items-center gap-y-2",
        className
      )}
      {...otherProps}
    >
      <p className="text-3xl font-extrabold text-primary5">Game: UP OR DOWN</p>
      <div className={twJoin("flex items-center gap-x-4")}>
        <LiveRoundTimer
          endTime={Number(endTime)}
          roundTime={roundTime || 0}
          onTimeRemainOver={handleGetRoundsData}
        />
        <TokenPoolButton />       
      </div>
      <p className="w-full text-xl font-extrabold text-primary5">Strategy</p>
      <div className={twJoin("w-full flex items-start gap-x-4")}>
      
      <BotTypeButton />
      </div>      
    </div>
  );
};

export default HeaderHome;
