import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useCallback,
} from "react";
import { useContracts } from "../../hooks/useContracts";
import { stringToFelt } from "../../lib/utils";
import {
  useAccount,
  useTransactionManager,
  useContractWrite,
} from "@starknet-react/core";
import { getKeyFromValue } from "../../lib/utils";
import { GameData } from "../GameData";
import useLoadingStore from "../../hooks/useLoadingStore";
import useTransactionCartStore from "../../hooks/useTransactionCartStore";
import useUIStore from "../../hooks/useUIStore";
import useAdventurerStore from "../../hooks/useAdventurerStore";
import { FormData, Adventurer } from "@/app/types";
import { Button } from "../buttons/Button";
import Image from "next/image";
import { BladeIcon, BludgeonIcon, MagicIcon } from "../icons/Icons";
import { TypeAnimation } from "react-type-animation";
import { battle } from "@/app/lib/constants";
import { TxActivity } from "../navigation/TxActivity";

export interface CreateAdventurerProps {
  isActive: boolean;
  onEscape: () => void;
  adventurers: Adventurer[];
}

export const CreateAdventurer = ({
  isActive,
  onEscape,
  adventurers,
}: CreateAdventurerProps) => {
  const { account } = useAccount();
  const { addTransaction } = useTransactionManager();
  const formatAddress = account ? account.address : "0x0";
  const [formData, setFormData] = useState<FormData>({
    startingWeapon: "",
    name: "",
    homeRealmId: "",
    race: "",
  });
  const setAdventurer = useAdventurerStore((state) => state.setAdventurer);
  const setScreen = useUIStore((state) => state.setScreen);
  const setMintAdventurer = useUIStore((state) => state.setMintAdventurer);

  const calls = useTransactionCartStore((state) => state.calls);
  const addToCalls = useTransactionCartStore((state) => state.addToCalls);
  const handleSubmitCalls = useTransactionCartStore(
    (state) => state.handleSubmitCalls
  );
  const startLoading = useLoadingStore((state) => state.startLoading);
  const setTxHash = useLoadingStore((state) => state.setTxHash);
  const { writeAsync } = useContractWrite({ calls });
  const { gameContract, lordsContract } = useContracts();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const gameData = new GameData();
  const [firstAdventurer, setFirstAdventurer] = useState(false);
  const [step, setStep] = useState(1);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
      if (!event.currentTarget) return;
      const form = (event.currentTarget as HTMLElement).closest("form");
      if (!form) return;
      const inputs = Array.from(form.querySelectorAll("input, select"));
      switch (event.key) {
        case "ArrowDown":
          setSelectedIndex((prev) => {
            const newIndex = Math.min(prev + 1, inputs.length - 1);
            return newIndex;
          });
          break;
        case "ArrowUp":
          setSelectedIndex((prev) => {
            const newIndex = Math.max(prev - 1, 0);
            return newIndex;
          });
        case "Escape":
          onEscape();
          break;
      }
      (inputs[selectedIndex] as HTMLElement).focus();
    },
    [selectedIndex, onEscape]
  );

  useEffect(() => {
    if (isActive) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, selectedIndex, handleKeyDown]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.slice(0, 13),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const mintLords = {
      contractAddress: lordsContract?.address ?? "",
      entrypoint: "mint",
      calldata: [formatAddress, (100 * 10 ** 18).toString(), "0"],
    };
    addToCalls(mintLords);

    const approveLordsTx = {
      contractAddress: lordsContract?.address ?? "",
      entrypoint: "approve",
      calldata: [gameContract?.address ?? "", (100 * 10 ** 18).toString(), "0"],
    };
    addToCalls(approveLordsTx);

    const mintAdventurerTx = {
      contractAddress: gameContract?.address ?? "",
      entrypoint: "start",
      calldata: [
        "0x0628d41075659afebfc27aa2aab36237b08ee0b112debd01e56d037f64f6082a",
        getKeyFromValue(gameData.ITEMS, formData.startingWeapon) ?? "",
        stringToFelt(formData.name).toString(),
        getRandomNumber(8000),
        getRandomNumber(10),
        "1",
      ],
    };

    addToCalls(mintAdventurerTx);
    startLoading(
      "Create",
      "Spawning Adventurer",
      "adventurersByOwnerQuery",
      undefined,
      `You have spawned ${formData.name}!`
    );
    await handleSubmitCalls(writeAsync).then((tx: any) => {
      if (tx) {
        setTxHash(tx.transaction_hash);
        addTransaction({
          hash: tx?.transaction_hash,
          metadata: {
            method: `Spawn ${formData.name}`,
          },
        });
      }
    });
    setMintAdventurer(true);
  };

  const [formFilled, setFormFilled] = useState(false);

  useEffect(() => {
    if (formData.name && formData.startingWeapon) {
      setFormFilled(true);
    } else {
      setFormFilled(false);
    }
  }, [formData]);

  const handleWeaponSelection = (weapon: string) => {
    setFormData({ ...formData, startingWeapon: weapon });
    setStep(2);
  };

  const handleNameEntry = (name: string) => {
    setFormData({ ...formData, name: name });
    setTimeout(() => {
      setStep(3);
    }, 1000);
  };

  const handleBack = () => {
    setStep((step) => Math.max(step - 1, 1));
  };

  const getRandomNumber = (to: number) => {
    return (Math.floor(Math.random() * to) + 1).toString();
  };

  if (step === 1) {
    return (
      <>
        <div className="w-3/4 sm:w-full p-8">
          <h3 className="uppercase text-center">Choose your weapon</h3>
          <div className="flex flex-col sm:flex-row justify-between gap-20">
            {[
              {
                name: "Book",
                description: "Magic Weapon",
                image: "/weapons/book.png",
                icon: <MagicIcon />,
              },
              {
                name: "Wand",
                description: "Magic Weapon",
                image: "/weapons/wand.png",
                icon: <MagicIcon />,
              },
              {
                name: "Short Sword",
                description: "Blade Weapon",
                image: "/weapons/shortsword.png",
                icon: <BladeIcon />,
              },
              {
                name: "Club",
                description: "Bludgeon Weapon",
                image: "/weapons/club.png",
                icon: <BludgeonIcon />,
              },
            ].map((weapon) => (
              <div key={weapon.name} className="flex flex-col items-center">
                <Image
                  src={weapon.image}
                  width={200}
                  height={200}
                  alt={weapon.name}
                  className="mb-2"
                />
                <div className="flex items-center pb-4 text-s sm:text-md">
                  {weapon.icon}
                  <p className="ml-2">{weapon.description}</p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleWeaponSelection(weapon.name)}
                >
                  {weapon.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  } else if (step === 2) {
    return (
      <>
        <div className="w-full border border-terminal-green p-8 uppercase">
          <h2>Enter adventurer name</h2>
          <div className="items-center flex flex-col gap-2">
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className="p-1 m-2 bg-terminal-black border border-terminal-green"
              onKeyDown={handleKeyDown}
              maxLength={13}
            />
          </div>
          <div className="flex flex-row justify-between">
            <Button onClick={handleBack}>Back</Button>
            <Button onClick={() => handleNameEntry(formData.name)}>Next</Button>
          </div>
        </div>
      </>
    );
  } else if (step === 3) {
    return (
      <>
        <div className="flex flex-col w-full h-full justify-center">
          <div className="flex flex-col h-full">
            <Image
              className="mx-auto border border-terminal-green absolute object-fill"
              src={"/monsters/starterbeast.png"}
              alt="adventurer facing beast"
              fill
            />

            <div className="absolute top-6 left-0 right-0 sm:p-4 text-xs sm:text-xl leading-loose z-10 text-center">
              <TypeAnimation
                sequence={[battle]}
                wrapper="span"
                cursor={true}
                speed={40}
                style={{ fontSize: "2em" }}
              />
            </div>
            <div className="absolute top-1/2 left-0 right-0 flex flex-col items-center gap-4 z-10">
              <TxActivity />
              <form onSubmit={handleSubmit}>
                <Button type="submit" size={"xl"} disabled={!formFilled}>
                  {formFilled ? "Spawn" : "Fill details"}
                </Button>
              </form>
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-4 z-10 pb-8">
              <Button variant={"default"} onClick={handleBack}>
                Back
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return null;
  }
};
