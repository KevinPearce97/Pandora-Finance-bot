"use client";

import React from "react";

import { FormatUtils } from "@/utils";
import { useAppContext } from "@/context";
import { twJoin, twMerge } from "tailwind-merge";
import { handleGetStatusRound } from "@/services/helper";
import { BetPositionEnum, UpAndDownRoundStatusEnum } from "@/models";

const TablePoolInfo = () => {
  const { roundsData, livePrice, roundsBetData } = useAppContext();

  const handleGetColorStatus = (status: BetPositionEnum | null) => {
    if (status === BetPositionEnum.UP) {
      return { label: "UP", color: "bg-characterUp" };
    } else if (status === BetPositionEnum.DOWN) {
      return { label: "DOWN", color: "bg-characterDown" };
    } else {
      return { label: "", color: "bg-neutral4" };
    }
  };

  const test = (roundId: number) => {
    const test = roundsBetData.find((element) => element.roundId === roundId);
    return {
      label: test?.entryValue,
      color:
        test?.positionEnter === BetPositionEnum.UP
          ? "bg-characterUp"
          : "bg-characterDown",
    };
  };

  return (
    <table className={twMerge("w-full", "bg-neutral1")}>
      <thead className="bg-neutral3">
        <tr>
          <th className="py-2 px-4 border">Epoch</th>
          <th className="py-2 px-4 border">Bull Payout</th>
          <th className="py-2 px-4 border">Bear Payout</th>
          <th className="py-2 px-4 border">Prize Pool</th>
          <th className="py-2 px-4 border">Lock</th>
          <th className="py-2 px-4 border">Close/Live</th>
          <th className="py-2 px-4 border">My Position</th>
          <th className="py-2 px-4 border text-start">Result</th>
        </tr>
      </thead>

      <tbody>
        {roundsData.map((item, index) => (
          <tr key={index}>
            <td className="text-center py-2">{item.roundId}</td>
            <td className="text-center py-2">
              {FormatUtils.formatNumber(item.payoutUp * item.bullAmount, 5)}
            </td>
            <td className="text-center py-2">
              {FormatUtils.formatNumber(item.payoutDown * item.bearAmount, 5)}
            </td>
            <td className="text-center py-2">
              {FormatUtils.formatNumber(item.prizePool, 5)}
            </td>
            <td className="text-center py-2">
              {FormatUtils.formatNumber(item.lockedPrice, 5)}
            </td>
            <td className="text-center py-2">
              {FormatUtils.formatNumber(
                item.status === UpAndDownRoundStatusEnum.Live
                  ? livePrice
                  : item.closePrice,
                5
              )}
            </td>
            <td className="center-root py-2">
              {test(item.roundId).label && (
                <div
                  className={twJoin(
                    "w-16 h-8",
                    "rounded-lg",
                    "center-root",
                    "text-xs text-neutral1 font-medium items-center",
                    test(item.roundId).color
                  )}
                >
                  {test(item.roundId).label}
                </div>
              )}
            </td>
            <td className="text-center py-2">
              <div
                className={twJoin(
                  "ml-4",
                  "w-16 h-8",
                  "rounded-lg",
                  "center-root",
                  "text-xs text-neutral1 font-medium items-center",
                  handleGetColorStatus(
                    item.status === UpAndDownRoundStatusEnum.Live
                      ? handleGetStatusRound(livePrice, item.lockedPrice)
                      : item.statusRound
                  ).color
                )}
              >
                {
                  handleGetColorStatus(
                    item.status === UpAndDownRoundStatusEnum.Live
                      ? handleGetStatusRound(livePrice, item.lockedPrice)
                      : item.statusRound
                  ).label
                }
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablePoolInfo;

handleGetStatusRound;
