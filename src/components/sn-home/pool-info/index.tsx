import React from "react";
import { useAppContext } from "@/context";
import { twJoin, twMerge } from "tailwind-merge";
import ReactPaginate from "react-paginate";
import TablePoolInfo from "./TablePoolInfo";
import InputBetInfoConsecutiveBot from "./InputBetInfoConsecutiveBot";
import { BotTypeEnum } from "@/models";
import InputBetInfoDifferenceRate from "./InputBetInfoDifferenceRate";

const PoolInfo = () => {
  const { currentEpoch, setPageNum } = useAppContext();
  const { selectedBotType } = useAppContext();
  const handlePageChange = (selected: number) => {
    setPageNum(selected);
  };

  return (
    <div
      className={twMerge(
        "p-4",
        "w-full",
        "bg-neutral2",
        "flex flex-col items-start gap-y-3",
        "rounded-lg border border-characterStrokeBet"
      )}
    >
      {selectedBotType === BotTypeEnum.CONSECUTIVE
        ? <InputBetInfoConsecutiveBot />
        : <InputBetInfoDifferenceRate />}
      <TablePoolInfo />
      <ReactPaginate
        className={twJoin("flex space-x-3 justify-center")}
        breakLabel="..."
        nextLabel=">"
        previousLabel="<"
        pageCount={Math.floor(currentEpoch / 10) + 1 || 0}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageLinkClassName="page-link p-2"
        nextLinkClassName="page-link p-2"
        breakLinkClassName="page-link p-2"
        previousLinkClassName="page-link p-2"
        pageClassName="page-item "
        nextClassName="page-item "
        breakClassName="page-item "
        previousClassName="page-item"
        activeClassName="active bg-neutral3 rounded"
        onPageChange={({ selected }) => handlePageChange(selected)}
      />
    </div>
  );
};

export default PoolInfo;
