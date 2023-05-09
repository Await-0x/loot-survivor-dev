import { useState } from "react";
import { Button } from "./Button";
import { useContracts } from "../hooks/useContracts";
import { useAccount } from "@starknet-react/core";
import { NullAdventurerProps } from "../types";
import useAdventurerStore from "../hooks/useAdventurerStore";
import useTransactionCartStore from "../hooks/useTransactionCartStore";

interface BidBoxProps {
  close: () => void;
  marketId: number;
  item: any;
  calculatedNewGold: number;
}

export function BidBox({
  close,
  marketId,
  item,
  calculatedNewGold,
}: BidBoxProps) {
  const { account } = useAccount();
  const adventurer = useAdventurerStore((state) => state.adventurer);
  const addToCalls = useTransactionCartStore((state) => state.addToCalls);
  const { lootMarketArcadeContract } = useContracts();
  const [bidPrice, setBidPrice] = useState<number | undefined>(undefined);

  const formatAddress = account ? account.address : "0x0";

  const handleBid = (marketId: number) => {
    if (bidPrice != undefined && bidPrice >= 3) {
      if (lootMarketArcadeContract && formatAddress) {
        const BidTx = {
          contractAddress: lootMarketArcadeContract?.address,
          entrypoint: "bid_on_item",
          calldata: [marketId, "0", adventurer?.id, "0", bidPrice],
          metadata: `Bidding on ${marketId}`,
        };
        addToCalls(BidTx);
        // Place bid logic
        close();
      }
    } else {
      alert("Bid price must be at least 3 gold");
    }
  };

  return (
    <div className="flex w-full">
      <input
        id="bid"
        type="number"
        min="3"
        onChange={(e) => setBidPrice(parseInt(e.target.value, 10))}
        className="w-12 px-3 py-2 border rounded-md bg-terminal-black border-terminal-green text-terminal-green"
      />
      <Button
        onClick={() => handleBid(marketId)}
        disabled={
          typeof bidPrice === "undefined" ||
          item.price >= bidPrice ||
          bidPrice > calculatedNewGold
        }
      >
        Place Bid
      </Button>
      <Button variant={"outline"} onClick={() => close()}>
        Close
      </Button>
    </div>
  );
}
