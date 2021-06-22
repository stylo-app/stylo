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

import AccountCard from 'components/AccountCard';
import Button from 'components/Button';
import DerivationPasswordVerify from 'components/DerivationPasswordVerify';
import { SafeAreaScrollViewContainer } from 'components/SafeAreaContainer';
import ScreenHeading from 'components/ScreenHeading';
import TouchableItem from 'components/TouchableItem';
import { NetworkProtocols } from 'constants/networkSpecs';
import React, { useCallback, useContext, useEffect } from 'react';
import { AppState, AppStateStatus, StyleSheet, Text, View } from 'react-native';
import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';
import { NavigationProps } from 'types/props';
import { alertBackupDone, alertCopyBackupPhrase } from 'utils/alertUtils';

import { AccountsContext, AlertContext, NetworksContext } from '../context';

function Mnemonic({ navigation, route }: NavigationProps<'Mnemonic'>): React.ReactElement {
	const { getSelectedAccount, lockAccount,newAccount } = useContext(AccountsContext);
	const selectedAccount = getSelectedAccount();
	const { getNetwork } = useContext(NetworksContext);
	const { navigate } = navigation;
	const { setAlert } = useContext(AlertContext);
	const isNew = !!route.params?.isNew;

	const { address = '', derivationPassword = '', derivationPath = '', name, networkKey, seed = '', seedPhrase = '' } = isNew
		? newAccount
		: selectedAccount || {};
	const protocol = getNetwork(networkKey)?.protocol;

	// Make sure to lock the account if the app goes innactive or the user goes back
	useEffect(() => {

		const handleAppStateChange = (nextAppState: AppStateStatus): void => {
			if (nextAppState === 'inactive') {
				navigation.goBack();
			}
		};

		AppState.addEventListener('change', handleAppStateChange);

		return (): void => {
			if (address) {
				lockAccount(address);
			}

			AppState.removeEventListener('change', handleAppStateChange);
		};
	}, [address, lockAccount, navigation]);

	const goToPin = useCallback(() => {
		alertBackupDone(setAlert, () => {
			navigate('AccountPin', { isNew });
		});
	}, [isNew, navigate, setAlert])

	return (
		<SafeAreaScrollViewContainer style={styles.body}>
			<ScreenHeading
				subtitle="Write these words down on paper. Keep the backup paper safe. These
				words allow anyone to recover this account and access its funds."
				title="Secret Phrase"
			/>

			<AccountCard
				address={address}
				networkKey={networkKey}
				title={name}
			/>
			<View style={styles.bodyContent}>
				<Text style={styles.title}>Secret Phrase</Text>
				<TouchableItem
					onPress={(): void => {
						// only allow the copy of the secret phrase in dev environment
						if (__DEV__) {
							if (protocol === NetworkProtocols.SUBSTRATE) {
								alertCopyBackupPhrase(setAlert,
									`${seedPhrase}${derivationPath}`);
							} else {
								alertCopyBackupPhrase(setAlert,
									seedPhrase === '' ? seed : seedPhrase);
							}
						}
					}}
				>
					<Text style={styles.seed}>
						{seedPhrase === '' ? seed : seedPhrase}
					</Text>
				</TouchableItem>
				{!!derivationPath && (
					<>
						<Text style={styles.title}>Derivation path</Text>
						<Text style={styles.derivationText}>{derivationPath}</Text>
					</>
				)}
				{!!derivationPassword && (
					<DerivationPasswordVerify password={derivationPassword} />
				)}
				{isNew && (
					<Button
						onPress={goToPin}
						title="Done"
					/>
				)}
			</View>
		</SafeAreaScrollViewContainer>
	);
}

export default Mnemonic;

const styles = StyleSheet.create({
	body: {
		alignContent: 'flex-start',
		paddingBottom: 20
	},
	bodyContent: {
		padding: 16
	},
	derivationText: {
		...fontStyles.t_seed,
		color: colors.text.faded,
		lineHeight: 20,
		minHeight: 1,
		paddingHorizontal: 16,
		paddingVertical: 8
	},
	seed: {
		...fontStyles.t_seed,
		color: colors.text.faded,
		marginBottom: 20,
		minHeight: 1
	},
	title: {
		...fontStyles.h_subheading,
		color: colors.text.main,
		marginBottom: 10
	}
});
