import Image from "next/image";
import { getBeastData } from "../../lib/utils";
import { HeartIcon } from "../icons/Icons";
import EfficacyIcon from "../icons/EfficacyIcon";
import { processBeastName } from "../../lib/utils";
import { Battle, Beast, Adventurer } from "@/app/types";
import { useQueriesStore } from "@/app/hooks/useQueryStore";

import { HealthCountDown } from "../CountDown";

interface BeastDisplayProps {
  beastData: Beast;
}

export const BeastDisplay = ({ beastData }: BeastDisplayProps) => {
  const beastName = processBeastName(
    beastData?.beast ?? "",
    beastData?.special2 ?? "",
    beastData?.special3 ?? ""
  );
  const { tier, attack, armor, image } = getBeastData(beastData?.beast ?? "");

  return (
    <div className="relative flex flex-col items-center h-full xl:h-[500px] 2xl:h-full  border-2 border-terminal-green">
      <div className="flex flex-col w-full h-full p-1 sm:p-3 uppercase">
        <div className="flex justify-between py-1 sm:py-3 text-xl sm:text-4xl border-b border-terminal-green">
          {beastName}
          <div
            className={`text-4xl flex ${
              beastData?.health === 0 ? "text-red-600" : "text-terminal-green"
            }`}
          >
            <HeartIcon className="self-center w-6 h-6 fill-current" />{" "}
            <div className="self-center text-xl sm:text-4xl">
              <HealthCountDown health={beastData?.health || 0} />
            </div>
          </div>
        </div>
        <div className="flex justify-between w-full sm:py-2 ">
          <p className="text-xl sm:text-3xl text-terminal-yellow">
            Level {beastData?.level}
          </p>
          {/* <p className="text-3xl text-terminal-yellow">XP {beastData?.xp}</p> */}
          <p className="text-xl sm:text-3xl text-terminal-yellow">
            Tier {tier}
          </p>
        </div>
        <div className="flex flex-row justify-center gap-4 items-center w-full py-1 sm:py-4 space-x-2">
          <div className="flex flex-row gap-2 items-center ml-5">
            <EfficacyIcon
              type={attack}
              size="w-6"
              className="self-center h-4 w-4 sm:w-6 sm:h-6"
            />
            <p className="text-sm text-center sm:text-xl">{attack} Attack</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <EfficacyIcon
              type={armor}
              size="w-6"
              className="self-center h-4 w-4 sm:w-6 sm:h-6"
            />
            <p className="text-sm text-center sm:text-xl">{armor} Armor</p>
          </div>
        </div>
      </div>
      <div className="relative flex-grow w-full h-[18rem] sm:h-[150%]">
        <Image
          className="animate-pulse"
          src={image}
          alt="monsters"
          fill={true}
          sizes="xl"
          placeholder="blur"
          blurDataURL={
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mNkrmdgAAABkwCE1XPyYQAAAABJRU5ErkJggg=="
          }
          style={{
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
};
