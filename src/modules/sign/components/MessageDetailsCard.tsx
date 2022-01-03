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

import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';
import { isAscii } from 'utils/strings';

import { hexToString } from '@polkadot/util';

import { NetworksContext } from '../../../context';
import { unwrapMessage } from '../utils';

export default function MessageDetailsCard({ data, isHash, message, networkKey }: {
	isHash: boolean;
	message: string;
	data: string;
	networkKey: string;
}): React.ReactElement {
	const { getSubstrateNetwork } = useContext(NetworksContext);
	const network = getSubstrateNetwork(networkKey);

	return (
		<View style={[styles.extrinsicContainer]}>
			<Text style={[styles.label, { backgroundColor: network?.color }]}>
				{isHash ? 'Message Hash' : 'Message'}
			</Text>
			{
				isHash
					? <Text style={styles.secondaryText}>{message}</Text>
					: <Text style={styles.secondaryText}>
						{isAscii(message) ? unwrapMessage(hexToString(message)) : data}
					</Text>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	extrinsicContainer: {
		paddingTop: 16
	},
	label: {
		...fontStyles.t_label,
		color: colors.text.white,
		marginBottom: 10,
		paddingLeft: 8,
		textAlign: 'left'
	},
	secondaryText: {
		...fontStyles.t_codeS,
		color: colors.text.faded,
		paddingHorizontal: 8,
		textAlign: 'left'
	}
});
