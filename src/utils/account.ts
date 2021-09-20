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

import { UnlockedAccount } from 'types/accountTypes';
import { ValidSeed } from 'types/utilTypes';

import { decodeAddress } from '@polkadot/util-crypto';

export function emptyAccount(address = '', networkKey: string = '', parentAddress: string = ''): UnlockedAccount {
	let parent = undefined

	try {
		parent = parentAddress ? decodeAddress(parentAddress).toString() : undefined
	} catch(e){
		console.log('Error while decoding the parent address', e)
	}

	return {
		address,
		createdAt: new Date().getTime(),
		derivationPassword: '',
		derivationPath: '',
		encryptedSeed: '',
		isLegacy: true,
		name: '',
		networkKey,
		parent,
		seed: '',
		seedPhrase: '',
		updatedAt: new Date().getTime(),
		validBip39Seed: false
	};
}

export function validateSeed(seed: string | undefined, validBip39Seed: boolean): ValidSeed {
	if (!seed || seed.length === 0) {
		return {
			accountRecoveryAllowed: false,
			bip39: false,
			reason: 'A secret phrase is required.',
			valid: false
		};
	}

	const words = validBip39Seed ? seed.trimEnd().split(' ') : seed.split(' ');

	for (const word of words) {
		if (word === '') {
			return {
				accountRecoveryAllowed: true,
				bip39: false,
				reason: 'Extra whitespace found.',
				valid: false
			};
		}
	}

	if (!validBip39Seed) {
		return {
			accountRecoveryAllowed: true,
			bip39: false,
			reason:
				'This secret phrase is not a valid BIP39 seed, will be treated as a legacy Parity brain wallet. Make sure you understand the risks.',
			valid: false
		};
	}

	return {
		bip39: true,
		reason: null,
		valid: true
	};
}
