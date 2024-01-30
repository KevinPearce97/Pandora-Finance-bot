import {
  TokenPairEnum,
  TokenPoolEnum,
  BetInfoInterface,
  UpAndDownRoundStatusEnum,
  SuiRoundResponseInterface,
  BetPositionEnum,
  RoundBetByAddressDataInterface,
} from "@/models";
import { CommonUtils, FormatUtils } from "@/utils";

export const getRoundTime = (suiObjectData?: any) => {
  const roundTime = suiObjectData?.content?.fields?.interval_seconds;

  return roundTime ? Number(roundTime) : 0;
};

export const getFee = (suiObjectData?: any) => {
  const fee = suiObjectData?.content?.fields?.treasury_fee;

  return fee ? Number(fee / 10000) : 0;
};

export const getCurrentEpoch = (suiObjectData?: any) => {
  if (Object.keys(suiObjectData || {}).length === 0) return 0;

  const fieldsData = suiObjectData?.content?.fields;

  return fieldsData.current_epoch ? Number(fieldsData.current_epoch) : 0;
};

export const getRoundDynamicFieldParams = (
  value: string,
  tokenPool: TokenPoolEnum,
  selectedTokenPair: TokenPairEnum
) => {
  const contractState = CommonUtils.getEnvVariableByTokenPair(
    process.env.STATE_OBJECT_IDS,
    selectedTokenPair,
    tokenPool
  );

  const poolType = CommonUtils.getPoolType(tokenPool);
  const pairType = `${process.env.PAIR_PACKAGE_ID}::pair::${selectedTokenPair}`;

  const paramsRound = {
    parentId: contractState,
    name: {
      type: `${process.env.PACKAGE_ID}::round::RoundKey<${pairType}, ${poolType}>`,
      value: value,
    },
  };

  return paramsRound;
};

export const refactorSuiRoundsData = (
  suiObjectData?: any,
  roundTime?: number,
  fee?: number,
  tokenPool?: TokenPoolEnum
) => {
  const tokenDecimal = CommonUtils.getTokenDecimal(tokenPool);

  if (
    !roundTime ||
    !tokenDecimal ||
    !suiObjectData ||
    !suiObjectData.length ||
    fee === undefined
  )
    return [];

  const mappedSuiRound = suiObjectData.map((item: any) => {
    return { ...item?.content?.fields };
  }) as SuiRoundResponseInterface[];

  const newData = mappedSuiRound.map((item) => {
    const currentTime = Math.floor(Date.now() / 1000);

    const payoutUp =
      Number(item.bull_amount) === 0
        ? 0
        : (Number(item.bull_amount) + Number(item.bear_amount)) /
          Number(item.bull_amount);

    const payoutDown =
      Number(item.bear_amount) === 0
        ? 0
        : (Number(item.bull_amount) + Number(item.bear_amount)) /
          Number(item.bear_amount);

    const isLiveRound = !item.is_finished && Number(item.lock_price) > 0;

    const isRoundExpired =
      Math.floor(Number(item.lock_timestamp) / 1000 + roundTime) <
        currentTime || item.is_finished;

    const prizePool = isRoundExpired
      ? FormatUtils.formatSUI(item.total_amount, tokenDecimal)
      : FormatUtils.formatSUI(
          (Number(item.bull_amount) + Number(item.bear_amount)).toString(),
          tokenDecimal
        );

    const roundData = {
      isError: Number(item.error_code) > 0,
      payoutUp: payoutUp,
      prizePool: prizePool,
      payoutDown: payoutDown,
      totalPlayers: Number(item.total_user) || 0,
      roundId: Number(item.epoch),
      closePrice: FormatUtils.formatSUI(item.close_price, item.price_decimal),
      lockedPrice: FormatUtils.formatSUI(item.lock_price, item.price_decimal),
      lockTime: Math.floor(Number(item.lock_timestamp) / 1000) || 0,
      startTime: Math.floor(Number(item.start_timestamp) / 1000) || 0,
      reward_base_cal_amount: Number(item.reward_base_cal_amount),
      reward_amount: Number(item.reward_amount),
      status: isLiveRound
        ? UpAndDownRoundStatusEnum.Live
        : isRoundExpired
        ? UpAndDownRoundStatusEnum.Expired
        : UpAndDownRoundStatusEnum.Next,
      bullAmount: FormatUtils.formatSUI(item.bull_amount, tokenDecimal),
      bearAmount: FormatUtils.formatSUI(item.bear_amount, tokenDecimal),
      statusRound: handleGetStatusRound(
        Number(item.close_price),
        Number(item.lock_price),
        item.error_code
      ),
    } as BetInfoInterface;

    return roundData;
  });

  return newData.reverse();
};

export const handleGetStatusRound = (
  closePrice: number,
  lockPrice: number,
  errorCode?: string
) => {
  if (Number(errorCode) > 0 || closePrice === lockPrice) {
    return null;
  } else if (closePrice < lockPrice) {
    return BetPositionEnum.DOWN;
  } else {
    return BetPositionEnum.UP;
  }
};

export const getUserBetDynamicFieldParams = (
  epoch: string,
  walletAddress: string,
  tokenPool: TokenPoolEnum,
  selectedTokenPair: TokenPairEnum
) => {
  const contractState = CommonUtils.getEnvVariableByTokenPair(
    process.env.STATE_OBJECT_IDS,
    selectedTokenPair,
    tokenPool
  );

  const pairType = `${process.env.PAIR_PACKAGE_ID}::pair::${selectedTokenPair}`;
  const poolType = CommonUtils.getPoolType(tokenPool);

  const paramsRound = {
    parentId: contractState,
    name: {
      type: `${process.env.PACKAGE_ID}::bet_registry::UserBetKey<${pairType}, ${poolType}>`,
      value: {
        epoch: epoch,
        user_address: walletAddress,
      },
    },
  };

  return paramsRound;
};

export const handleAddBetInfo = (
  betObjectData: any,
  roundsData: BetInfoInterface[],
  tokenPool: TokenPoolEnum
) => {
  const tokenDecimal = CommonUtils.getTokenDecimal(tokenPool);

  if (!betObjectData || !betObjectData.length || !tokenDecimal) {
    return [] as RoundBetByAddressDataInterface[];
  } else {
    const mappedBetInfo = betObjectData.map((item: any) => {
      return { ...item?.content?.fields };
    }) as any[];

    const newRoundsData = roundsData.map((item) => {
      const matchedRound = mappedBetInfo.find(
        (betItem) => Number(betItem.epoch) === item.roundId
      );

      return {
        roundId: item.roundId,
        isError: item?.isError,
        claimed: matchedRound?.claimed,
        positionEnter: matchedRound?.epoch ? matchedRound?.position : undefined,
        entryValue: matchedRound?.amount
          ? FormatUtils.formatSUI(matchedRound.amount, tokenDecimal)
          : undefined,
      };
    });

    return newRoundsData as RoundBetByAddressDataInterface[];
  }
};
