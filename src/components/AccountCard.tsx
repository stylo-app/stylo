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

import React, { ReactElement, useContext } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';
import { ButtonListener } from 'types/props';

import { AccountsContext, NetworksContext } from '../context';
import AccountIcon from './AccountIcon';
import AccountPrefixedTitle from './AccountPrefixedTitle';
import Address from './Address';
import { NetworkFooter } from './NetworkFooter';
import TouchableItem from './TouchableItem';

interface AccountCardProps{
	address: string;
	derivationPath?: string;
	networkKey?: string;
	onPress?: ButtonListener;
	style?: ViewStyle;
	testID?: string;
	title?: string;
	titlePrefix?: string;
};

export default function AccountCard({ address, derivationPath, networkKey, onPress, style, testID, title, titlePrefix }: AccountCardProps): ReactElement {
	const { getNetwork } = useContext(NetworksContext);
	const { getAccountByAddress } = useContext(AccountsContext);

	const account = getAccountByAddress(address)
	const derivation = derivationPath || account?.derivationPath
	const displayTitle = title ||account?.name || 'Unknown';
	const network = getNetwork(networkKey) || getNetwork(account?.networkKey);

	return (
		<TouchableItem
			disabled={false}
			onPress={onPress}
			testID={testID}
		>
			<View style={[styles.content, style]}>
				<AccountIcon
					address={account?.address || address}
					network={network}
					style={styles.icon} />
				<View style={[styles.desc ]}>
					<AccountPrefixedTitle
						title={displayTitle}
						titlePrefix={titlePrefix}
					/>
					{!!derivation && (
						<View>
							<Text style={[fontStyles.t_regular, styles.derivationPath]}>
								{derivation}
							</Text>
						</View>
					)}
					{address !== '' && (
						<Address
							address={address}
							protocol={network?.protocol}
						/>
					)}
				</View>
				<NetworkFooter
					color={network?.color}
					text={network?.title}
				/>
			</View>
		</TouchableItem>
	);
}

const styles = StyleSheet.create({
	content: {
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 8,
		paddingLeft: 16
	},
	derivationPath: {
		color: colors.text.faded
	},
	desc: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		paddingLeft: 16
	},
	icon: {
		height: 50,
		width: 50
	}
});
