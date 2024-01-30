"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AppService } from "@/services";
import { useAppContext } from "@/context";
import { BetPositionEnum } from "@/models";
import { useCountdownByTimestamp } from "@/hooks/common-hooks";
import { CommonButton, CommonInput } from "@/components/common";

const InputBetInfoDifferenceRate = () => {
  const { countdownTime, roundTime, selectedPair, selectedPool } =
    useAppContext();

  const endTime = useMemo(() => {
    if (!countdownTime || !roundTime) {
      return undefined;
    } else {
      return countdownTime + roundTime;
    }
  }, [countdownTime, roundTime]);

  const timeRemain = useCountdownByTimestamp(endTime, () => {});

  const [betAmount, setBetAmount] = useState("0.1");
  const [differenceRate, setdifferenceRate] = useState("10");

  const [isStartRunningBot, setIsStartRunningBot] = useState(false);

  const handleChangedifferenceRate = (value: string) => {
    if (Number(value) >= 100) {
      setdifferenceRate("100");
    } else {
      setdifferenceRate(value);
    }
  };

  const handleChangeMinBetAmount = (value: string) => {
    if (Number(value) < 0.1) {
      setBetAmount("0.1");
    } else {
      setBetAmount(value);
    }
  };

  const handleGetResult = async () => {
    const { roundsData } = await AppService.handleGetRoundInfo(
      selectedPair,
      selectedPool,
      0
    );

    const currentPrice = await AppService.getLivePrice();
    const lastLockedPrice = roundsData[1].lockedPrice;
    const lastRoundUp = roundsData[2].lockedPrice < roundsData[2].closePrice;
    const rate =
      Math.abs((currentPrice - lastLockedPrice) / lastLockedPrice) * 100;
    if (rate < Number(differenceRate)) {
      return;
    }
    const betPosition: BetPositionEnum = lastRoundUp
      ? BetPositionEnum.DOWN
      : BetPositionEnum.UP;
    await AppService.handleBetByPosition(
      Number(betAmount),
      betPosition,
      selectedPool,
      selectedPair
    );
  };

  useEffect(() => {
    if (!isStartRunningBot || !betAmount || !differenceRate) return;
    if (timeRemain === 30) {
      console.log("run difference bot");
      handleGetResult();
    }
  }, [timeRemain, isStartRunningBot, differenceRate, betAmount]);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-x-2">
        <p>
          Difference rate result (current price - locked price)/locked price
          (%):{" "}
        </p>
        <CommonInput
          min="1"
          max="9"
          type="number"
          className="h-8 w-28 py-1"
          value={differenceRate}
          onChange={(e) => handleChangedifferenceRate(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-x-2">
        <p>Bet amount: </p>
        <CommonInput
          min="0.1"
          type="number"
          value={betAmount}
          className="h-8 w-40 py-1"
          onChange={(e) => handleChangeMinBetAmount(e.target.value)}
        />
      </div>

      <CommonButton
        className="w-fit"
        onClick={() => setIsStartRunningBot(!isStartRunningBot)}
      >
        {isStartRunningBot ? "Stop" : "Start"}
      </CommonButton>
    </div>
  );
};

export default InputBetInfoDifferenceRate;
