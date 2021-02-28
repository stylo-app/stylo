// Copyright 2015-2020 Parity Technologies (UK) Ltd.
// Modifications Copyright (c) 2021 Thibaut Sardan

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
import { LegacyAccount } from 'types/identityTypes';
import { SubstrateNetworkParams } from 'types/networkTypes';
import { mergeNetworks, serializeNetworks } from 'utils/networksUtils';

import { encodeAddress } from '@polkadot/util-crypto';

const SUSTRATE_SS58_PREFIX = 42;

function handleError(e: Error, label: string): any[] {
	console.warn(`loading ${label} error`, e);

	return [];
}

/*
 * ========================================
 *	Accounts Store
 * ========================================
 */
const currentAccountsStore = {
	keychainService: 'accounts_v1',
	sharedPreferencesName: 'accounts_v1'
};

export async function loadAccounts(version = 1): Promise<LegacyAccount[]> {
	if (!SecureStorage) {
		return Promise.resolve([]);
	}

	const accountsStoreVersion = `accounts_v${version}`;
	const accountsStore = {
		keychainService: accountsStoreVersion,
		sharedPreferencesName: accountsStoreVersion
	};

	return SecureStorage.getAllItems(accountsStore)
		.then((storedAccounts: { [key: string]: string }) => {

			const accounts = Object.entries(storedAccounts).map(([_, value]) => JSON.parse(value) as LegacyAccount)

			return accounts;
		});
}

export const deleteAccount = (address: string, isEthereum: boolean): Promise<void> => {
	const dbAddress = isEthereum
		? address
		: encodeAddress(address, SUSTRATE_SS58_PREFIX);

	return	SecureStorage.deleteItem(dbAddress, currentAccountsStore);
}

export const saveAccount = (account: LegacyAccount, isEthereum: boolean): Promise<void> => {
	const address = isEthereum
		? account.address
		: encodeAddress(account.address, SUSTRATE_SS58_PREFIX);

	return SecureStorage.setItem(address, JSON.stringify(account, null, 0), currentAccountsStore);
}

/*
 * ========================================
 *	Networks Store
 * ========================================
 */
const networkStorage = {
	keychainService: 'parity_signer_updated_networks',
	sharedPreferencesName: 'parity_signer_updated_networks'
};
const currentNetworkStorageLabel = 'networks_v1';

export async function loadNetworks(): Promise<
	Map<string, SubstrateNetworkParams>
	> {
	try {
		const networksJson = await SecureStorage.getItem(currentNetworkStorageLabel,
			networkStorage);

		if (!networksJson) return new Map(Object.entries(SUBSTRATE_NETWORK_LIST));
		const networksEntries = JSON.parse(networksJson);

		return mergeNetworks(SUBSTRATE_NETWORK_LIST, networksEntries);
	} catch (e) {
		handleError(e, 'networks');

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
	} catch (e) {
		handleError(e, 'networks');
	}
}

/*
 * ========================================
 *	Privacy Policy and Terms Conditions Store
 * ========================================
 */

const VERSION = 1;

export async function loadTaCAndPPConfirmation(): Promise<boolean> {
	const result = await AsyncStorage.getItem(`TaCAndPPConfirmation_v${VERSION}`);

	return !!result;
}

export async function saveTaCAndPPConfirmation(): Promise<void> {
	await AsyncStorage.setItem(`TaCAndPPConfirmation_v${VERSION}`, 'yes');
}
