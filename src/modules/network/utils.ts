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

import { NetworkParams, SubstrateNetworkBasics } from 'types/networkTypes';

export const filterNetworks = (networkList: Map<string, NetworkParams>): Array<[string, NetworkParams]> => {

	return Array.from(networkList.entries())
		.sort((a, b) => a[1].order - b[1].order);
};

export const checkNewNetworkSpecs = (newNetworkSpec: SubstrateNetworkBasics): void => {
	//TODO give feedback to UI, check unique of pathId
	if (
		!newNetworkSpec.genesisHash ||
		!newNetworkSpec.title ||
		!newNetworkSpec.unit ||
		!newNetworkSpec.pathId
	) {
		throw new Error('Network spec must include required field to be valid.');
	}
};