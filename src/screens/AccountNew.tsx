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

import AccountIconChooser from 'components/AccountIconChooser';
import Button from 'components/Button';
// import DerivationPathField from 'components/DerivationPathField';
import KeyboardScrollView from 'components/KeyboardScrollView';
import { NetworkCard } from 'components/NetworkCard';
import ScreenHeading from 'components/ScreenHeading';
import TextInput from 'components/TextInput';
import { NetworkProtocols } from 'constants/networkSpecs';
import React, { useCallback, useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from 'styles/colors';
import fonts from 'styles/fonts';
import fontStyles from 'styles/fontStyles';
import { NavigationProps } from 'types/props';
import { emptyAccount, validateSeed } from 'utils/account';
import { constructSURI } from 'utils/suri';

import { AccountsContext, NetworksContext } from '../context';

// interface OnDerivationType {
// 	derivationPassword: string;
// 	derivationPath: string;
// 	isDerivationPathValid: boolean;
// }

export default function AccountNew({ navigation }: NavigationProps<'AccountNew'>): React.ReactElement {
	// const [derivationPassword, setDerivationPassword] = useState('')
	// const [derivationPath, setDerivationPath] = useState('')
	// const [isDerivationPathValid, setIsDerivationPathValid] = useState(true)
	const { newAccount, updateNew } = useContext(AccountsContext);
	const { getNetwork } = useContext(NetworksContext);
	const { address, name, networkKey, seed, validBip39Seed  } = newAccount;
	const selectedNetwork = getNetwork(networkKey);
	const isSubstrate = selectedNetwork?.protocol === NetworkProtocols.SUBSTRATE;

	useEffect((): void => {
		// make sure all fields are reset on mount
		updateNew(emptyAccount('', ''));
	// we get an infinite loop if we add anything here.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const updateAccountSelection = useCallback(({ isBip39, newAddress, newSeed }): void => {
		if (newAddress && isBip39 && newSeed) {
			if (isSubstrate) {
				try {
					const suri = constructSURI({
						// derivePath: derivationPath,
						// password: derivationPassword,
						phrase: newSeed
					});

					updateNew({
						address: newAddress,
						// derivationPassword,
						// derivationPath,
						seed: suri,
						seedPhrase: newSeed,
						validBip39Seed: isBip39
					});
				} catch (e) {
					console.error(e);
				}
			} else {
				// Ethereum account
				updateNew({
					address: newAddress,
					seed: newSeed,
					validBip39Seed: isBip39
				});
			}
		}
		else {
			updateNew({
				address: '',
				seed: '',
				validBip39Seed: false
			});
		}
	},[isSubstrate, updateNew])

	const onCreate = useCallback(() => {
		navigation.navigate('Mnemonic', { isNew: true })
	}, [navigation])

	const onNetworkNavigation = useCallback(() => {
		updateNew({ address:'', seed: '', seedPhrase: '', validBip39Seed: false })
		navigation.navigate('NetworkList')
	}, [navigation, updateNew])

	// const onDerivationChange = useCallback(({derivationPassword, derivationPath, isDerivationPathValid}: OnDerivationType): void => {
	// 	console.log('derivationPassword, derivationPath, isDerivationPathValid', derivationPassword, derivationPath, isDerivationPathValid)
	// 	setDerivationPassword(derivationPassword)
	// 	setDerivationPath(derivationPath)
	// 	setIsDerivationPathValid(isDerivationPathValid)
	// }, []);

	return (
		<KeyboardScrollView>
			<ScreenHeading title={'Create Account'} />
			<View style={styles.step}>
				<Text style={styles.title}>NAME</Text>
				<TextInput
					onChangeText={(input: string): void =>
						updateNew({ name: input })
					}
					placeholder="new name"
					value={name}
				/>
			</View>
			<View style={styles.step}>
				<Text style={styles.title}>NETWORK</Text>
				<NetworkCard
					networkKey={networkKey}
					onPress={onNetworkNavigation}
					title={selectedNetwork?.title || 'Select Network'}
				/>
			</View>
			{selectedNetwork && (
				<>
					<View style={styles.step}>
						<Text style={styles.title}>ICON & ADDRESS</Text>
						<AccountIconChooser
							// derivationPassword={derivationPassword}
							// derivationPath={derivationPath}
							network={selectedNetwork}
							onSelect={updateAccountSelection}
							value={address}
						/>
					</View>
					{/* {isSubstrate && (
						<View style={StyleSheet.flatten([styles.step, styles.lastStep])}>
							<DerivationPathField
								onChange={onDerivationChange}
								styles={styles}
							/>
						</View>
					)} */}
					<View style={styles.bottom}>
						<Button
							// disabled={!validateSeed(seed, validBip39Seed).valid || !isDerivationPathValid}
							disabled={!validateSeed(seed, validBip39Seed).valid}
							onPress={onCreate}
							small
							title="Next Step"
						/>
					</View>
				</>
			)}
		</KeyboardScrollView>
	);
}

const styles = StyleSheet.create({
	bottom: {
		paddingBottom: 15
	},
	lastStep: {
		paddingTop: 0
	},
	step: {
		padding: 16
	},
	title: {
		...fontStyles.h_subheading,
		color: colors.text.main
	},
	titleTop: {
		color: colors.text.main,
		fontFamily: fonts.bold,
		fontSize: 24,
		paddingBottom: 20,
		textAlign: 'center'
	}
});
