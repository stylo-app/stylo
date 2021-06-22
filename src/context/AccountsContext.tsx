import { NetworkProtocols } from 'constants/networkSpecs';
import { createContext, default as React, useCallback, useContext, useEffect, useState } from 'react';
import { AccountType, isUnlockedAccount, LockedAccount, UnlockedAccount } from 'types/accountTypes';
import { isEthereumNetwork, NetworkParams, SubstrateNetworkParams } from 'types/networkTypes';
import { emptyAccount } from 'utils/account';
import { deleteAccount as deleteDbAccount, loadAccounts, saveAccount as saveDbAccount } from 'utils/db';
import { decryptData, encryptData } from 'utils/native';
import { parseSURI } from 'utils/suri';

import { decodeAddress , encodeAddress } from '@polkadot/util-crypto';

import { NetworksContext } from './NetworksContext';

export interface AccountsContextType {
	accountExists: (address: string | null | undefined, network: NetworkParams | null) => boolean;
	accounts: AccountType[];
	accountsLoaded: boolean;
	changeCurrentAccountNetwork: (networkKey: string) => Promise<string | undefined>
	deleteAccount: (accountAddress: string) => Promise<void>;
	lockAccount: (accountKey: string) => void;
	getAccountByAddress: (address: string) => AccountType | undefined;
	getSelectedAccount: () => AccountType | undefined;
	newAccount: AccountType;
	saveAccount: (account: AccountType, pin?: string) => Promise<void>;
	selectAccount: (accountAddress: string) => void;
	submitNew: (pin: string) => Promise<void>;
	unlockAccount: (accountKey: string, pin: string) => Promise<boolean>;
	updateNew: (accountUpdate: Partial<AccountType>) => void;
};

interface AccountsContextProviderProps {
	children?: React.ReactElement;
}

export const AccountsContext = createContext({} as AccountsContextType);

export function AccountsContextProvider({ children }: AccountsContextProviderProps): React.ReactElement {
	const [selectedAccountAddress, setSelectedAccountAddress] = useState('');
	const [accounts, setAccounts] = useState<AccountType[]>([]);
	const [newAccount, setNewAccount] = useState<AccountType>(emptyAccount());
	const [accountsLoaded, setAccountLoaded] = useState(false);
	const { getNetwork } = useContext(NetworksContext);

	const loadAccountsFromDb = async (): Promise<void> => {
		const loadedAccounts = await loadAccounts();

		setAccounts(loadedAccounts);
		setAccountLoaded(true);
	};

	useEffect(() => {
		loadAccountsFromDb()
			.catch((e) => console.error('Error while loading accounts from db', e));
	}, []);

	const updateNew = useCallback((accountUpdate: Partial<AccountType>): void => {

		setNewAccount((previous: AccountType | undefined) => ({
			...previous,
			...accountUpdate
		} as AccountType))
	}, [])

	const accountExists = (address : string | null | undefined, network: NetworkParams | null) => {
		if (!address){
			return false;
		}

		const existingAddress = getAccountByAddress(address);

		if (existingAddress) {
			return true
		}

		// No need to decode anything with ETH
		// because if there's no address found, no eth account exists with this address
		if (network && isEthereumNetwork(network)) {
			return false
		}

		// we're left with a substrate network, we can decode the address
		const searchingForPubKey = decodeAddress(address).toString();

		// and compare the public keys
		const existing = accounts.filter((account) => !isEthereumAccount(account))
			.some((substrateAccount) => {

				if(searchingForPubKey === decodeAddress(substrateAccount.address).toString()){
					// this will break the "some" iteration
					return true
				}

				return false
			})

		return existing;

	}

	function _deleteSensitiveData({ address, createdAt, derivationPath, encryptedSeed, isLegacy, name, networkKey, recovered, updatedAt, validBip39Seed }: UnlockedAccount): LockedAccount {
		return {
			address,
			createdAt,
			derivationPath,
			encryptedSeed,
			isLegacy,
			name,
			networkKey,
			recovered,
			updatedAt,
			validBip39Seed
		} as LockedAccount;
	}

	async function saveAccount(account: AccountType, pin?: string): Promise<void> {
		try {
			// for account creation
			let accountToSave = account;

			if (pin && isUnlockedAccount(account)) {
				account.encryptedSeed = await encryptData(account.seed, pin);
				accountToSave = _deleteSensitiveData(account);
			}

			const isEthereum = getNetwork(account.networkKey)?.protocol === NetworkProtocols.ETHEREUM;

			await saveDbAccount(accountToSave, isEthereum);
			loadAccountsFromDb();
		} catch (e) {
			console.error(e);
		}
	}

	async function submitNew(pin: string): Promise<void> {
		try{
			if (!newAccount.seed) {
				console.error('Account seed is empty')

				return
			}

			await saveAccount(newAccount, pin);

			// setAccounts((prev) => [...prev, newAccount]);
			setNewAccount(emptyAccount());
			loadAccountsFromDb();
		} catch (e) {
			console.error('error when saving new account', e)
		}
	}

	const isEthereumAccount = (account: AccountType): boolean => {
		const network = getNetwork(account.networkKey)

		return !!network && isEthereumNetwork(network)
	}

	async function deleteAccount(addressToDelete: string): Promise<void> {
		const accountToDelete = getAccountByAddress(addressToDelete)

		if (!accountToDelete){
			console.error('Could not find the account to delete with address',addressToDelete)

			return;
		}

		const { address } = accountToDelete
		const newAccounts = accounts.filter((account) => {

			return account.address !== address
		})
		const isEthereum = isEthereumAccount(accountToDelete)

		await deleteDbAccount(address, isEthereum);
		setAccounts(newAccounts)
		setSelectedAccountAddress('');
	}

	const getAccountsWithout = (address: string): AccountType[] => {

		return accounts.filter((account) => account.address !== address)
	}

	const getAccountByAddress = (address: string): AccountType | undefined => {

		return accounts.find((account) => account.address.toLowerCase() === address.toLowerCase())
	}

	async function unlockAccount(address: string, pin: string): Promise<boolean> {
		const account = getAccountByAddress(address) ;

		if (!account || !account.encryptedSeed) {
			console.error('No account found for the address', address)

			return false;
		}

		try {
			const decryptedSeed = await decryptData(account.encryptedSeed, pin);
			const { derivePath, password, phrase } = parseSURI(decryptedSeed);
			const unlockedAccount = {
				derivationPassword: password || '',
				derivationPath: derivePath || '',
				seed: decryptedSeed,
				seedPhrase: phrase || '',
				...account
			}

			setAccounts([
				...getAccountsWithout(address),
				unlockedAccount
			]);
		} catch (e) {
			return false;
		}

		return true;
	}

	function lockAccount(address: string): void {
		const account = getAccountByAddress(address);

		if (account && isUnlockedAccount(account)) {
			const lockedAccount = _deleteSensitiveData(account);

			setAccounts([
				...getAccountsWithout(address),
				lockedAccount
			]);
		}
	}

	function selectAccount(address: string): void {

		setSelectedAccountAddress(address);
	}

	const getSelectedAccount = () => getAccountByAddress(selectedAccountAddress);

	const changeCurrentAccountNetwork = async (networkKey: string) => {
		const newAccount = getSelectedAccount()

		if (!newAccount || !newAccount.address){
			console.error('no account selected')

			return Promise.reject('No account selected')
		}

		const newAddresse = encodeAddress(newAccount?.address, (getNetwork(networkKey) as SubstrateNetworkParams).prefix)

		try {
			await saveAccount({ ...newAccount, address: newAddresse,networkKey })

			return Promise.resolve(newAddresse)
		} catch (e) {
			console.error('error saving the account', e)
		}
	}

	return (
		<AccountsContext.Provider value={{
			accountExists,
			accounts,
			accountsLoaded,
			changeCurrentAccountNetwork,
			deleteAccount,
			getAccountByAddress,
			getSelectedAccount,
			lockAccount,
			newAccount,
			saveAccount,
			selectAccount,
			submitNew,
			unlockAccount,
			updateNew
		}}>
			{children}
		</AccountsContext.Provider>
	);
}
