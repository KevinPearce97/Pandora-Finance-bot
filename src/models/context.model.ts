import {
  TokenPairEnum,
  TokenPoolEnum,
  BetInfoInterface,
  SupportedChainEnum,
  BotTypeEnum,
  RoundBetByAddressDataInterface,
} from "./app.model";

export interface AppContextInterface {
  pageNum: number;
  roundTime: number | undefined;
  livePrice: number;
  currentEpoch: number;
  countdownTime: number | undefined;
  selectedPair: TokenPairEnum;
  selectedPool: TokenPoolEnum;
  roundsData: BetInfoInterface[];
  selectedChain: SupportedChainEnum;
  selectedBotType: BotTypeEnum;
  roundsBetData: RoundBetByAddressDataInterface[];

  setRoundsBetData: React.Dispatch<
    React.SetStateAction<RoundBetByAddressDataInterface[]>
  >;
  setPageNum: React.Dispatch<React.SetStateAction<number>>;
  setLivePrice: React.Dispatch<React.SetStateAction<number>>;
  setRoundTime: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCurrentEpoch: React.Dispatch<React.SetStateAction<number>>;
  setCountdownTime: React.Dispatch<React.SetStateAction<number | undefined>>;
  setSelectedPair: React.Dispatch<React.SetStateAction<TokenPairEnum>>;
  setSelectedPool: React.Dispatch<React.SetStateAction<TokenPoolEnum>>;
  setRoundsData: React.Dispatch<React.SetStateAction<BetInfoInterface[]>>;
  setSelectedChain: React.Dispatch<React.SetStateAction<SupportedChainEnum>>;
  setSelectedBotType: React.Dispatch<React.SetStateAction<BotTypeEnum>>;
}
