import { PoolPairIndex, TokenPairEnum, TokenPoolEnum } from "@/models";

import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromHEX } from "@mysten/sui.js/utils";

export const isUndefinedOrNull = (value?: number) => {
  return value === null || value === undefined;
};

export const getEnvVariableByTokenPair = (
  envValue?: string,
  selectedPair?: TokenPairEnum,
  tokenPool?: TokenPoolEnum
) => {
  let index = PoolPairIndex.SUI_SUI_USDT;

  if (tokenPool === TokenPoolEnum.SUI_POOL) {
    if (selectedPair === TokenPairEnum.SUI_USDT) {
      index = PoolPairIndex.SUI_SUI_USDT;
    }
  } else {
    // TODO: For other pair
  }

  if (!envValue || index === undefined) return "";

  const envSplitted = envValue?.split(",") || [];

  return envSplitted[index];
};

export const getPoolType = (tokenPool?: TokenPoolEnum) => {
  const envSplitted = process.env.POOL_TYPES?.split(",") || [];

  if (!envSplitted.length) return "";

  if (tokenPool === TokenPoolEnum.SUI_POOL) {
    return envSplitted[0];
  } else {
    // TODO: Update when implement other pool
    return "";
  }
};

export const getTokenDecimal = (tokenPool?: TokenPoolEnum) => {
  const envSplitted = process.env.TOKEN_DECIMAL?.split(",") || [];

  if (!envSplitted.length) return null;

  if (tokenPool === TokenPoolEnum.SUI_POOL) {
    return Number(envSplitted[0]);
  } else {
    // TODO: Update when implement other pool
    return null;
  }
};

export const getSignerByPrivateKey = (privateKey: string) => {
  if (!privateKey) return;

  const secretKeyByte = fromHEX(privateKey);
  const signer = Ed25519Keypair.fromSecretKey(secretKeyByte, {
    skipValidation: true,
  });
  return signer;
};
