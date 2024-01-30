import { CommonUtils, FormatUtils } from "@/utils";
import { SuiClient, SuiObjectResponse } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import {
  TokenPairEnum,
  TokenPoolEnum,
  BetPositionEnum,
  SuiMoveCallTargetType,
  BetInfoInterface,
} from "@/models";
import {
  getFee,
  getRoundTime,
  getCurrentEpoch,
  refactorSuiRoundsData,
  getRoundDynamicFieldParams,
  getUserBetDynamicFieldParams,
  handleAddBetInfo,
} from "./helper";

const RPC_URL = "https://fullnode.mainnet.sui.io:443";

export const handleGetObject = async (data: { objectId: string }) => {
  if (Object.keys(data).length === 0) return;

  const { objectId } = data;

  const suiClient = new SuiClient({ url: RPC_URL });

  const objectData = await suiClient.getObject({
    id: objectId,
    options: {
      showBcs: true,
      showType: true,
      showOwner: true,
      showContent: true,
      showDisplay: true,
      showStorageRebate: true,
      showPreviousTransaction: true,
    },
  });

  return objectData;
};

const getDynamicFieldByObject = async (data: SuiGetDynamicFieldObjectType) => {
  const suiClient = new SuiClient({ url: RPC_URL });
  if (Object.keys(data).length === 0) return;

  const { parentId, name } = data;
  const objectData = await suiClient.getDynamicFieldObject({
    parentId: parentId,
    name: name,
  });

  return objectData;
};

const handleGetDynamic = async (data: SuiGetDynamicFieldObjectType) => {
  if (!(getDynamicFieldByObject instanceof Function)) return;

  try {
    const contractData = await getDynamicFieldByObject(data);
    return contractData;
  } catch (error) {
    console.log("Error", error);

    return {};
  }
};

const getLatestRoundEpoch = async (
  selectedTokenPair: TokenPairEnum,
  tokenPool: TokenPoolEnum
) => {
  const contractState = CommonUtils.getEnvVariableByTokenPair(
    process.env.STATE_OBJECT_IDS,
    selectedTokenPair,
    tokenPool
  );

  const dataStateEpoch = await handleGetObject({ objectId: contractState });
  const data = dataStateEpoch?.data as any;

  if (Object.keys(data || {}).length === 0) return 0;

  const fieldsData = data?.content?.fields;
  return fieldsData.current_epoch ? Number(fieldsData.current_epoch) : 0;
};

const getCoinByPool = async (address: string, tokenPool: TokenPoolEnum) => {
  const suiClient = new SuiClient({ url: RPC_URL });
  const response = await suiClient.getAllCoins({
    owner: address,
  });

  const allCoins = response.data;

  if (!allCoins || !allCoins.length) return;

  const coinsByPool = allCoins.filter(
    (item) => item.coinType === CommonUtils.getPoolType(tokenPool)
  );

  return coinsByPool;
};

export const handleGetRoundInfo = async (
  selectedPair: TokenPairEnum,
  selectedPool: TokenPoolEnum,
  pageNum: number
) => {
  const contractState = CommonUtils.getEnvVariableByTokenPair(
    process.env.STATE_OBJECT_IDS,
    selectedPair,
    selectedPool
  );

  const contractConfig = CommonUtils.getEnvVariableByTokenPair(
    process.env.CONFIGURATION_OBJECT_IDS,
    selectedPair,
    selectedPool
  );

  const dataStateEpoch = await handleGetObject({ objectId: contractState });

  const dataRoundConfig = await handleGetObject({ objectId: contractConfig });

  const roundTime = getRoundTime(dataRoundConfig?.data);
  const fee = getFee(dataRoundConfig?.data);
  const currentEpoch = getCurrentEpoch(dataStateEpoch?.data);

  if (!roundTime) {
    return { roundsData: [], roundTime: 0 };
  }
  const roundStateData = [];

  for (
    let i = currentEpoch - pageNum * 10 - 9;
    i <= currentEpoch - pageNum * 10;
    i++
  ) {
    const roundFieldsParams = getRoundDynamicFieldParams(
      String(i),
      selectedPool,
      selectedPair
    );

    const dataRoundState = await handleGetDynamic(roundFieldsParams);

    if (dataRoundState?.data) {
      roundStateData.push(dataRoundState?.data);
    }
  }

  const refactorRoundsData = refactorSuiRoundsData(
    roundStateData,
    roundTime,
    fee,
    selectedPool
  );

  return {
    roundsData: refactorRoundsData,
    roundTime: roundTime,
    currentEpoch: currentEpoch,
  };
};

export const handleGetLiveRoundTime = async (
  roundId: number,
  selectedPool: TokenPoolEnum,
  selectedPair: TokenPairEnum
) => {
  const roundFieldsParams = getRoundDynamicFieldParams(
    String(roundId),
    selectedPool,
    selectedPair
  );

  const dataRoundState = (await handleGetDynamic(roundFieldsParams)) as any;
  return Math.floor(
    Number(dataRoundState?.data?.content?.fields.start_timestamp) / 1000
  );
};

export const handleGetNextRoundInfo = async (
  roundId: number,
  selectedPool: TokenPoolEnum,
  selectedPair: TokenPairEnum
) => {
  const roundFieldsParams = getRoundDynamicFieldParams(
    String(roundId),
    selectedPool,
    selectedPair
  );

  const dataRoundState = (await handleGetDynamic(roundFieldsParams)) as any;

  const contractConfig = CommonUtils.getEnvVariableByTokenPair(
    process.env.CONFIGURATION_OBJECT_IDS,
    selectedPair,
    selectedPool
  );

  const dataRoundConfig = await handleGetObject({ objectId: contractConfig });

  const roundTime = getRoundTime(dataRoundConfig?.data);
  const fee = getFee(dataRoundConfig?.data);

  const newData = [] as any;
  newData.push(dataRoundState.data);

  const refactorData = refactorSuiRoundsData(
    newData,
    roundTime,
    fee,
    selectedPool
  );

  return refactorData;
};

export const getLivePriceByTokenPair = (suiObjectData?: any) => {
  if (Object.keys(suiObjectData || {}).length === 0) return 0;

  const feedsData = suiObjectData?.content?.fields?.feeds;
  const pairPriceData = feedsData?.fields?.contents;

  if (!pairPriceData?.length || !pairPriceData) return 0;

  const selectedPairPriceData = pairPriceData.filter(
    (item: any) => item.fields.key === 90
  );

  if (!selectedPairPriceData.length) return 0;

  const value = selectedPairPriceData[0].fields.value.fields.value;
  const decimal = selectedPairPriceData[0].fields.value.fields.decimal;

  const livePairPrice = FormatUtils.formatSUI(value, decimal);

  return livePairPrice;
};

export const getLivePrice = async () => {
  const priceFeedResponse = await handleGetObject({
    objectId: process.env.PRICE_FEED_ID || "",
  });
  if (!priceFeedResponse) return 0;
  const livePriceByPair = await getLivePriceByTokenPair(
    priceFeedResponse.data as SuiObjectResponse
  );

  return livePriceByPair;
};

export const handleGetRoundsBetInfo = async (
  roundsData: BetInfoInterface[],
  tokenPool: TokenPoolEnum,
  selectedTokenPair: TokenPairEnum
) => {
  const betData: SuiObjectResponse[] = [];

  const signer = CommonUtils.getSignerByPrivateKey(
    process.env.PRIVATE_KEY || ""
  );

  for (let i = 0; i < roundsData.length; i++) {
    let roundId = roundsData[i]?.roundId;

    if (roundId < 0 || !roundId) break;

    if (signer) {
      const betInfoParams = getUserBetDynamicFieldParams(
        roundId.toString(),
        signer.toSuiAddress(),
        tokenPool,
        selectedTokenPair
      );

      const dataBetInfo = (await handleGetDynamic(betInfoParams)) as any;

      if (dataBetInfo?.data) {
        betData.push(dataBetInfo?.data);
      }
    }
  }

  const newData = await handleAddBetInfo(betData, roundsData, tokenPool);

  return newData;
};

const getBetPositionByPreviousRounds = (
  roundsResult: Array<BetPositionEnum | null>
) => {
  if (!roundsResult || !roundsResult.length) return null;
  const isSameResult = roundsResult.every((val, i, arr) => val === arr[0]);
  if (!isSameResult) return null;

  if (roundsResult[0] === BetPositionEnum.UP) {
    return BetPositionEnum.DOWN;
  } else {
    return BetPositionEnum.UP;
  }
};

const handleGetSuiTransactionResult = async (transactionHash: string) => {
  const suiClient = new SuiClient({ url: RPC_URL });

  const transactionBlockData = await suiClient.waitForTransactionBlock({
    digest: transactionHash,
    options: {
      showEffects: true,
    },
  });

  const transactionStatus = transactionBlockData.effects?.status;
  return transactionStatus;
};

export const handleBetByPosition = async (
  amount: number,
  betPosition: BetPositionEnum,
  tokenPool: TokenPoolEnum,
  selectedPair: TokenPairEnum
) => {
  const target = `${process.env.PACKAGE_ID}::bet::bet` as SuiMoveCallTargetType;
  const signer = CommonUtils.getSignerByPrivateKey(
    process.env.PRIVATE_KEY || ""
  );


  const poolType = CommonUtils.getPoolType(tokenPool);
  const tokenDecimal = CommonUtils.getTokenDecimal(tokenPool);
  const pairType = `${process.env.PAIR_PACKAGE_ID}::pair::${selectedPair}`;
  const latestEpoch = await getLatestRoundEpoch(selectedPair, tokenPool);

  if (
    !amount ||
    !signer ||
    !tokenDecimal ||
    !latestEpoch ||
    betPosition === null
  )
    return;

  const coinObject = await getCoinByPool(signer.toSuiAddress(), tokenPool);
  console.log(coinObject);
  if (!coinObject) {
    console.log("No have coin");
    return;
  };

  const contractState = CommonUtils.getEnvVariableByTokenPair(
    process.env.STATE_OBJECT_IDS,
    selectedPair,
    tokenPool
  );

  const contractConfig = CommonUtils.getEnvVariableByTokenPair(
    process.env.CONFIGURATION_OBJECT_IDS,
    selectedPair,
    tokenPool
  );

  const contractCustodian = CommonUtils.getEnvVariableByTokenPair(
    process.env.CUSTODIAN_OBJECT_IDS,
    selectedPair,
    tokenPool
  );
 console.log(`start betting ${betPosition == BetPositionEnum.UP ? "up":"down"} with amount ${amount} and token pool ${tokenPool}`);
  const tx = new TransactionBlock();

  const [destinationCoin, ...restCoin] = coinObject;

  if (coinObject.length >= 2 && tokenPool !== TokenPoolEnum.SUI_POOL) {
    await tx.mergeCoins(
      tx.object(destinationCoin.coinObjectId),
      restCoin.map((coin) => tx.object(coin.coinObjectId))
    );
  }

  const [splitCoinAmount] = tx.splitCoins(
    tokenPool === TokenPoolEnum.SUI_POOL
      ? tx.gas
      : destinationCoin.coinObjectId,
    [tx.pure(Math.floor(amount * Math.pow(10, tokenDecimal)))]
  );

  tx.moveCall({
    target: target,
    typeArguments: [pairType, poolType],
    arguments: [
      tx.object(contractConfig),
      tx.object(contractState),
      tx.object(contractCustodian),
      tx.pure.u64(latestEpoch),
      splitCoinAmount,
      tx.pure.u8(betPosition),
      tx.object("0x6"),
    ],
  });

  try {
    const suiClient = new SuiClient({ url: RPC_URL });

    const response = await suiClient.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer,
      options: { showEffects: true, showEvents: true },
    });

    console.log("Transaction hash:", response?.digest);
    const status = handleGetSuiTransactionResult(response?.digest);

    console.log("Transaction status:", status);
  } catch (error) {
    console.log("Transaction error:", error);
  }
};

export const handleBet = async (
  amount: number,
  roundsResult: Array<BetPositionEnum | null>,

  tokenPool: TokenPoolEnum,
  selectedPair: TokenPairEnum
) => {
  const target = `${process.env.PACKAGE_ID}::bet::bet` as SuiMoveCallTargetType;
  const signer = CommonUtils.getSignerByPrivateKey(
    process.env.PRIVATE_KEY || ""
  );

  const poolType = CommonUtils.getPoolType(tokenPool);
  const tokenDecimal = CommonUtils.getTokenDecimal(tokenPool);
  const pairType = `${process.env.PAIR_PACKAGE_ID}::pair::${selectedPair}`;

  const betPosition = getBetPositionByPreviousRounds(roundsResult);

  const latestEpoch = await getLatestRoundEpoch(selectedPair, tokenPool);

  if (
    !amount ||
    !signer ||
    !tokenDecimal ||
    !latestEpoch ||
    betPosition === null
  )
    return;

  const coinObject = await getCoinByPool(signer.toSuiAddress(), tokenPool);
  console.log("coinObject", coinObject);
  if (!coinObject) return;

  const contractState = CommonUtils.getEnvVariableByTokenPair(
    process.env.STATE_OBJECT_IDS,
    selectedPair,
    tokenPool
  );

  const contractConfig = CommonUtils.getEnvVariableByTokenPair(
    process.env.CONFIGURATION_OBJECT_IDS,
    selectedPair,
    tokenPool
  );

  const contractCustodian = CommonUtils.getEnvVariableByTokenPair(
    process.env.CUSTODIAN_OBJECT_IDS,
    selectedPair,
    tokenPool
  );

  const tx = new TransactionBlock();

  const [destinationCoin, ...restCoin] = coinObject;

  if (coinObject.length >= 2 && tokenPool !== TokenPoolEnum.SUI_POOL) {
    await tx.mergeCoins(
      tx.object(destinationCoin.coinObjectId),
      restCoin.map((coin) => tx.object(coin.coinObjectId))
    );
  }

  const [splitCoinAmount] = tx.splitCoins(
    tokenPool === TokenPoolEnum.SUI_POOL
      ? tx.gas
      : destinationCoin.coinObjectId,
    [tx.pure(Math.floor(amount * Math.pow(10, tokenDecimal)))]
  );

  tx.moveCall({
    target: target,
    typeArguments: [pairType, poolType],
    arguments: [
      tx.object(contractConfig),
      tx.object(contractState),
      tx.object(contractCustodian),
      tx.pure.u64(latestEpoch),
      splitCoinAmount,
      tx.pure.u8(betPosition),
      tx.object("0x6"),
    ],
  });

  console.log(
    "start betting",
    betPosition === BetPositionEnum.UP
      ? `betPosition UP: ${betPosition}`
      : `betPosition DOWN:  ${betPosition}`
  );

  try {
    const suiClient = new SuiClient({ url: RPC_URL });

    const response = await suiClient.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer,
      options: { showEffects: true, showEvents: true },
    });

    console.log("Transaction hash:", response?.digest);
    const status = await handleGetSuiTransactionResult(response?.digest);

    console.log("Transaction status:", status);
  } catch (error) {
    console.log("Transaction error:", error);
  }
};

export type SuiGetDynamicFieldObjectType = {
  parentId: string;
  name: {
    type: string;
    value: any;
  };
};
