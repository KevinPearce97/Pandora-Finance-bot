"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AppService } from "@/services";
import { useAppContext } from "@/context";
import { useCountdownByTimestamp } from "@/hooks/common-hooks";
import { CommonButton, CommonInput } from "@/components/common";

const InputBetInfoConsecutiveBot = () => {
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
  const [numberOfResult, setNumberOfResult] = useState("3");

  const [isStartRunningBot, setIsStartRunningBot] = useState(false);

  const handleChangeNumberOfResult = (value: string) => {
    if (Number(value) >= 10) {
      setNumberOfResult("10");
    } else {
      setNumberOfResult(value);
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

    const dataConsecutive = roundsData.slice(1, Number(numberOfResult) + 1);
    console.log("dataConsecutive", dataConsecutive);

    const resultConsecutive = dataConsecutive.map((item) => item.statusRound);

    console.log("resultConsecutive", resultConsecutive);

    await AppService.handleBet(
      Number(betAmount),
      resultConsecutive,
      selectedPool,
      selectedPair
    );
  };

  useEffect(() => {
    if (!isStartRunningBot || !betAmount || !numberOfResult) return;

    if (timeRemain === 30) {
      console.log("run consecutive bot");
      handleGetResult();
    }
  }, [timeRemain, isStartRunningBot, numberOfResult, betAmount]);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-x-2">
        <p>Number of consecutive result(up/down): </p>
        <CommonInput
          min="1"
          max="9"
          type="number"
          className="h-8 w-28 py-1"
          value={numberOfResult}
          onChange={(e) => handleChangeNumberOfResult(e.target.value)}
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

export default InputBetInfoConsecutiveBot;
