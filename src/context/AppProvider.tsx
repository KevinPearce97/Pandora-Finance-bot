"use client";

import React, { memo, useState, useContext, createContext } from "react";
import {
  TokenPoolEnum,
  TokenPairEnum,
  SupportedChainEnum,
  AppContextInterface,
  BetInfoInterface,
  BotTypeEnum,
  RoundBetByAddressDataInterface,
} from "@/models";

const INITIAL_STATE = {} as AppContextInterface;

const AppContext = createContext(INITIAL_STATE);

export const useAppContext = () => useContext(AppContext);

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [pageNum, setPageNum] = useState(0);
  const [livePrice, setLivePrice] = useState(0);
  const [roundTime, setRoundTime] = useState<number>();
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [countdownTime, setCountdownTime] = useState<number>();
  const [roundsData, setRoundsData] = useState<BetInfoInterface[]>([]);
  const [selectedPair, setSelectedPair] = useState(TokenPairEnum.SUI_USDT);
  const [selectedPool, setSelectedPool] = useState(TokenPoolEnum.SUI_POOL);
  const [selectedChain, setSelectedChain] = useState(SupportedChainEnum.SUI);
  const [selectedBotType, setSelectedBotType] = useState(
    BotTypeEnum.CONSECUTIVE
  );
  const [roundsBetData, setRoundsBetData] = useState<
    RoundBetByAddressDataInterface[]
  >([]);

  return (
    <AppContext.Provider
      value={{
        pageNum: pageNum,
        roundTime: roundTime,
        livePrice: livePrice,
        roundsData: roundsData,
        selectedPool: selectedPool,
        currentEpoch: currentEpoch,
        selectedPair: selectedPair,
        selectedChain: selectedChain,
        roundsBetData: roundsBetData,
        countdownTime: countdownTime,
        selectedBotType: selectedBotType,

        setPageNum: setPageNum,
        setRoundTime: setRoundTime,
        setLivePrice: setLivePrice,
        setRoundsData: setRoundsData,
        setSelectedPool: setSelectedPool,
        setSelectedPair: setSelectedPair,
        setCurrentEpoch: setCurrentEpoch,
        setRoundsBetData: setRoundsBetData,
        setCountdownTime: setCountdownTime,
        setSelectedChain: setSelectedChain,
        setSelectedBotType: setSelectedBotType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default memo(AppProvider);

interface AppProviderProps {
  children: React.ReactNode;
}

const INIT_PAGE_PAGINATION = {
  startPage: 1,
  endPage: 10,
};
