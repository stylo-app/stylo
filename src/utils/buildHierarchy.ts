// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0
// Modifications Copyright (c) 2021-2022 Thibaut Sardan

import { ETHEREUM_NETWORK_LIST, NetworkProtocols } from 'constants/networkSpecs';
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

function compareByPath (a: AccountType, b: AccountType): number {
	const suriA = a.derivationPath?.toUpperCase() || '';
	const suriB = b.derivationPath?.toUpperCase() || '';

	return suriA.localeCompare(suriB);
}

function compareByNetwork (a: AccountType, b: AccountType): number {
	const networkA = a?.networkKey || '';
	const networkB = b?.networkKey || '';

	return networkA.localeCompare(networkB);
}

function compareByPathThenCreation (a: AccountType, b: AccountType): number {
	// if the paths are equal, compare by creation time
	return compareByPath(a, b) || compareByCreation(a, b);
}

function compareByNameThenPathThenCreation (a: AccountType, b: AccountType): number {
	// This comparison happens after an initial sorting by network.
	// if the 2 accounts are from different networks, don't touch their order
	if (a.networkKey !== b.networkKey) {
		return 0;
	}

	// if the names are equal, compare by path then creation time
	return compareByName(a, b) || compareByPathThenCreation(a, b);
}

export function accountWithChildren (accounts: AccountType[]): ChildFilter {
	return (account: AccountType): AccountWithChildren => {
		const children = accounts
			.filter(({ parent }) => {
				let isParent = false

				try {
					isParent = decodeAddress(account.address).toString() === parent
				} catch(e){
					console.error('Error while decodeing the parent address - 2', e)
				}

				return isParent
			})
			.map(accountWithChildren(accounts))
			.sort(compareByNameThenPathThenCreation);

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

	return substrateAccounts.filter(({ parent }) =>
		// it is a parent
		!parent ||
      // we don't have a parent for this one
      !substrateAccounts.some(({ address }) => parent === decodeAddress(address).toString()))
		.map(accountWithChildren(accounts))
		.sort(compareByNetwork)
		.sort(compareByNameThenPathThenCreation)
		.concat(...accounts.filter(({ networkKey }) => isEthereum(networkKey)));
}