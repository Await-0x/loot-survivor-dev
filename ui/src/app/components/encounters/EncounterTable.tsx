import {
  BladeIcon,
  BludgeonIcon,
  MagicIcon,
  ClothIcon,
  HideIcon,
  MetalIcon,
  HeartVitalityIcon,
  CoinIcon,
  InfoIcon,
  DownArrowIcon,
} from "@/app/components/icons/Icons";
import LootIcon from "@/app/components/icons/LootIcon";
import React, { useMemo, useState } from "react";
import { listAllEncounters } from "@/app/lib/utils/processFutures";
import useAdventurerStore from "@/app/hooks/useAdventurerStore";
import { useQueriesStore } from "@/app/hooks/useQueryStore";
import { getItemData, calculateLevel } from "@/app/lib/utils";
import useUIStore from "@/app/hooks/useUIStore";
import { GameData } from "@/app/lib/data/GameData";

const EncounterTable = () => {
  const adventurer = useAdventurerStore((state) => state.adventurer);
  const adventurerEntropy = useUIStore((state) => state.adventurerEntropy);
  const hasBeast = useAdventurerStore((state) => state.computed.hasBeast);

  const [hoveredBeast, setHoveredBeast] = useState<number | null>(null);

  const formattedAdventurerEntropy = BigInt(adventurerEntropy);

  const { data } = useQueriesStore();

  let gameData = new GameData();

  let armoritems =
    data.itemsByAdventurerQuery?.items
      .map((item) => ({ ...item, ...getItemData(item.item ?? "") }))
      .filter((item) => {
        return !["Weapon", "Ring", "Neck"].includes(item.slot!);
      }) || [];

  let weaponItems =
    data.itemsByAdventurerQuery?.items
      .map((item) => ({ ...item, ...getItemData(item.item ?? "") }))
      .filter((item) => {
        return item.slot! === "Weapon";
      }) || [];

  const encounters = useMemo(
    () =>
      listAllEncounters(
        adventurer?.xp!,
        formattedAdventurerEntropy,
        hasBeast,
        adventurer?.level!
      ),
    [adventurer?.xp, formattedAdventurerEntropy]
  );

  return (
    <table className="border-separate border-spacing-0 w-full sm:text-sm xl:text-sm 2xl:text-sm block overflow-x-scroll sm:overflow-y-scroll default-scroll">
      <thead
        className="border border-terminal-green sticky top-0 bg-terminal-black uppercase"
        style={{ zIndex: 8 }}
      >
        <tr className="border border-terminal-green">
          <th className="py-2 px-1 sm:pr-3 border-b border-terminal-green">
            XP
          </th>
          <th className="py-2 px-1 sm:pr-3 border-b border-terminal-green">
            Type
          </th>
          <th className="py-2 px-1 sm:pr-3 border-b border-terminal-green">
            Encounter
          </th>
          <th className="py-2 px-1 sm:pr-3 border-b border-terminal-green">
            HP
          </th>
          <th className="py-2 px-1 sm:pr-3 border-b border-terminal-green">
            Type
          </th>
          <th className="py-2 px-1 sm:pr-3 border-b border-terminal-green">
            Location
          </th>
          <th className="relative py-2 px-1 border-b border-terminal-green">
            Avoid
          </th>
          <th className="relative py-2 px-1 border-b border-terminal-green">
            Tip
          </th>
          <th className="relative py-2 px-1 border-b border-terminal-green">
            Gold
          </th>
          <th className="py-2 px-1 sm:pr-3 border-b border-terminal-green">
            Crit
          </th>
          <th className="relative py-2 px-1 border-b border-terminal-green">
            Next
            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 text-xs text-terminal-yellow">
              +LVL
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {React.Children.toArray(
          encounters.map((encounter: any, index: number) => {
            let [special2, special3] = encounter.specialName?.split(" ") || [
              "no",
              "no",
            ];
            let nameMatch =
              encounter.encounter === "Beast" && encounter.level >= 19
                ? armoritems.find(
                    (item) =>
                      item.special2 === special2 || item.special3 === special3
                  )
                : false;
            let weaponMatch =
              encounter.encounter === "Beast" && encounter.level >= 19
                ? weaponItems.find(
                    (item) =>
                      item.special2 === special2 || item.special3 === special3
                  )
                : false;

            let levelUps =
              calculateLevel(encounter.nextXp) - adventurer?.level!;

            return (
              <tr>
                <td className="py-2 border-b border-terminal-green">
                  <span className="flex">{encounter.xp}</span>
                </td>
                <td
                  className={`py-2 border-b border-terminal-green tooltip flex flex-row gap-1 ${
                    nameMatch
                      ? "text-red-500"
                      : weaponMatch
                      ? "text-green-500"
                      : "text-terminal-yellow"
                  }`}
                >
                  <span className="uppercase">{encounter.encounter}</span>
                  {encounter.encounter === "Beast" && encounter.level >= 19 && (
                    <span className="tooltiptext bottom">
                      {encounter.specialName}
                    </span>
                  )}
                </td>
                <td className="py-2 border-b border-terminal-green">
                  <span className="flex justify-center">
                    {encounter.encounter !== "Discovery" && (
                      <div className="relative flex flex-row gap-1 items-center justify-center w-full">
                        <span className="text-xs">PWR</span>
                        <span>{encounter.power}</span>
                        <span className="absolute bottom-[-10px] text-terminal-yellow text-xs">
                          T{encounter.tier} L{encounter.level}
                        </span>
                      </div>
                    )}
                    {encounter.type === "Health" && (
                      <div className="flex items-center">
                        {" "}
                        <HeartVitalityIcon className="h-3 pl-0.5" />
                        {encounter.tier}{" "}
                      </div>
                    )}
                    {encounter.type === "Gold" && (
                      <div className="flex items-center">
                        {" "}
                        <CoinIcon className="pl-0.5 mt-0.5 self-center h-4 fill-current text-terminal-yellow" />
                        {encounter.tier}{" "}
                      </div>
                    )}
                    {encounter.type === "Loot" && (
                      <div className="flex items-center">
                        {" "}
                        {gameData.ITEMS[encounter.tier]}{" "}
                        <LootIcon
                          type={
                            gameData.ITEM_SLOTS[
                              gameData.ITEMS[encounter.tier].replace(/\s+/g, "")
                            ]
                          }
                          size={"w-4"}
                          className="pl-0.5 mt-0.5 self-center h-4 fill-current text-terminal-yellow"
                        />
                      </div>
                    )}
                  </span>
                </td>
                <td className="py-2 border-b border-terminal-green">
                  <span className="flex justify-center">
                    {encounter.health}
                  </span>
                </td>
                <td className="py-2 border-b border-terminal-green">
                  <span className="relative flex justify-center gap-1 items-center uppercase">
                    {encounter.encounter === "Beast" && (
                      <span
                        className="absolute top-[-8px] right-[-5px] w-3 h-3 cursor-pointer"
                        onMouseEnter={() => setHoveredBeast(index)}
                        onMouseLeave={() => setHoveredBeast(null)}
                      >
                        <InfoIcon />
                        {hoveredBeast === index && (
                          <span className="absolute flex flex-row items-center gap-1 p-2 border border-terminal-green bg-terminal-black">
                            {encounter.type === "Blade" && (
                              <BladeIcon className="h-4" />
                            )}
                            {encounter.type === "Bludgeon" && (
                              <BludgeonIcon className="h-4" />
                            )}
                            {encounter.type === "Magic" && (
                              <MagicIcon className="h-4" />
                            )}

                            {encounter.encounter === "Beast" && (
                              <>
                                <span>/</span>
                                {encounter.type === "Blade" && (
                                  <HideIcon className="h-4" />
                                )}
                                {encounter.type === "Bludgeon" && (
                                  <MetalIcon className="h-4" />
                                )}
                                {encounter.type === "Magic" && (
                                  <ClothIcon className="h-4" />
                                )}
                              </>
                            )}
                          </span>
                        )}
                      </span>
                    )}
                    {encounter.encounter === "Beast" ? (
                      (encounter.type === "Blade" && "Hunter") ||
                      (encounter.type === "Bludgeon" && "Brute") ||
                      (encounter.type === "Magic" && "Magical")
                    ) : (
                      <>
                        {encounter.type === "Blade" && (
                          <BladeIcon className="h-4" />
                        )}
                        {encounter.type === "Bludgeon" && (
                          <BludgeonIcon className="h-4" />
                        )}
                        {encounter.type === "Magic" && (
                          <MagicIcon className="h-4" />
                        )}
                      </>
                    )}
                  </span>
                </td>
                <td className="py-2 border-b border-terminal-green">
                  <span className="flex justify-center uppercase">
                    {encounter.location}
                  </span>
                </td>
                <td className="py-2 border-b border-terminal-green">
                  <span className="flex justify-center uppercase">
                    {encounter.dodgeRoll &&
                    (encounter.encounter === "Beast"
                      ? adventurer?.wisdom!
                      : adventurer?.intelligence!) >= encounter.dodgeRoll
                      ? "Yes"
                      : "No"}
                  </span>
                </td>
                <td className="py-2 border-b border-terminal-green">
                  <span className="flex gap-1 justify-center uppercase text-terminal-yellow">
                    {encounter.dodgeRoll && (
                      <>
                        <span>
                          {encounter.encounter === "Beast" ? "WIS" : "INT"}
                        </span>
                        <span>{encounter.dodgeRoll}</span>
                      </>
                    )}
                  </span>
                </td>
                <td className="py-2 border-b border-terminal-green">
                  <span className="flex justify-center uppercase">
                    {encounter.encounter === "Beast" && (
                      <span className="flex flex-row items-center text-terminal-yellow">
                        <CoinIcon className="h-4 fill-current text-terminal-yellow" />
                        {encounter.gold}
                      </span>
                    )}
                  </span>
                </td>
                <td
                  className={`py-2 border-b border-terminal-green uppercase ${
                    encounter.isCritical ? "text-red-500" : ""
                  }`}
                >
                  {encounter.isCritical && (
                    <span className="flex justify-center">
                      {encounter.isCritical ? "Yes" : "No"}
                    </span>
                  )}
                </td>
                <td className="py-2 border-b border-terminal-green">
                  <span className="flex flex-row gap-1 justify-center">
                    {encounter.nextXp}{" "}
                    <span className="text-terminal-yellow flex">
                      {Array.from({ length: levelUps }).map((_, index) => (
                        <DownArrowIcon
                          key={index}
                          className="h-4 transform rotate-180"
                        />
                      ))}
                    </span>
                  </span>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default EncounterTable;
