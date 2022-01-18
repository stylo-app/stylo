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

import type { ChainProperties } from '@polkadot/types/interfaces';

import { types as karTypesdef } from '@acala-network/type-definitions'
import { SubstrateNetworkKeys } from 'constants/networkSpecs';
import React, { useCallback, useContext, useState } from 'react';
import { SubstrateNetworkParams } from 'types/networkTypes';

import { Metadata, TypeRegistry } from '@polkadot/types';
import { getSpecTypes } from '@polkadot/types-known';

import metadataJson from '../constants/metadata.json';
import { plasmTypeDefs } from '../constants/typeDefs'
import { NetworksContext } from './NetworksContext';
import { deepCopyMap } from './utils';

export interface RegistriesContextType {
	registries: Map<string, TypeRegistry>;
	getTypeRegistry: (networkKey: string) => TypeRegistry | null;
};

export const RegistriesContext = React.createContext({} as RegistriesContextType);

//Map PathId to Polkadot.js/api spec names and chain names
type NetworkTypes = {
	alias?: string;
	chains: {
		[key: string]: string;
	};
};
type NetworkTypesMap = { [key: string]: NetworkTypes };
const networkTypesMap: NetworkTypesMap = {
	centrifuge: {
		alias: 'centrifuge-chain',
		chains: {}
	},
	kusama: { chains: {} },
	polkadot: { chains: { westend: 'Westend' } },
	rococo: { chains: {} }
};

export const getOverrideTypes = (registry: TypeRegistry, pathId: string, specVersion: number): any => {
	let specName = '',
		chainName = '';

	Object.entries(networkTypesMap).find(([networkName, networkTypes]: [string, NetworkTypes]) => {
		if (networkName === pathId) {
			specName = networkTypes.alias ?? networkName;
		} else if (networkTypes.chains.hasOwnProperty(pathId)) {
			const chainAlias = networkTypes.chains[pathId];

			specName = networkTypes.alias ?? networkName;
			chainName = chainAlias ?? pathId;
		} else {
			return false;
		}

		return true;
	});

	return getSpecTypes(registry as any, chainName, specName, specVersion);
};

interface RegistriesContextProviderProps {
	children?: React.ReactElement;
}

export function RegistriesContextProvider({ children }: RegistriesContextProviderProps): React.ReactElement {
	const [registries, setRegistries] = useState(new Map());
	const { getNetwork } = useContext(NetworksContext);

	const getTypeRegistry = useCallback((networkKey: string): TypeRegistry | null => {

		try {
			const network = getNetwork(networkKey) as SubstrateNetworkParams;
			const networkMetadataRaw: `0x${string}` = (metadataJson as Record<string, any>)[network.metadataKey].hex;

			if (!networkMetadataRaw) return null;
			if (registries.has(networkKey)) return registries.get(networkKey)!;
			const newRegistry = new TypeRegistry();
			const specVersion = (metadataJson as Record<string, any>)[network.metadataKey].specVersion;
			let overrideTypes

			switch (networkKey) {
			case SubstrateNetworkKeys.KARURA:
				overrideTypes = karTypesdef
				break;

			case SubstrateNetworkKeys.SHIDEN:
				overrideTypes = plasmTypeDefs
				break;
			default:
				network && getOverrideTypes(newRegistry, network.pathId, specVersion);
				break;
			}

			overrideTypes && newRegistry.register(overrideTypes);

			// this is the slow/blocking one
			const metadata = new Metadata(newRegistry, networkMetadataRaw);

			newRegistry.setMetadata(metadata);

			// this takes care of decoding the addresses etc with the right prefix
			newRegistry.setChainProperties(newRegistry.createType('ChainProperties', {
				ss58Format: network.prefix,
				tokenDecimals: network.decimals,
				tokenSymbol: network.unit
			  } as unknown as ChainProperties));
			const newRegistries = deepCopyMap(registries);

			newRegistries.set(networkKey, newRegistry);
			setRegistries(newRegistries);

			return newRegistry;
		} catch (e: any) {
			console.error('oops', e);

			return null;
		}
	}, [getNetwork, registries]);

	return (
		<RegistriesContext.Provider value={{ getTypeRegistry, registries }}>
			{children}
		</RegistriesContext.Provider>)
}
