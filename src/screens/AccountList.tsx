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
import { CommonActions, useNavigation } from '@react-navigation/native';
import AccountCard from 'components/AccountCard';
import { Loader } from 'components/Loader';
import QrScannerTab from 'components/QrScannerTab';
import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import testIDs from 'e2e/testIDs';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text,TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import colors from 'styles/colors';
import { AccountType } from 'types/accountTypes';

import { AccountsContext } from '../context';
import { useTac } from '../hooks/useTac';

function AccountList(): React.ReactElement {
	const { accounts, selectAccount } = useContext(AccountsContext);
	const [isConnected, setIsConnected] = useState(false);
	const { dataLoaded, ppAndTaCAccepted } = useTac();
	const { dispatch, navigate } = useNavigation();

	useEffect(() => {
		if (!dataLoaded || ppAndTaCAccepted) return;

		const resetAction = CommonActions.reset({
			index: 0,
			routes: [{ name: 'TermsAndConditions' }]
		});

		dispatch(resetAction);
	}, [dataLoaded, dispatch, ppAndTaCAccepted])

	useEffect(() =>
		NetInfo.addEventListener(state => {
			setIsConnected(state.isConnected);
		}),
	[]);

	if(!dataLoaded) {
		return <Loader/>
	}

	const onAccountSelected = async (accountAddress: string): Promise<void> => {
		selectAccount(accountAddress);
		navigate('AccountDetails');
	};

	const renderAccountCard = ({ address, name, networkKey }: AccountType): React.ReactElement => (
		<AccountCard
			address={address}
			key={address}
			networkKey={networkKey}
			onPress={(): Promise<void> => onAccountSelected(address)}
			style={{ paddingBottom: 0 }}
			title={name}
		/>
	);

	return (
		<SafeAreaViewContainer>
			{isConnected && (
				<TouchableWithoutFeedback
					onPress={(): void => navigate('Security')}
				>
					<View style={styles.insecureDeviceBanner}>
						<Icon
							color={colors.text.white}
							name="shield-off"
							size={22}
						/>
						<Text style={styles.warningText}>Insecure device</Text>
					</View>
				</TouchableWithoutFeedback>
			)}
			<ScrollView
				style={styles.content}
				testID={testIDs.AccountListScreen.accountList}
			>
				{accounts.map(renderAccountCard)}
			</ScrollView>
			<QrScannerTab />
		</SafeAreaViewContainer>
	);
}

export default AccountList;

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingBottom: 40
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
