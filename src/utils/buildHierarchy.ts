// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0
// Modifications Copyright (c) 2021-2022 Thibaut Sardan

import { ETHEREUM_NETWORK_LIST, NetworkProtocols, SUBSTRATE_NETWORK_LIST } from 'constants/networkSpecs';
import { AccountType } from 'types/accountTypes';
import { NetworkParams } from 'types/networkTypes';

import { decodeAddress } from '@polkadot/util-crypto';

export type AccountWithChildren = AccountType & {
    children?: AccountWithChildren[];
  }

  type ChildFilter = (account: AccountType) => AccountWithChildren;

function compareByCreation (a: AccountType, b: AccountType): number {
	return (a.createdAt || Infinity) - (b.createdAt || Infinity);
}

function compareByName (a: AccountType, b: AccountType): number {
	const nameA = a.name?.toUpperCase() || '';
	const nameB = b.name?.toUpperCase() || '';

	return nameA.localeCompare(nameB);
}

// function compareByPath (a: AccountType, b: AccountType): number {
// 	const suriA = a.derivationPath?.toUpperCase() || '';
// 	const suriB = b.derivationPath?.toUpperCase() || '';

// 	return suriA.localeCompare(suriB);
// }

function compareByNetwork (a: AccountType, b: AccountType): number {
	const networkA = SUBSTRATE_NETWORK_LIST[a?.networkKey].title || '';
	const networkB = SUBSTRATE_NETWORK_LIST[b?.networkKey].title || '';

	return networkA.localeCompare(networkB);
}

function compareByNameThenCreation (a: AccountType, b: AccountType): number {
	// if the names are equal, compare by creation time
	return compareByName(a,b) ||  compareByCreation(a, b);
}

function compareByNetworkNameCreation (a: AccountType, b: AccountType): number {
	// if the networks are equal, compare by name then creation time
	return compareByNetwork(a, b) || compareByNameThenCreation(a, b);
}

export function accountWithChildren (accounts: AccountType[]): ChildFilter {
	return (account: AccountType): AccountWithChildren => {
		const children = accounts
			.filter(({ parent }) => {
				let isParent = false

				try {
					isParent = decodeAddress(account.address).toString() === parent
				} catch(e){
					console.error('Error while decoding the parent address - 2', e)
				}

				return isParent
			})
			.map(accountWithChildren(accounts))
			.sort(compareByNetworkNameCreation);

		const res = children.length === 0
			? account
			: { children, ...account };

		return res
	};
}

const ethereumNetworks: Map<string, NetworkParams> = new Map(Object.entries(ETHEREUM_NETWORK_LIST));
const isEthereum = (networkKey: string) => ethereumNetworks.get(networkKey)?.protocol === NetworkProtocols.ETHEREUM;

export function buildHierarchy (accounts: AccountType[]): AccountWithChildren[] {
	const substrateAccounts = accounts.filter(({ networkKey }) => !isEthereum(networkKey))
	const ethereumAccounts = accounts.filter(({ networkKey }) => isEthereum(networkKey))

	return substrateAccounts.filter(({ parent }) => {
		const parentExistsInList = substrateAccounts.some(({ address }) => parent === decodeAddress(address).toString())

		// it is not a child account (it has no parent) or it's a child that we don't have the parent address for (it'll be displayed as a parent)
		return !parent || !parentExistsInList
	})
		.map(accountWithChildren(accounts))
		.sort(compareByNetwork)
		.sort(compareByNetworkNameCreation)
		.concat(ethereumAccounts);
}