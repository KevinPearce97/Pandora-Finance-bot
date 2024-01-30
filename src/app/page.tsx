"use client";

import React, { useEffect } from "react";
import { twJoin } from "tailwind-merge";
import { AppService } from "@/services";
import { useAppContext } from "@/context";
import { HeaderHome, PoolInfo } from "@/components/sn-home";

const Home = () => {
  const {
    pageNum,
    roundsData,
    selectedPool,
    selectedPair,
    currentEpoch,

    setRoundTime,
    setLivePrice,
    setRoundsData,
    setCurrentEpoch,
    setRoundsBetData,
  } = useAppContext();

  const handleGetRoundsData = async () => {
    const { roundsData, roundTime, currentEpoch } =
      await AppService.handleGetRoundInfo(selectedPair, selectedPool, pageNum);

    setRoundTime(roundTime);
    setRoundsData(roundsData);
    setCurrentEpoch(Number(currentEpoch));
  };

  const handleGetNextRound = async () => {
    const nextRoundData = await AppService.handleGetNextRoundInfo(
      currentEpoch,
      selectedPool,
      selectedPair
    );

    const newData = roundsData.map((item) => {
      return (
        nextRoundData.find((element) => element.roundId === item.roundId) ||
        item
      );
    });
    setRoundsData(newData);
  };

  const handleGetLivePrice = async () => {
    const livePrice = await AppService.getLivePrice();
    setLivePrice(livePrice);
  };

  const handleGetBetInfo = async () => {
    if (!roundsData.length) return;

    const betData = await AppService.handleGetRoundsBetInfo(
      roundsData,
      selectedPool,
      selectedPair
    );
    setRoundsBetData(betData);
  };

  useEffect(() => {
    if (!selectedPool || !selectedPair || pageNum < 0) return;

    handleGetRoundsData();
  }, [selectedPool, selectedPair, pageNum]);

  useEffect(() => {
    if (!selectedPool || !selectedPair || currentEpoch <= 0 || pageNum > 0)
      return;
    const getNextRoundInterval = setInterval(async () => {
      handleGetNextRound();
      handleGetBetInfo();
    }, 10000);
    return () => {
      clearInterval(getNextRoundInterval);
    };
  }, [selectedPool, selectedPair, currentEpoch, pageNum]);

  useEffect(() => {
    handleGetLivePrice();
    const getLivePriceInterval = setInterval(async () => {
      handleGetLivePrice();
    }, 10000);
    return () => {
      clearInterval(getLivePriceInterval);
    };
  }, []);

  useEffect(() => {
    if (!roundsData.length || !selectedPair || !selectedPool) return;

    handleGetBetInfo();
  }, [roundsData, selectedPair, selectedPool]);

  return (
    <div
      className={twJoin(
        "w-[1080px] h-full",
        "ml-auto mr-auto pt-5",
        "flex flex-col items-center"
      )}
    >
      <HeaderHome />
      <PoolInfo />
    </div>
  );
};

export default Home;
