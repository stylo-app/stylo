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

import NetInfo from '@react-native-community/netinfo';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AccountCard from 'components/AccountCard';
import InsecureDeviceBanner from 'components/InsecureDeviceBanner';
import { Loader } from 'components/Loader';
import QrScannerTab from 'components/QrScannerTab';
import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import colors from 'styles/colors';
import { RootStackParamList } from 'types/routes';
import { buildHierarchy } from 'utils/buildHierarchy';

import { AccountsContext } from '../context';
import { useTac } from '../hooks/useTac';

function AccountList(): React.ReactElement {
	const { accounts, selectAccount } = useContext(AccountsContext);
	const [isConnected, setIsConnected] = useState(false);
	const { dataLoaded } = useTac();
	const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
	const hierarchy = useMemo(() => buildHierarchy(accounts), [accounts])

	useEffect(() =>
		NetInfo.addEventListener(state => {
			setIsConnected(state.isConnected || false);
		}),
	[]);

	if(!dataLoaded) {
		return <Loader/>
	}

	const onAccountSelected = async (accountAddress: string): Promise<void> => {
		selectAccount(accountAddress);
		navigate('AccountDetails');
	};

	return (
		<SafeAreaViewContainer>
			{isConnected && <InsecureDeviceBanner onPress={(): void => navigate('Security')}/>}
			{
				accounts.length
					? (
						<>
							<ScrollView
								style={styles.content}
							>
								{hierarchy.map(({ address, children, name, networkKey }) =>
									<View key={`parent-${address}`}>
										<AccountCard
											address={address}
											networkKey={networkKey}
											onPress={(): Promise<void> => onAccountSelected(address)}
											style={{ paddingBottom: 0 }}
											title={name}
										/>
										{children?.map(({ address, name, networkKey }) => (
											<AccountCard
												address={address}
												isChild={true}
												key={`child-${address}`}
												networkKey={networkKey}
												onPress={(): Promise<void> => onAccountSelected(address)}
												style={{ paddingBottom: 0 }}
												title={name}
											/>
										))}
									</View>)}
							</ScrollView>
							<QrScannerTab />
						</>
					)
					:(
						<View style={styles.emptyContainer}>
							<Icon
								color={colors.text.faded}
								name="inbox"
								size={100}
							/>
							<Text style={styles.emptyTextTitle}>Welcome!</Text>
							<Text style={styles.emptyText}>Add accounts to get started</Text>
						</View>
					)
			}
		</SafeAreaViewContainer>
	);
}

export default AccountList;

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingBottom: 40
	},
	emptyContainer:{
		alignItems:'center',
		flex:1,
		justifyContent:'center'
	},
	emptyText:{
		color: colors.text.faded,
		fontSize: 15
	},
	emptyTextTitle:{
		color: colors.text.faded,
		fontSize: 32,
		paddingBottom: 10
	},
	insecureDeviceBanner: {
		alignItems: 'center',
		backgroundColor: colors.signal.error,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		padding: 5
	},
	warningText: {
		color: colors.text.white,
		marginLeft: 5
	}
});
