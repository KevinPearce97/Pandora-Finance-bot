export enum TokenPairEnum {
  SUI_USDT = "SUI_USDT",
}

export enum TokenPoolEnum {
  SUI_POOL = "SUI",
}

export enum BotTypeEnum {
  CONSECUTIVE = "Consecutive",
  DIFFERENCERATE = "DifferenceRate",
}

export enum SupportedChainEnum {
  SUI = "SUI",
}

export enum BlockchainTransactionStatusEnum {
  LOADING = "loading",
  SUCCESS = "success",
  FAILED = "failed",
}

export type SuiMoveCallTargetType = `${string}::${string}::${string}`;

export interface ResponseDataList<T> {
  statusCode: number;
  data: {
    pageData: T;
    pageNum: number;
    total: number;
  };
}

export enum PoolPairIndex {
  SUI_SUI_USDT = 0,
}

export enum BetPositionEnum {
  UP = 0,
  DOWN = 1,
}

export enum UpAndDownRoundStatusEnum {
  Expired = "expired",
  Live = "live",
  Next = "next",
  Later = "later",
}

export interface BetInfoInterface {
  roundId: number;
  payoutUp: number;
  lockTime: number;
  prizePool: number;
  startTime: number;
  isError?: boolean;
  closePrice: number;
  payoutDown: number;
  lockedPrice: number;
  totalPlayers: number;
  bullAmount: number;
  bearAmount: number;
  status: UpAndDownRoundStatusEnum;
  statusRound: BetPositionEnum | null;

  positionEnter?: BetPositionEnum;
  entryValue?: string;
  reward?: string;
  claimed?: boolean;
  reward_amount?: number;
  reward_base_cal_amount?: number;
}
[];

export interface RoundBetByAddressDataInterface {
  roundId: number;
  isError?: boolean;
  positionEnter?: BetPositionEnum;
  entryValue?: string;
  claimed?: boolean;
}

export interface SuiRoundResponseInterface {
  epoch: string;
  error_code: string;
  lock_price: string;
  total_user: string;
  close_price: string;
  bear_amount: string;
  bull_amount: string;
  total_amount: string;
  is_finished: boolean;
  reward_amount: string;
  price_decimal: number;
  lock_oracle_id: string;
  lock_timestamp: string;
  close_oracle_id: string;
  close_timestamp: string;
  start_timestamp: string;
  reward_base_cal_amount: string;
}
