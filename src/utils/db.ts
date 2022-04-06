// Copyright 2015-2020 Parity Technologies (UK) Ltd.
// Modifications Copyright (c) 2021-2022 Thibaut Sardan

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import AsyncStorage from '@react-native-community/async-storage';
import { SUBSTRATE_NETWORK_LIST } from 'constants/networkSpecs';
import SecureStorage from 'react-native-secure-storage';
import { AccountType } from 'types/accountTypes';
import { SubstrateNetworkParams } from 'types/networkTypes';
import { mergeNetworks, serializeNetworks } from 'utils/networksUtils';

import { cryptoWaitReady, decodeAddress } from '@polkadot/util-crypto';

function handleError(e: Error, label: string): any[] {
	console.warn(`loading ${label} error`, e);

	return [];
}

/*
 * ========================================
 *	Accounts Store
 * ========================================
 */
const ACCOUNT_STORAGE_BASE_NAME = 'account_storage'

export async function loadAccounts(version = 1): Promise<AccountType[]> {

	if (!SecureStorage) {
		return Promise.resolve([]);
	}

	const accountsStoreVersion = `${ACCOUNT_STORAGE_BASE_NAME}_v${version}`;
	const accountsStore = {
		keychainService: accountsStoreVersion,
		sharedPreferencesName: accountsStoreVersion
	};

	return SecureStorage.getAllItems(accountsStore)
		.then((storedAccounts: { [key: string]: string }) => {

			const accounts = Object.entries(storedAccounts).map(([_, value]) => JSON.parse(value) as AccountType)

			return accounts;
		});
}

const CURRENT_ACCOUNT_VERSION = 1;
const currentAccountsStore = {
	keychainService: `${ACCOUNT_STORAGE_BASE_NAME}_v${CURRENT_ACCOUNT_VERSION}`,
	sharedPreferencesName: `${ACCOUNT_STORAGE_BASE_NAME}_v${CURRENT_ACCOUNT_VERSION}`
};

const ACCOUNT_BASE_KEY = 'account:'

export const deleteAccount = async (address: string, isEthereum: boolean): Promise<void> => {
	await cryptoWaitReady().catch(console.log)
	const dbKey = isEthereum
		? address
		: decodeAddress(address).toString();

	return SecureStorage.deleteItem(`${ACCOUNT_BASE_KEY}${dbKey}`, currentAccountsStore);
}

export const saveAccount = async (account: AccountType, isEthereum: boolean): Promise<void> => {
	await cryptoWaitReady().catch(console.log)
	const dbKey = isEthereum
		? account.address
		: decodeAddress(account.address).toString();
	const accountWithVersion = { ...account, version: CURRENT_ACCOUNT_VERSION }

	return SecureStorage.setItem(`${ACCOUNT_BASE_KEY}${dbKey}`, JSON.stringify(accountWithVersion, null, 0), currentAccountsStore);
}

/*
 * ========================================
 *	Networks Store
 * ========================================
 */

const NETWORK_STORAGE_BASE_NAME = 'networkStorage'
const CURRENT_NETWORK_VERSION = 1;
const networkStorage = {
	keychainService: NETWORK_STORAGE_BASE_NAME,
	sharedPreferencesName: NETWORK_STORAGE_BASE_NAME
};
const currentNetworkStorageLabel = `${NETWORK_STORAGE_BASE_NAME}_v${CURRENT_NETWORK_VERSION}`;

export async function loadNetworks(): Promise<Map<string, SubstrateNetworkParams>> {
	try {
		const networksJson = await SecureStorage.getItem(currentNetworkStorageLabel, networkStorage);

		if (!networksJson) return new Map(Object.entries(SUBSTRATE_NETWORK_LIST));
		const networksEntries = JSON.parse(networksJson);

		return mergeNetworks(SUBSTRATE_NETWORK_LIST, networksEntries);
	} catch (e: unknown) {
		if (e instanceof Error) {
			handleError(e, 'networks');
		}

		console.error(e)

		return new Map();
	}
}

export async function saveNetworks(newNetwork: SubstrateNetworkParams): Promise<void> {
	try {
		let addedNetworks = new Map();
		const addedNetworkJson = await SecureStorage.getItem(currentNetworkStorageLabel, networkStorage);

		if (addedNetworkJson) addedNetworks = new Map(JSON.parse(addedNetworkJson));

		addedNetworks.set(newNetwork.genesisHash, newNetwork);
		SecureStorage.setItem(currentNetworkStorageLabel,
			serializeNetworks(addedNetworks),
			networkStorage);
	} catch (e: unknown) {
		if (e instanceof Error) {
			handleError(e, 'networks');
		}

		console.error(e)
	}
}

/*
 * ========================================
 *	Privacy Policy and Terms Conditions Store
 * ========================================
 */

const TAC_VERSION = 1;
const TAC_BASE_NAME = 'TaCAndPPConfirmation'

export async function loadTaCAndPPConfirmation(): Promise<boolean> {
	const result = await AsyncStorage.getItem(`${TAC_BASE_NAME}_V${TAC_VERSION}`);

	return !!result;
}

export async function saveTaCAndPPConfirmation(): Promise<void> {
	await AsyncStorage.setItem(`${TAC_BASE_NAME}_V${TAC_VERSION}`, 'yes');
}
