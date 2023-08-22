import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { getLatestMarketItems } from "../hooks/graphql/queries";
import MarketplaceRow from "../components/marketplace/MarketplaceRow";
import useAdventurerStore from "../hooks/useAdventurerStore";
import LootIconLoader from "../components/icons/Loader";
import useCustomQuery from "../hooks/useCustomQuery";
import { useQueriesStore } from "../hooks/useQueryStore";
import { Item, ItemPurchase, NullItem, UpgradeStats } from "../types";
import { getItemData, getItemPrice, getKeyFromValue } from "../lib/utils";
import PurchaseHealth from "../components/actions/PurchaseHealth";
import { useMediaQuery } from "react-responsive";
import { Button } from "../components/buttons/Button";
import { useContracts } from "../hooks/useContracts";
import { GameData } from "../components/GameData";
import useTransactionCartStore from "../hooks/useTransactionCartStore";
import MarketplaceTable from "../components/marketplace/MarketplaceTable";

export interface MarketplaceScreenProps {
  upgradeTotalCost: number;
  purchaseItems: ItemPurchase[];
  setPurchaseItems: (value: ItemPurchase[]) => void;
  upgradeHandler: (
    upgrades?: UpgradeStats,
    potions?: number,
    purchases?: any[]
  ) => void;
  totalCharisma: number;
}
/**
 * @container
 * @description Provides the marketplace/purchase screen for the adventurer.
 */

export default function MarketplaceScreen({
  upgradeTotalCost,
  purchaseItems,
  setPurchaseItems,
  upgradeHandler,
  totalCharisma,
}: MarketplaceScreenProps) {
  const adventurer = useAdventurerStore((state) => state.adventurer);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [activeMenu, setActiveMenu] = useState<number | undefined>();
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const [itemsCount, setItemsCount] = useState(0);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { isLoading } = useQueriesStore();
  const [showEquipQ, setShowEquipQ] = useState<number | null>(null);

  const gameData = new GameData();

  const marketLatestItems = useQueriesStore(
    (state) => state.data.latestMarketItemsQuery?.items || []
  );
  const adventurerItems = useQueriesStore(
    (state) => state.data.itemsByAdventurerQuery?.items || []
  );

  const headingToKeyMapping: { [key: string]: string } = {
    Item: "item",
    Tier: "tier",
    Slot: "slot",
    Type: "type",
    Cost: "cost",
  };

  const handleSort = (heading: string) => {
    const mappedField = headingToKeyMapping[heading];
    if (!mappedField) return;

    if (sortField === mappedField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(mappedField);
      setSortDirection("asc");
    }
  };

  const sortedMarketLatestItems = useMemo(() => {
    if (!sortField) return marketLatestItems;
    const sortedItems = [...marketLatestItems].sort((a, b) => {
      let aItemData = getItemData(a.item ?? ""); // get item data for a
      let bItemData = getItemData(b.item ?? ""); // get item data for b
      let aValue, bValue;

      if (
        sortField === "tier" ||
        sortField === "type" ||
        sortField === "slot"
      ) {
        aValue = aItemData[sortField];
        bValue = bItemData[sortField];
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }

      if (typeof aValue === "string" && !isNaN(Number(aValue))) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if ((aValue ?? "") < (bValue ?? ""))
        return sortDirection === "asc" ? -1 : 1;
      if ((aValue ?? "") > (bValue ?? ""))
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sortedItems;
  }, [marketLatestItems, sortField, sortDirection]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          setSelectedIndex((prev) => {
            const newIndex = Math.min(prev + 1, itemsCount - 1);
            return newIndex;
          });
          break;
        case "ArrowUp":
          setSelectedIndex((prev) => {
            const newIndex = Math.max(prev - 1, 0);
            return newIndex;
          });
          break;
        case "Enter":
          setActiveMenu(selectedIndex);
          break;
      }
    },
    [selectedIndex, itemsCount]
  );

  useEffect(() => {
    if (!activeMenu) {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [activeMenu, handleKeyDown]);

  useEffect(() => {
    if (!activeMenu) {
      const button = rowRefs.current[selectedIndex];
      if (button) {
        button.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex, activeMenu]);

  const calculatedNewGold = adventurer?.gold
    ? adventurer?.gold - upgradeTotalCost
    : 0;

  const underMaxItems = adventurerItems.length < 19;

  return (
    <>
      {underMaxItems ? (
        <div className="w-full sm:mx-auto overflow-y-auto h-[300px] sm:h-[400px] border border-terminal-green table-scroll">
          {isLoading.latestMarketItemsQuery && (
            <div className="flex justify-center p-10 text-center">
              <LootIconLoader />
            </div>
          )}
          <div className={showEquipQ === null ? "" : "hidden sm:block"}>
            <MarketplaceTable
              showEquipQ={showEquipQ}
              setShowEquipQ={setShowEquipQ}
              purchaseItems={purchaseItems}
              setPurchaseItems={setPurchaseItems}
              upgradeHandler={upgradeHandler}
              totalCharisma={totalCharisma}
              calculatedNewGold={calculatedNewGold}
            />
          </div>
          <>
            {(() => {
              const item = sortedMarketLatestItems[showEquipQ ?? 0];
              const { tier, type, slot } = getItemData(item?.item ?? "");
              return (
                <div
                  className={`${
                    showEquipQ !== null ? "sm:hidden" : "hidden"
                  } w-full m-auto h-full flex flex-row items-center justify-center gap-2`}
                >
                  <p>{`Equip ${item.item} ?`}</p>
                  <Button
                    onClick={() => {
                      const newPurchases = [
                        ...purchaseItems,
                        {
                          item:
                            getKeyFromValue(gameData.ITEMS, item?.item ?? "") ??
                            "0",
                          equip: "1",
                        },
                      ];
                      setPurchaseItems(newPurchases);
                      upgradeHandler(undefined, undefined, newPurchases);
                      setShowEquipQ(null);
                      setActiveMenu(0);
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={() => {
                      const newPurchases = [
                        ...purchaseItems,
                        {
                          item:
                            getKeyFromValue(gameData.ITEMS, item?.item ?? "") ??
                            "0",
                          equip: "0",
                        },
                      ];
                      setPurchaseItems(newPurchases);
                      upgradeHandler(undefined, undefined, newPurchases);
                      setShowEquipQ(null);
                      setActiveMenu(0);
                    }}
                  >
                    No
                  </Button>
                  <Button
                    onClick={() => {
                      setShowEquipQ(null);
                      setActiveMenu(0);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              );
            })()}
          </>
        </div>
      ) : (
        <div className="flex w-full h-64">
          <p className="m-auto items-center text-2xl sm:text-4xl animate-pulse">
            You have a full inventory!
          </p>
        </div>
      )}
    </>
  );
}
