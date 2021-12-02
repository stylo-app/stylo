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

import colors from 'styles/colors';
import { EthereumNetwork, EthereumNetworkDefaultConstants, NetworkParams, NetworkProtocol, SubstrateNetworkDefaultConstant, SubstrateNetworkParams } from 'types/networkTypes';

export const NetworkProtocols: Record<string, NetworkProtocol> = Object.freeze({
	ETHEREUM: 'ethereum',
	SUBSTRATE: 'substrate'
});

// ethereumChainId is used as Network key for Ethereum networks
/* eslint-disable sort-keys */
export const EthereumNetworkKeys: Record<string, string> = Object.freeze({
	FRONTIER: '1',
	GOERLI: '5'
});

// genesisHash is used as Network key for Substrate networks
/* eslint-enable sort-keys */
export const SubstrateNetworkKeys = Object.freeze({
	POLKADOT: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
	// eslint-disable-next-line sort-keys
	KUSAMA: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe', // https://polkascan.io/pre/kusama-cc3/block/0
	// eslint-disable-next-line sort-keys
	KARURA: '0xbaf5aabe40646d11f0ee8abbdc64f4a4b7674925cba08e4a05ff9ebed6e2126b',
	// CENTRIFUGE: '0x67dddf2673b69e5f875f6f25277495834398eafd67f492e09f3f3345e003d1b5', // https://portal.chain.centrifuge.io/#/explorer/query/0
	// MOONRIVER: '0x401a1f9dca3da46f5c4091016c8a2f26dcea05865116b286f60f668207d1474b',
	// ROCOCO: '0x1611e1dbf0405379b861e2e27daa90f480b2e6d3682414a80835a52e8cb8a215',
	SHIDEN: '0xf1cf9022c7ebb34b162d5b5e34e705a5a740b2d0ecc1009fb89023e62a488108',
	STATEMINE: '0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a',
	SUBSOCIAL: '0x0bd72c1c305172e1275278aaeb3f161e02eccb7a819e63f62d47bd53a28189f8',
	WESTEND: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
	// eslint-disable-next-line sort-keys
	BIFROST: '0x9f28c6a68e0fc9646eff64935684f6eeeece527e37bbe1f213d22caa1d9d6bed',
	CALAMARI: '0x4ac80c99289841dd946ef92765bf659a307d39189b3ce374a92b5f0415ee17a1',
	KILT: '0x411f057b9107718c9624d6aa4a3f23c1653898297f3d4d529d9bb6511a39dd21'
});

const substrateNetworkBase: Record<string, SubstrateNetworkDefaultConstant> = {
	[SubstrateNetworkKeys.POLKADOT]: {
		color: '#E6027A',
		decimals: 10,
		genesisHash: SubstrateNetworkKeys.POLKADOT,
		logo: require('res/img/logos/Polkadot.png'),
		metadataKey: 'polkadotMetadata',
		order: 1,
		pathId: 'polkadot',
		prefix: 0,
		title: 'Polkadot',
		unit: 'DOT'
	},
	[SubstrateNetworkKeys.KUSAMA]: {
		color: '#000',
		decimals: 12,
		genesisHash: SubstrateNetworkKeys.KUSAMA,
		logo: require('res/img/logos/Kusama.png'),
		metadataKey: 'kusamaMetadata',
		order: 2,
		pathId: 'kusama',
		prefix: 2,
		title: 'Kusama',
		unit: 'KSM'
	},
	// [SubstrateNetworkKeys.CENTRIFUGE]: {
	// 	color: '#FCC367',
	// 	decimals: 18,
	// 	genesisHash: SubstrateNetworkKeys.CENTRIFUGE,
	// 	logo: require('res/img/logos/Centrifuge.png'),
	// 	metadataKey: 'centrifugeMetadata',
	// 	order: 7,
	// 	pathId: 'centrifuge',
	// 	prefix: 36,
	// 	title: 'Centrifuge Mainnet',
	// 	unit: 'RAD'
	// },
	// [SubstrateNetworkKeys.ROCOCO]: {
	// 	color: '#6f36dc',
	// 	decimals: 12,
	// 	genesisHash: SubstrateNetworkKeys.ROCOCO,
	// 	logo: require('res/img/logos/Rococo.png'),
	// 	metadataKey: 'rococoMetadata',
	// 	order: 4,
	// 	pathId: 'rococo',
	// 	prefix: 42,
	// 	title: 'Rococo',
	// 	unit: 'ROC'
	// },
	[SubstrateNetworkKeys.WESTEND]: {
		color: '#da68a7',
		decimals: 12,
		genesisHash: SubstrateNetworkKeys.WESTEND,
		logo: require('res/img/logos/Polkadot.png'),
		metadataKey: 'westendMetadata',
		order: 3,
		pathId: 'westend',
		prefix: 42,
		title: 'Westend',
		unit: 'WND'
	},
	[SubstrateNetworkKeys.STATEMINE]: {
		color: '#113911',
		decimals: 12,
		genesisHash: SubstrateNetworkKeys.STATEMINE,
		logo: require('res/img/logos/Statemine.png'),
		metadataKey: 'statemineMetadata',
		order: 3,
		pathId: 'statemine',
		prefix: 2,
		title: 'Statemine',
		unit: 'KSM'
	},
	[SubstrateNetworkKeys.KARURA]: {
		color: '#ff4c3b',
		decimals: 12,
		genesisHash: SubstrateNetworkKeys.KARURA,
		logo: require('res/img/logos/Karura.png'),
		metadataKey: 'karuraMetadata',
		order: 3,
		pathId: 'karura',
		prefix: 8,
		title: 'Karura',
		unit: 'KAR'
	},
	[SubstrateNetworkKeys.SHIDEN]: {
		color: '#5923B2',
		decimals: 18,
		genesisHash: SubstrateNetworkKeys.SHIDEN,
		logo: require('res/img/logos/Shiden.png'),
		metadataKey: 'shidenMetadata',
		order: 3,
		pathId: 'shiden',
		prefix: 5,
		title: 'Shiden',
		unit: 'SDN'
	},
	[SubstrateNetworkKeys.SUBSOCIAL]: {
		color: '#b9018c',
		decimals: 11,
		genesisHash: SubstrateNetworkKeys.SUBSOCIAL,
		logo: require('res/img/logos/Subsocial.png'),
		metadataKey: 'subsocialMetadata',
		order: 3,
		pathId: 'subsocial',
		prefix: 28,
		title: 'Subsocial',
		unit: 'SUB'
	},
	[SubstrateNetworkKeys.BIFROST]: {
		color: '#5a25f0',
		decimals: 12,
		genesisHash: SubstrateNetworkKeys.BIFROST,
		logo: require('res/img/logos/Bifrost.png'),
		metadataKey: 'bifrostMetadata',
		order: 3,
		pathId: 'bifrost',
		prefix: 42,
		title: 'Bifrost',
		unit: 'BNC'
	},
	[SubstrateNetworkKeys.CALAMARI]: {
		color: '#000000',
		decimals: 12,
		genesisHash: SubstrateNetworkKeys.BIFROST,
		logo: require('res/img/logos/Calamari.png'),
		metadataKey: 'calamariMetadata',
		order: 3,
		pathId: 'calamari',
		prefix: 42,
		title: 'Calamari',
		unit: 'KMA'
	},
	[SubstrateNetworkKeys.KILT]: {
		color: '#8c145a',
		decimals: 15,
		genesisHash: SubstrateNetworkKeys.KILT,
		logo: require('res/img/logos/Kilt.png'),
		metadataKey: 'kiltMetadata',
		order: 3,
		pathId: 'kilt',
		prefix: 38,
		title: 'Kilt',
		unit: 'KILT'
	}
	// [SubstrateNetworkKeys.MOONRIVER]: {
	// 	color: '#0E132E',
	// 	decimals: 18,
	// 	genesisHash: SubstrateNetworkKeys.MOONRIVER,
	// 	logo: require('res/img/logos/Moonriver.png'),
	// 	metadataKey: 'moonriverMetadata',
	// 	order: 3,
	// 	pathId: 'moonriver',
	// 	prefix: 49,
	// 	title: 'Moonriver',
	// 	unit: 'MVR'
	// }

};

const ethereumNetworkBase: Record<string, EthereumNetworkDefaultConstants> = {
	[EthereumNetworkKeys.FRONTIER]: {
		color: '#8B94B3',
		ethereumChainId: EthereumNetworkKeys.FRONTIER,
		order: 101,
		pathId: 'frontier',
		secondaryColor: colors.background.card,
		title: 'Ethereum'
	},
	[EthereumNetworkKeys.GOERLI]: {
		ethereumChainId: EthereumNetworkKeys.GOERLI,
		order: 105,
		pathId: 'goerli',
		title: 'Görli'
	}
};

const ethereumDefaultValues = {
	color: '#434875',
	logo: require('res/img/logos/Ethereum.png'),
	protocol: NetworkProtocols.ETHEREUM,
	secondaryColor: colors.background.card
};

const substrateDefaultValues = {
	color: '#4C4646',
	deleted: false,
	logo: require('res/img/logos/Substrate_Dev.png'),
	protocol: NetworkProtocols.SUBSTRATE,
	secondaryColor: colors.background.card,
	specVersion: 0
};

function setEthereumNetworkDefault(): Record<string, EthereumNetwork> {
	return Object.keys(ethereumNetworkBase).reduce((acc, networkKey) => {
		return {
			...acc,
			[networkKey]: {
				...ethereumDefaultValues,
				...ethereumNetworkBase[networkKey]
			}
		};
	}, {});
}

function setSubstrateNetworkDefault(): Record<string, SubstrateNetworkParams> {
	return Object.keys(substrateNetworkBase).reduce((acc, networkKey) => {
		return {
			...acc,
			[networkKey]: {
				...substrateDefaultValues,
				...substrateNetworkBase[networkKey]
			}
		};
	}, {});
}

export const ETHEREUM_NETWORK_LIST: Record< string, EthereumNetwork> = Object.freeze(setEthereumNetworkDefault());
export const SUBSTRATE_NETWORK_LIST: Record< string, SubstrateNetworkParams> = Object.freeze(setSubstrateNetworkDefault());

export const NETWORK_LIST: Record<string, NetworkParams> = Object.freeze(Object.assign({},
	SUBSTRATE_NETWORK_LIST,
	ETHEREUM_NETWORK_LIST,));

export const defaultNetworkKey = SubstrateNetworkKeys.KUSAMA;
