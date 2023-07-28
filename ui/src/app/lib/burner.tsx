import { useCallback, useEffect, useState } from "react";
import {
    Account,
    AccountInterface,
    CallData,
    ec,
    hash,
    Provider,
    stark,
    TransactionStatus,
} from "starknet";
import Storage from "./storage";
import { useAccount } from "@starknet-react/core";

const PREFUND_AMOUNT = "0x2386f26fc10000"; // 0.001ETH

const provider = new Provider({
    sequencer: {
        baseUrl: 'https://alpha4.starknet.io',
    }
});

type BurnerStorage = {
    [address: string]: {
        privateKey: string;
        publicKey: string;
        deployTx: string;
        active: boolean;
    };
};

export const useBurner = () => {
    const { account: walletAccount } = useAccount();
    const [account, setAccount] = useState<Account>();
    const [isDeploying, setIsDeploying] = useState(false);

    // init
    useEffect(() => {
        const storage: BurnerStorage = Storage.get("burners");
        if (storage) {
            // check one to see if exists, perhaps appchain restarted
            const firstAddr = Object.keys(storage)[0];
            walletAccount?.getTransactionReceipt(storage[firstAddr].deployTx).catch(() => {
                setAccount(undefined);
                Storage.remove("burners");
                throw new Error("burners not deployed, chain may have restarted");
            });

            // set active account
            for (let address in storage) {
                if (storage[address].active) {
                    const burner = new Account(
                        provider,
                        address,
                        storage[address].privateKey,
                    );
                    setAccount(burner);
                    return;
                }
            }
        }
    }, []);

    const list = useCallback(() => {
        let storage = Storage.get("burners") || {};
        return Object.keys(storage).map((address) => {
            return {
                address,
                active: storage[address].active,
            };
        });
    }, []);

    const select = useCallback((address: string) => {
        let storage = Storage.get("burners") || {};
        if (!storage[address]) {
            throw new Error("burner not found");
        }

        for (let addr in storage) {
            storage[addr].active = false;
        }
        storage[address].active = true;

        Storage.set("burners", storage);
        const burner = new Account(provider, address, storage[address].privateKey);
        setAccount(burner);
    }, []);

    const get = useCallback((address: string) => {
        let storage = Storage.get("burners") || {};
        if (!storage[address]) {
            throw new Error("burner not found");
        }

        return new Account(provider, address, storage[address].privateKey);

    }, []);

    const create = useCallback(async () => {
        setIsDeploying(true);
        const privateKey = stark.randomAddress();
        const publicKey = ec.starkCurve.getStarkKey(privateKey);
        const address = hash.calculateContractAddressFromHash(
            publicKey,
            process.env.NEXT_PUBLIC_ACCOUNT_CLASS_HASH!,
            CallData.compile({ publicKey }),
            0,
        );

        if (!walletAccount) {
            throw new Error("wallet account not found");
        }

        await prefundAccount(address, walletAccount);

        // deploy burner
        const burner = new Account(provider, address, privateKey);

        const { transaction_hash: deployTx } = await burner.deployAccount({
            classHash: process.env.NEXT_PUBLIC_ACCOUNT_CLASS_HASH!,
            constructorCalldata: CallData.compile({ publicKey }),
            addressSalt: publicKey,
        });

        console.log(deployTx)

        // save burner
        let storage = Storage.get("burners") || {};
        for (let address in storage) {
            storage[address].active = false;
        }

        storage[address] = {
            privateKey,
            publicKey,
            deployTx,
            active: true,
        };

        setAccount(burner);
        setIsDeploying(false);
        Storage.set("burners", storage);
        console.log("burner created: ", address);

        return burner;
    }, []);

    return {
        get,
        list,
        select,
        create,
        account,
        isDeploying,
    };
};

const prefundAccount = async (address: string, account: AccountInterface) => {
    const { transaction_hash } = await account.execute({
        contractAddress: process.env.NEXT_PUBLIC_ETH_CONTRACT_ADDRESS!,
        entrypoint: "transfer",
        calldata: CallData.compile([address, PREFUND_AMOUNT, "0x0"]),
    });

    console.log(transaction_hash)

    return await account.waitForTransaction(transaction_hash, {
        retryInterval: 1000,
        successStates: [TransactionStatus.ACCEPTED_ON_L2],
    });
};