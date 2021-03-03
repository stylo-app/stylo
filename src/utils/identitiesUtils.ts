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

import { centrifugeAmberMetadata, centrifugeMetadata, edgewareMetadata, kulupuMetadata, kusamaMetadata, polkadotMetaData, rococoMetadata, westendMetadata } from 'constants/networkMetadata';
import { SubstrateNetworkKeys } from 'constants/networkSpecs';

import { pathsRegex } from './regex';

//walk around to fix the regular expression support for positive look behind;
export const removeSlash = (str: string): string => str.replace(/\//g, '');

// export const verifyPassword = async (password: string, seedPhrase: string, identity: Identity, path: string, networkContextState: NetworksContextType): Promise<boolean> => {
// 	const { networks } = networkContextState;
// 	const suri = constructSURI({
// 		derivePath: path,
// 		password: password,
// 		phrase: seedPhrase
// 	});
// 	const networkKey = getNetworkKey(path, identity, networkContextState);
// 	const networkParams = networks.get(networkKey);

// 	if (!networkParams) throw new Error(strings.ERROR_NO_NETWORK);
// 	const address = await substrateAddress(suri, networkParams.prefix);
// 	const accountMeta = identity.meta.get(path);

// 	return address === accountMeta?.address;
// };

export const validateDerivedPath = (derivedPath: string): boolean =>
	pathsRegex.validateDerivedPath.test(derivedPath);

export const getMetadata = (networkKey: string): string | null => {
	switch (networkKey) {
	case SubstrateNetworkKeys.CENTRIFUGE:

		return centrifugeMetadata;
	case SubstrateNetworkKeys.CENTRIFUGE_AMBER:

		return centrifugeAmberMetadata;
	case SubstrateNetworkKeys.KUSAMA:

		return kusamaMetadata;
	case SubstrateNetworkKeys.WESTEND:

		return westendMetadata;
	case SubstrateNetworkKeys.EDGEWARE:

		return edgewareMetadata;
	case SubstrateNetworkKeys.KULUPU:

		return kulupuMetadata;
	case SubstrateNetworkKeys.POLKADOT:

		return polkadotMetaData;
	case SubstrateNetworkKeys.ROCOCO:

		return rococoMetadata;
	default:

		return null;
	}
};
