import { AppConstant } from "@/const";

export const convertToInternationalCurrencySystem = (
  value?: string | number
) => {
  if (!value) return 0;

  // Nine Zeroes for Billions
  return Math.abs(Number(value)) >= 1.0e9
    ? (Math.abs(Number(value)) / 1.0e9).toFixed(2) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(value)) >= 1.0e4
    ? (Math.abs(Number(value)) / 1.0e6).toFixed(2) + "M"
    : Math.abs(Number(value)).toLocaleString("en-US", {
        maximumFractionDigits: 4,
        minimumFractionDigits: 4,
      });
};
export const formatNumber = (
  numberValue?: number,
  maximumFractionDigits = 2,
  isConvertLarge?: boolean,
  localeOption = {},
  minimumFractionDigits = 0
) => {
  try {
    if (!numberValue && numberValue !== 0)
      return AppConstant.NOT_HAVE_VALUE_LABEL;
    const num = Number(numberValue);

    if (isConvertLarge) {
      return convertToInternationalCurrencySystem(num);
    } else {
      return num.toLocaleString("en-US", {
        maximumFractionDigits,
        minimumFractionDigits: minimumFractionDigits,
        ...localeOption,
      });
    }
  } catch (error) {
    return String(numberValue);
  }
};

export const formatSUI = (balance: string, pow?: number) => {
  const total = Number(balance);
  const divisor = Math.pow(10, pow ? pow : 9);

  const suiBalance = Number(total / divisor);

  return isNaN(suiBalance) ? 0 : suiBalance;
};
