"use client";
// import Game from "@/app/abi/Game.json";
import { Beasts } from "@/app/abi/Beasts";
import { Eth } from "@/app/abi/Eth";
import { Game } from "@/app/abi/Game";
import { Lords } from "@/app/abi/Lords";
import { Pragma } from "@/app/abi/Pragma";
import { getGoldenTokens } from "@/app/api/getGoldenTokens";
import { DeathDialog } from "@/app/components/adventurer/DeathDialog";
import Player from "@/app/components/adventurer/Player";
import { StatRemovalWarning } from "@/app/components/adventurer/StatRemovalWarning";
import TokenLoader from "@/app/components/animations/TokenLoader";
import EncounterDialog from "@/app/components/encounters/EnounterDialog";
import WalletSelect from "@/app/components/intro/WalletSelect";
import ScreenMenu from "@/app/components/menu/ScreenMenu";
import Header from "@/app/components/navigation/Header";
import MobileHeader from "@/app/components/navigation/MobileHeader";
import NetworkSwitchError from "@/app/components/navigation/NetworkSwitchError";
import Settings from "@/app/components/navigation/Settings";
import { TxActivity } from "@/app/components/navigation/TxActivity";
import { NotificationDisplay } from "@/app/components/notifications/NotificationDisplay";
import { SpecialBeast } from "@/app/components/notifications/SpecialBeast";
import LoginDialog from "@/app/components/onboarding/LoginDialog";
import { ProfileDialog } from "@/app/components/profile/ProfileDialog";
import DSTournamentOverview from "@/app/components/start/DSTournamentOverview";
import ActionsScreen from "@/app/containers/ActionsScreen";
import AdventurerScreen from "@/app/containers/AdventurerScreen";
import CollectionsLeaderboardScreen from "@/app/containers/CollectionsLeaderboardScreen";
import EncountersScreen from "@/app/containers/EncountersScreen";
import GuideScreen from "@/app/containers/GuideScreen";
import InterludeScreen from "@/app/containers/InterludeScreen";
import InventoryScreen from "@/app/containers/InventoryScreen";
import LeaderboardScreen from "@/app/containers/LeaderboardScreen";
import Profile from "@/app/containers/ProfileScreen";
import TopUp from "@/app/containers/TopUp";
import UpgradeScreen from "@/app/containers/UpgradeScreen";
import { useController } from "@/app/context/ControllerContext";
import {
  getAdventurerById,
  getBattlesByBeast,
  getBeast,
  getItemsByAdventurer,
  getLastBeastDiscovery,
  getLatestDiscoveries,
  getLatestMarketItems,
  getOwnerTokens,
} from "@/app/hooks/graphql/queries";
import useAdventurerStore from "@/app/hooks/useAdventurerStore";
import useControls from "@/app/hooks/useControls";
import useCustomQuery from "@/app/hooks/useCustomQuery";
import useLoadingStore from "@/app/hooks/useLoadingStore";
import { useMusic } from "@/app/hooks/useMusic";
import useNetworkAccount from "@/app/hooks/useNetworkAccount";
import { useQueriesStore } from "@/app/hooks/useQueryStore";
import useTransactionCartStore from "@/app/hooks/useTransactionCartStore";
import useTransactionManager from "@/app/hooks/useTransactionManager";
import useUIStore, { ScreenPage } from "@/app/hooks/useUIStore";
import { fetchBalances, fetchEthBalance } from "@/app/lib/balances";
import { gameClient } from "@/app/lib/clients";
import { VRF_WAIT_TIME } from "@/app/lib/constants";
import { networkConfig } from "@/app/lib/networkConfig";
import {
  calculateChaBoostRemoved,
  calculateVitBoostRemoved,
  indexAddress,
  padAddress,
} from "@/app/lib/utils";
import { useSyscalls } from "@/app/lib/utils/syscalls";
import { Menu, ZeroUpgrade } from "@/app/types";
import { useQuery } from "@apollo/client";
import ControllerConnector from "@cartridge/connector/controller";
import { sepolia } from "@starknet-react/chains";
import { useConnect, useContract, useProvider } from "@starknet-react/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { constants } from "starknet";

export default function Main() {
  return (
    <main
      className={`min-h-screen container mx-auto flex flex-col sm:pt-8 sm:p-8 lg:p-10 2xl:p-20 `}
    >
      <Home />
    </main>
  );
}

function Home() {
  const { connector } = useConnect();
  const network = useUIStore((state) => state.network);
  const onKatana = useUIStore((state) => state.onKatana);
  const { account, address, isConnected } = useNetworkAccount();
  const { provider } = useProvider();
  const isMuted = useUIStore((state) => state.isMuted);
  const adventurer = useAdventurerStore((state) => state.adventurer);
  const setAdventurer = useAdventurerStore((state) => state.setAdventurer);
  const updateAdventurerStats = useAdventurerStore(
    (state) => state.updateAdventurerStats
  );
  const [goldenTokens, setGoldenTokens] = useState<number[]>([]);
  const calls = useTransactionCartStore((state) => state.calls);
  const screen = useUIStore((state) => state.screen);
  const setScreen = useUIStore((state) => state.setScreen);
  const deathDialog = useUIStore((state) => state.deathDialog);
  const hasBeast = useAdventurerStore((state) => state.computed.hasBeast);
  const hasStatUpgrades = useAdventurerStore(
    (state) => state.computed.hasStatUpgrades
  );
  const owner = account?.address ? padAddress(account.address) : "";
  const isWrongNetwork = useUIStore((state) => state.isWrongNetwork);
  const setIsWrongNetwork = useUIStore((state) => state.setIsWrongNetwork);
  const topUpDialog = useUIStore((state) => state.topUpDialog);
  const showTopUpDialog = useUIStore((state) => state.showTopUpDialog);
  const setTopUpAccount = useUIStore((state) => state.setTopUpAccount);
  const setSpecialBeast = useUIStore((state) => state.setSpecialBeast);
  const isMintingLords = useUIStore((state) => state.isMintingLords);
  const isWithdrawing = useUIStore((state) => state.isWithdrawing);
  const setIsMintingLords = useUIStore((state) => state.setIsMintingLords);
  const setIsWithdrawing = useUIStore((state) => state.setIsWithdrawing);
  const hash = useLoadingStore((state) => state.hash);
  const specialBeastDefeated = useUIStore(
    (state) => state.specialBeastDefeated
  );
  const onboarded = useUIStore((state) => state.onboarded);
  const setSpecialBeastDefeated = useUIStore(
    (state) => state.setSpecialBeastDefeated
  );
  const encounterTable = useUIStore((state) => state.encounterTable);
  const setAdventurerEntropy = useUIStore(
    (state) => state.setAdventurerEntropy
  );
  const showProfile = useUIStore((state) => state.showProfile);
  const showLoginDialog = useUIStore((state) => state.showLoginDialog);
  const itemEntropy = useUIStore((state) => state.itemEntropy);
  const setItemEntropy = useUIStore((state) => state.setItemEntropy);
  const openInterlude = useUIStore((state) => state.openInterlude);
  const setOpenInterlude = useUIStore((state) => state.setOpenInterlude);
  const setG20Unlock = useUIStore((state) => state.setG20Unlock);
  const freeVRF = useUIStore((state) => state.freeVRF);
  const setFreeVRF = useUIStore((state) => state.setFreeVRF);

  const allMenuItems: Menu[] = useMemo(
    () => [
      { id: 1, label: "Start", screen: "start" as ScreenPage, disabled: false },
      { id: 2, label: "Play", screen: "play" as ScreenPage, disabled: false },
      {
        id: 3,
        label: "Inventory",
        screen: "inventory" as ScreenPage,
        disabled: false,
      },
      {
        id: 4,
        label: "Upgrade",
        screen: "upgrade" as ScreenPage,
        disabled: false,
      },
      {
        id: 5,
        label: "Leaderboard",
        screen: "leaderboard" as ScreenPage,
        disabled: false,
      },
      { id: 6, label: "Guide", screen: "guide" as ScreenPage, disabled: false },
    ],
    [onKatana]
  );

  const isDSTournamentActive =
    process.env.NEXT_PUBLIC_DS_TOURNAMENT_ACTIVE === "true";

  const dsMenuItems: Menu[] = useMemo(
    () => [
      { id: 1, label: "Start", screen: "start" as ScreenPage, disabled: false },
      { id: 2, label: "Play", screen: "play" as ScreenPage, disabled: false },
      {
        id: 3,
        label: "Inventory",
        screen: "inventory" as ScreenPage,
        disabled: false,
      },
      {
        id: 4,
        label: "Upgrade",
        screen: "upgrade" as ScreenPage,
        disabled: false,
      },
      {
        id: 5,
        label: "Leaderboard",
        screen: "leaderboard" as ScreenPage,
        disabled: false,
      },
      { id: 6, label: "Guide", screen: "guide" as ScreenPage, disabled: false },
      {
        id: 7,
        label: "Tournament",
        screen: "tournament" as ScreenPage,
        disabled: false,
      },
    ],
    [onKatana]
  );

  const mobileMenuItems: Menu[] = useMemo(
    () => [
      { id: 1, label: "Start", screen: "start" as ScreenPage, disabled: false },
      { id: 2, label: "Play", screen: "play" as ScreenPage, disabled: false },
      {
        id: 3,
        label: "Inventory",
        screen: "inventory" as ScreenPage,
        disabled: false,
      },
      {
        id: 4,
        label: "Upgrade",
        screen: "upgrade" as ScreenPage,
        disabled: false,
      },
      { id: 5, label: "Guide", screen: "guide" as ScreenPage, disabled: false },
    ],
    [onKatana]
  );

  const { contract: gameContract } = useContract({
    abi: Game,
    address: networkConfig[network!].gameAddress as `0x${string}`,
  });
  const { contract: lordsContract } = useContract({
    address: networkConfig[network!].lordsAddress as `0x${string}`,
    abi: Lords,
  });
  const { contract: ethContract } = useContract({
    address: networkConfig[network!].ethAddress as `0x${string}`,
    abi: Eth,
  });
  const { contract: beastsContract } = useContract({
    address: networkConfig[network!].beastsAddress as `0x${string}`,
    abi: Beasts,
  });
  const { contract: pragmaContract } = useContract({
    address: networkConfig[network!].pragmaAddress as `0x${string}`,
    abi: Pragma,
  });

  const { addTransaction } = useTransactionManager();
  const addToCalls = useTransactionCartStore((state) => state.addToCalls);
  const resetCalls = useTransactionCartStore((state) => state.resetCalls);
  const handleSubmitCalls = useTransactionCartStore(
    (state) => state.handleSubmitCalls
  );
  const startLoading = useLoadingStore((state) => state.startLoading);
  const stopLoading = useLoadingStore((state) => state.stopLoading);
  const pendingMessage = useLoadingStore((state) => state.pendingMessage);
  const setTxHash = useLoadingStore((state) => state.setTxHash);
  const setEquipItems = useUIStore((state) => state.setEquipItems);
  const setDropItems = useUIStore((state) => state.setDropItems);
  const setPotionAmount = useUIStore((state) => state.setPotionAmount);
  const setUpgrades = useUIStore((state) => state.setUpgrades);
  const setPurchaseItems = useUIStore((state) => state.setPurchaseItems);
  const setDeathMessage = useLoadingStore((state) => state.setDeathMessage);
  const showDeathDialog = useUIStore((state) => state.showDeathDialog);
  const setStartOption = useUIStore((state) => state.setStartOption);
  const setEntropyReady = useUIStore((state) => state.setEntropyReady);
  const fetchUnlocksEntropy = useUIStore((state) => state.fetchUnlocksEntropy);
  const setFetchUnlocksEntropy = useUIStore(
    (state) => state.setFetchUnlocksEntropy
  );
  const adventurerLeveledUp = useUIStore((state) => state.adventurerLeveledUp);
  const setAdventurerLeveledUp = useUIStore(
    (state) => state.setAdventurerLeveledUp
  );
  const adventurerEntropy = useUIStore((state) => state.adventurerEntropy);
  const [accountChainId, setAccountChainId] = useState<
    constants.StarknetChainId | undefined
  >();
  const setUsername = useUIStore((state) => state.setUsername);
  const setIsController = useUIStore((state) => state.setIsController);
  const setControllerDelegate = useUIStore(
    (state) => state.setControllerDelegate
  );

  useEffect(() => {
    const init = async () => {
      const username = await (
        connector as unknown as ControllerConnector
      ).username();
      setUsername(username || "");
      setControllerDelegate("");
    };
    if (connector?.id.includes("controller")) {
      setIsController(true);
      init();
    } else {
      setIsController(false);
      setControllerDelegate("");
      setUsername("");
    }
  }, [connector]);

  const [ethBalance, setEthBalance] = useState(BigInt(0));
  const [lordsBalance, setLordsBalance] = useState(BigInt(0));

  const getBalances = async () => {
    const balances = await fetchBalances(
      indexAddress(owner ?? "0x0").toLowerCase(),
      ethContract,
      lordsContract,
      gameContract
    );
    setEthBalance(balances[0]);
    setLordsBalance(balances[1]);
  };

  const getEthBalance = async () => {
    const ethBalance = await fetchEthBalance(address ?? "0x0", ethContract);
    setEthBalance(ethBalance);
  };

  useEffect(() => {
    if (!onKatana) {
      getBalances();
    }
  }, [account]);

  const { data, refetch, resetData, setData, setIsLoading, setNotLoading } =
    useQueriesStore();

  const {
    spawn,
    explore,
    attack,
    flee,
    upgrade,
    multicall,
    mintLords,
    withdraw,
    transferAdventurer,
    startSeason,
    lordsDollarValue,
    changeAdventurerName,
  } = useSyscalls({
    gameContract: gameContract!,
    ethContract: ethContract!,
    lordsContract: lordsContract!,
    beastsContract: beastsContract!,
    pragmaContract: pragmaContract!,
    rendererContractAddress: networkConfig[network!].rendererAddress,
    tournamentContractAddress: networkConfig[network!].tournamentAddress,
    addTransaction,
    queryData: data,
    resetData,
    setData,
    adventurer: adventurer!,
    addToCalls,
    calls,
    handleSubmitCalls,
    startLoading,
    stopLoading,
    setTxHash,
    setEquipItems,
    setDropItems,
    setDeathMessage,
    showDeathDialog,
    setScreen,
    setAdventurer,
    setStartOption,
    ethBalance,
    lordsBalance,
    showTopUpDialog,
    setTopUpAccount,
    account: account!,
    setSpecialBeastDefeated,
    setSpecialBeast,
    connector,
    getEthBalance,
    getBalances,
    setIsMintingLords,
    setIsWithdrawing,
    setEntropyReady,
    itemEntropy,
    setFetchUnlocksEntropy,
    setAdventurerLeveledUp,
    setG20Unlock,
    provider,
    network,
    freeVRF,
  });

  const playState = useMemo(
    () => ({
      isInBattle: hasBeast,
      isDead: deathDialog, // set this to true when player is dead
      isMuted: isMuted,
    }),
    [hasBeast, deathDialog, isMuted]
  );

  const { play, stop } = useMusic(playState, {
    loop: true,
  });

  const adventurerVariables = useMemo(() => {
    return {
      id: adventurer?.id ?? 0,
    };
  }, [adventurer?.id ?? 0]);

  useCustomQuery(
    network,
    "adventurerByIdQuery",
    getAdventurerById,
    adventurerVariables
  );

  useCustomQuery(
    network,
    "latestDiscoveriesQuery",
    getLatestDiscoveries,
    adventurerVariables
  );

  useCustomQuery(
    network,
    "itemsByAdventurerQuery",
    getItemsByAdventurer,
    adventurerVariables
  );

  useCustomQuery(
    network,
    "latestMarketItemsQuery",
    getLatestMarketItems,
    adventurerVariables
  );

  const lastBeastData = useCustomQuery(
    network,
    "lastBeastQuery",
    getLastBeastDiscovery,
    adventurerVariables
  );

  const beastVariables = useMemo(() => {
    return {
      adventurerId: adventurer?.id ?? 0,
      beast: lastBeastData?.discoveries[0]?.entity,
      seed: lastBeastData?.discoveries[0]?.seed,
    };
  }, [
    adventurer?.id ?? 0,
    lastBeastData?.discoveries[0]?.entity,
    lastBeastData?.discoveries[0]?.seed,
  ]);

  useCustomQuery(network, "beastQuery", getBeast, beastVariables);

  useCustomQuery(
    network,
    "battlesByBeastQuery",
    getBattlesByBeast,
    beastVariables
  );

  const handleFetchGoldenTokens = async () => {
    const goldenTokens = await getGoldenTokens(
      address ?? "",
      networkConfig[network!].goldenTokenAddress,
      network
    );
    setGoldenTokens(goldenTokens);
  };

  useEffect(() => {
    handleFetchGoldenTokens();
  }, [address, network]);

  const blobertTokenVariables = useMemo(() => {
    return {
      token: indexAddress(
        networkConfig[network!].tournamentWinnerAddress.toLowerCase()
      ),
      owner: indexAddress(address ?? "").toLowerCase(),
    };
  }, [address, network]);

  const client = useMemo(
    () => gameClient(networkConfig[network!].lsGQLURL),
    [network]
  );

  const { data: blobertsData } = useQuery(getOwnerTokens, {
    client,
    variables: blobertTokenVariables,
  });

  const handleSwitchAdventurer = useCallback(
    async (adventurerId: number) => {
      setIsLoading();
      const newAdventurerData = await refetch("adventurerByIdQuery", {
        id: adventurerId,
      });
      const newLatestDiscoveriesData = await refetch("latestDiscoveriesQuery", {
        id: adventurerId,
      });
      const newAdventurerItemsData = await refetch("itemsByAdventurerQuery", {
        id: adventurerId,
      });
      const newMarketItemsData = await refetch("latestMarketItemsQuery", {
        id: adventurerId,
      });
      const newLastBeastData = await refetch("lastBeastQuery", {
        id: adventurerId,
      });
      const newBeastData = await refetch("beastQuery", {
        adventurerId: adventurerId,
        beast: newLastBeastData.discoveries[0]?.entity,
        seed: newLastBeastData.discoveries[0]?.seed,
      });
      const newBattlesByBeastData = await refetch("battlesByBeastQuery", {
        adventurerId: adventurerId,
        beast: newLastBeastData.discoveries[0]?.entity,
        seed: newLastBeastData.discoveries[0]?.seed,
      });
      setData("adventurerByIdQuery", newAdventurerData);
      setData("latestDiscoveriesQuery", newLatestDiscoveriesData);
      setData("itemsByAdventurerQuery", newAdventurerItemsData);
      setData("latestMarketItemsQuery", newMarketItemsData);
      setData("lastBeastQuery", newLastBeastData);
      setData("beastQuery", newBeastData);
      setData("battlesByBeastQuery", newBattlesByBeastData);
      setNotLoading();
    },
    [owner, adventurer?.id]
  );

  useEffect(() => {
    return () => {
      stop();
    };
  }, [play, stop]);

  const mobileMenuDisabled = useMemo(
    () => [false, hasStatUpgrades, false, !hasStatUpgrades, false, false],
    [hasStatUpgrades]
  );

  const allMenuDisabled = useMemo(
    () => [
      false,
      hasStatUpgrades,
      false,
      !hasStatUpgrades,
      false,
      false,
      false,
    ],
    [hasStatUpgrades]
  );

  useEffect(() => {
    if (adventurer?.id && adventurer.health !== 0) {
      if (!hasStatUpgrades) {
        setScreen("play");
      } else {
        setScreen("upgrade");
      }
    }
  }, [adventurer, adventurerLeveledUp]);

  const getAccountChainId = async () => {
    if (account) {
      const chainId = await account!.getChainId();
      setAccountChainId(chainId);
    }
  };

  useEffect(() => {
    getAccountChainId();
    const isWrongNetwork =
      accountChainId !==
      (network === "mainnet"
        ? constants.StarknetChainId.SN_MAIN
        : network === "sepolia"
        ? "0x" + sepolia.id.toString(16)
        : "0x4b4154414e41"); // katana chain ID
    setIsWrongNetwork(isWrongNetwork);
  }, [account, accountChainId, isConnected]);

  useEffect(() => {
    resetCalls();
    setDropItems([]);
    setEquipItems([]);
    setPotionAmount(0);
    setPurchaseItems([]);
    setUpgrades({ ...ZeroUpgrade });
  }, [adventurer]);

  const spawnLoader =
    pendingMessage &&
    (pendingMessage === "Spawning Adventurer" ||
      pendingMessage.includes("Spawning Adventurer"));

  const [costToPlay, setCostToPlay] = useState<bigint>(BigInt(0));

  useEffect(() => {
    const getCostToPlay = async () => {
      if (gameContract) {
        const result = await gameContract.call("get_cost_to_play", []);
        setCostToPlay(result as bigint);
      }
    };
    getCostToPlay();
  }, [gameContract]);

  const { setCondition } = useController();
  useControls();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_NETWORK === "arcade") {
      setCondition("a", screen === "play" && hasBeast);
      setCondition("s", screen === "play" && hasBeast);
      setCondition("f", screen === "play" && hasBeast);
      setCondition("g", screen === "play" && hasBeast);
      setCondition("e", screen === "play" && !hasBeast);
      setCondition("r", screen === "play" && !hasBeast);
      setCondition("u", screen === "upgrade");
      setCondition(
        "i",
        screen === "play" ||
          screen === "beast" ||
          screen === "upgrade" ||
          screen === "inventory"
      );
    }
  }, [screen, hasBeast, network]);

  useEffect(() => {
    if (!onboarded) {
      setScreen("onboarding");
    } else if (onboarded) {
      setScreen("start");
    }
  }, [onboarded]);

  useEffect(() => {
    const fetchEntropy = async () => {
      if (adventurer?.id) {
        const adventurerMeta: any = await gameContract!.call(
          "get_adventurer_meta",
          [adventurer?.id!]
        );
        const entropy = adventurerMeta.level_seed;
        if (entropy !== BigInt(0)) {
          setAdventurerLeveledUp(false);
          setAdventurerEntropy(BigInt(entropy.toString()));
          setEntropyReady(true);
          clearInterval(interval);
        }
      }
    };

    // Call the function immediately
    fetchEntropy();

    // Set up the interval to call the function every 5 seconds
    const interval = setInterval(fetchEntropy, VRF_WAIT_TIME);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [adventurer?.level]);

  const fetchItemSpecialsData = async () => {
    const updatedAdventurer = (await gameContract!.call("get_adventurer", [
      adventurer?.id!,
    ])) as any;
    const itemsWithSpecials = await refetch("itemsByAdventurerQuery", {
      id: adventurer?.id,
    });
    updateAdventurerStats({
      health: parseInt(updatedAdventurer.health),
      strength: parseInt(updatedAdventurer.stats.strength),
      dexterity: parseInt(updatedAdventurer.stats.dexterity),
      vitality: parseInt(updatedAdventurer.stats.vitality),
      intelligence: parseInt(updatedAdventurer.stats.intelligence),
      wisdom: parseInt(updatedAdventurer.stats.wisdom),
      charisma: parseInt(updatedAdventurer.stats.charisma),
      luck: parseInt(updatedAdventurer.stats.luck),
    });
    setData("itemsByAdventurerQuery", itemsWithSpecials);
  };

  useEffect(() => {
    const fetchEntropy = async () => {
      if (adventurer?.id && fetchUnlocksEntropy) {
        const adventurerMeta: any = await gameContract!.call(
          "get_adventurer_meta",
          [adventurer?.id!]
        );
        const entropy = adventurerMeta.item_specials_seed;
        if (entropy !== BigInt(0)) {
          // Add a 5-second delay before executing the rest of the logic
          setTimeout(() => {
            setFetchUnlocksEntropy(false);
            setItemEntropy(BigInt(entropy.toString()));
            fetchItemSpecialsData();
            clearInterval(interval);
          }, 5000); // 5000 milliseconds = 5 seconds
        }
      }
    };

    // Call the function immediately
    if (itemEntropy === BigInt(0)) {
      fetchEntropy();
    }

    // Set up the interval to call the function every 5 seconds
    const interval = setInterval(fetchEntropy, VRF_WAIT_TIME);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [fetchUnlocksEntropy]);

  useEffect(() => {
    if (adventurerLeveledUp || fetchUnlocksEntropy) {
      setOpenInterlude(true);
    }
  }, [adventurerLeveledUp, fetchUnlocksEntropy]);

  useEffect(() => {
    const fetchFreeVRF = async () => {
      await gameContract!
        .call("free_vrf_promotion_active", [])
        .then((res: any) => {
          setFreeVRF(res as boolean);
        });
    };
    fetchFreeVRF();
  }, []);

  const vitBoostRemoved = useUIStore((state) => state.vitBoostRemoved);
  const setVitBoostRemoved = useUIStore((state) => state.setVitBoostRemoved);
  const chaBoostRemoved = useUIStore((state) => state.chaBoostRemoved);
  const setChaBoostRemoved = useUIStore((state) => state.setChaBoostRemoved);
  const purchaseItems = useUIStore((state) => state.purchaseItems);
  const equipItems = useUIStore((state) => state.equipItems);
  const dropItems = useUIStore((state) => state.dropItems);
  const adventurerItems = useQueriesStore(
    (state) => state.data.itemsByAdventurerQuery?.items || []
  );

  const [statRemovalWarning, setStatRemovalWarning] = useState<
    "vitality" | "charisma" | ""
  >("");

  useEffect(() => {
    const chaBoostRemoved = calculateChaBoostRemoved(
      purchaseItems,
      adventurer!,
      adventurerItems,
      equipItems,
      dropItems
    );
    setChaBoostRemoved(chaBoostRemoved);

    const vitBoostRemoved = calculateVitBoostRemoved(
      purchaseItems,
      adventurer!,
      adventurerItems,
      equipItems,
      dropItems
    );
    setVitBoostRemoved(vitBoostRemoved);
  }, [purchaseItems, adventurer, adventurerItems, equipItems, dropItems]);

  useEffect(() => {
    if (vitBoostRemoved > 0) {
      setStatRemovalWarning("vitality");
    } else if (chaBoostRemoved > 0) {
      setStatRemovalWarning("charisma");
    }
  }, [vitBoostRemoved, chaBoostRemoved]);

  return (
    <>
      {/* <Toaster /> */}
      {openInterlude && !onKatana && (
        <InterludeScreen type={fetchUnlocksEntropy ? "item" : "level"} />
      )}
      <NetworkSwitchError network={network} isWrongNetwork={isWrongNetwork} />
      {isMintingLords && <TokenLoader isToppingUpLords={isMintingLords} />}
      {isWithdrawing && <TokenLoader isWithdrawing={isWithdrawing} />}
      <div className="flex flex-col w-full">
        {specialBeastDefeated && (
          <SpecialBeast beastsContract={beastsContract!} />
        )}
        {topUpDialog && (
          <TopUp
            ethBalance={ethBalance}
            lordsBalance={lordsBalance}
            costToPlay={costToPlay}
            mintLords={mintLords}
            gameContract={gameContract!}
            lordsContract={lordsContract!}
            ethContract={ethContract!}
            showTopUpDialog={showTopUpDialog}
          />
        )}
        {statRemovalWarning && (
          <StatRemovalWarning
            statWarning={statRemovalWarning}
            handleConfirmAction={() => {
              setStatRemovalWarning("");
            }}
          />
        )}
        {!spawnLoader && hash && (
          <div className="sm:hidden">
            <TxActivity />
          </div>
        )}
        <Header
          multicall={multicall}
          mintLords={mintLords}
          ethBalance={ethBalance}
          lordsBalance={lordsBalance}
          gameContract={gameContract!}
          costToPlay={costToPlay}
        />
      </div>
      <div className="w-full h-1 sm:h-6 sm:my-2 bg-terminal-green text-terminal-black px-4">
        {!spawnLoader && hash && (
          <div className="hidden sm:block">
            <TxActivity />
          </div>
        )}
      </div>
      <NotificationDisplay />

      {deathDialog && <DeathDialog />}
      <div className="flex flex-col w-full h-[600px] sm:h-[625px]">
        <>
          <div className="sm:hidden flex  sm:justify-normal sm:pb-2">
            <ScreenMenu
              buttonsData={mobileMenuItems}
              onButtonClick={(value) => {
                setScreen(value);
              }}
              disabled={mobileMenuDisabled}
              hideEncounters={
                adventurerEntropy === BigInt(0) || !adventurer?.id
              }
            />
          </div>
          <div className="hidden sm:block flex justify-center sm:justify-normal sm:pb-2">
            <ScreenMenu
              buttonsData={isDSTournamentActive ? dsMenuItems : allMenuItems}
              onButtonClick={(value) => {
                setScreen(value);
              }}
              disabled={allMenuDisabled}
            />
          </div>

          <div className="sm:hidden">
            <MobileHeader />
          </div>
          <div className="w-full h-[550px] xl:h-[500px] 2xl:h-[580px]">
            {screen === "start" && (
              <AdventurerScreen
                spawn={spawn}
                startSeason={startSeason}
                handleSwitchAdventurer={handleSwitchAdventurer}
                gameContract={gameContract!}
                goldenTokens={goldenTokens}
                blobertsData={blobertsData}
                getBalances={getBalances}
                costToPlay={costToPlay}
                transferAdventurer={transferAdventurer}
                lordsDollarValue={lordsDollarValue}
                changeAdventurerName={changeAdventurerName}
              />
            )}
            {screen === "play" && (
              <ActionsScreen
                explore={explore}
                attack={attack}
                flee={flee}
                gameContract={gameContract!}
                beastsContract={beastsContract!}
              />
            )}
            {screen === "inventory" && (
              <InventoryScreen gameContract={gameContract!} />
            )}
            {screen === "leaderboard" && <LeaderboardScreen />}
            {screen === "upgrade" && (
              <UpgradeScreen upgrade={upgrade} gameContract={gameContract!} />
            )}
            {screen === "profile" && <Profile gameContract={gameContract!} />}
            {screen === "encounters" && <EncountersScreen />}
            {screen === "guide" && <GuideScreen />}
            {screen === "collections leaderboard" && (
              <CollectionsLeaderboardScreen />
            )}
            {screen === "tournament" && (
              <DSTournamentOverview lordsCost={costToPlay} />
            )}
            {screen === "settings" && <Settings />}
            {screen === "player" && <Player gameContract={gameContract!} />}
            {screen === "wallet" && <WalletSelect />}

            {encounterTable && <EncounterDialog />}

            {showProfile && (
              <div className="absolute flex items-center justify-center top-0 right-0 left-0 w-full h-full bg-black/50">
                <span className="w-full h-full bg-black/50" />
                <ProfileDialog
                  withdraw={withdraw}
                  ethBalance={ethBalance}
                  lordsBalance={lordsBalance}
                  ethContractAddress={ethContract!.address}
                  lordsContractAddress={lordsContract!.address}
                />
              </div>
            )}
            {showLoginDialog && <LoginDialog />}
          </div>
        </>
      </div>
    </>
  );
}
