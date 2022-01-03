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

import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import AccountCard from 'components/AccountCard';
import AccountSeed from 'components/AccountSeed';
import Button from 'components/Button';
import DerivationPathField from 'components/DerivationPathField';
import KeyboardScrollView from 'components/KeyboardScrollView';
import { NetworkCard } from 'components/NetworkCard';
import ScreenHeading from 'components/ScreenHeading';
import TextInput from 'components/TextInput';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState, AppStateStatus, StyleSheet, Text, View } from 'react-native';
import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';
import { isSubstrateNetwork, SubstrateNetworkParams  } from 'types/networkTypes';
import { RootStackParamList } from 'types/routes';
import { emptyAccount, validateSeed } from 'utils/account';
import { alertError, alertRisks } from 'utils/alertUtils';
import { debounce } from 'utils/debounce';
import { brainWalletAddress, substrateAddress } from 'utils/native';
import { constructSURI } from 'utils/suri';

import { AccountsContext, AlertContext, NetworksContext } from '../context';

interface OnDerivationType {
	derivationPassword: string;
	derivationPath: string;
	isDerivationPathValid: boolean;
}

const defaultSeedValidObject = validateSeed('', false);

function RecoverAccount(): React.ReactElement {
	const [derivationPath, setDerivationPath] = useState('');
	const [derivationPassword, setDerivationPassword] = useState('');
	const [isDerivationPathValid, setIsDerivationPathValid] = useState(true);
	const { accountExists, getSelectedAccount, lockAccount, newAccount, updateNew } = useContext(AccountsContext);
	const [isSeedValid, setIsSeedValid] = useState(defaultSeedValidObject);
	const [seedPhrase, setSeedPhrase] = useState('');
	const { setAlert } = useContext(AlertContext);
	const { getNetwork } = useContext(NetworksContext)
	const selectedNetwork = useMemo(() => getNetwork(newAccount.networkKey), [getNetwork, newAccount.networkKey])
	const { goBack, navigate } = useNavigation<NavigationProp<RootStackParamList>>()
	const { params } = useRoute<RouteProp<RootStackParamList, 'RecoverAccount'>>()
	const accountAlreadyExists = useMemo(() => accountExists(newAccount.address, selectedNetwork), [accountExists, newAccount.address, selectedNetwork])
	const isSubstrate = useMemo(() => isSubstrateNetwork(selectedNetwork), [selectedNetwork])
	const isDerivingAccount = useMemo(() => params?.isDerivation, [params?.isDerivation])
	const selectedAccount = useMemo(() => getSelectedAccount(), [getSelectedAccount])

	const goToPin = useCallback(() => navigate('AccountPin', { isNew: true }), [navigate])

	// Make sure to lock the account if the app goes innactive or the user goes back
	useEffect(() => {

		const handleAppStateChange = (nextAppState: AppStateStatus): void => {
			if (nextAppState === 'inactive') {
				goBack();
			}
		};

		AppState.addEventListener('change', handleAppStateChange);

		return (): void => {
			if (selectedAccount?.address) {
				lockAccount(selectedAccount.address);
			}

			AppState.removeEventListener('change', handleAppStateChange);
		};
	}, [goBack, lockAccount, selectedAccount?.address]);

	useEffect((): void => {
		const parentAddress = isDerivingAccount ? selectedAccount?.address : undefined

		updateNew(emptyAccount('', '', parentAddress));
		setDerivationPath('')
		setDerivationPassword('')
	}, [isDerivingAccount, selectedAccount?.address, updateNew]);

	const generateAddress = useCallback(() => {

		if (!selectedNetwork) {
			console.warn('No network selected')

			return null
		}

		if (!isSubstrate) {
			brainWalletAddress(seedPhrase)
				.then(({ address, bip39 }) => {
					updateNew({
						address,
						seed: seedPhrase,
						seedPhrase,
						validBip39Seed: bip39
					})
				})
				.catch(console.error);
		} else {
			if (!seedPhrase){
				return;
			}

			// Substrate
			try {
				const { prefix } = selectedNetwork as SubstrateNetworkParams
				const suri = constructSURI({
					derivePath: derivationPath,
					password: derivationPassword,
					phrase: seedPhrase
				});

				substrateAddress(suri, prefix)
					.then(address => {
						updateNew({
							address,
							derivationPassword,
							derivationPath,
							seed: suri,
							seedPhrase,
							validBip39Seed: true
						});
					})
					.catch((e) => {
						//invalid phrase
						console.error('invalid phrase', e)
					});
			} catch (e) {
				// invalid phrase or derivation path
				console.error('invalid phrase or path', e)
			}
		}
	}, [derivationPassword, derivationPath, isSubstrate, seedPhrase, selectedNetwork, updateNew]);

	useEffect(() => {
		isSeedValid.bip39 && isDerivationPathValid && generateAddress()
	}, [generateAddress, isDerivationPathValid, isSeedValid.bip39, derivationPath, derivationPassword])

	const validateAndGenerate = useCallback((seed, bip39 = true) => {
		const validatedSeed = validateSeed(seed, bip39)

		setIsSeedValid(validatedSeed);
		generateAddress()
	}, [generateAddress])

	const onSeedTextInput = useCallback((inputSeedPhrase: string): void => {
		const trimmedSeed = inputSeedPhrase.trimEnd();

		setSeedPhrase(trimmedSeed);

		const addressGeneration = (): Promise<void> =>
			brainWalletAddress(trimmedSeed)
				.then(({ bip39 }) => {
					validateAndGenerate(trimmedSeed, bip39);
				})
				.catch(() => setIsSeedValid(defaultSeedValidObject));
		const debouncedAddressGeneration = debounce(addressGeneration, 200);

		debouncedAddressGeneration();
	}, [validateAndGenerate]);

	useEffect(() => {
		if (isDerivingAccount) {
			const seed = selectedAccount?.seedPhrase

			seed && onSeedTextInput(seed)
		}
	}, [getSelectedAccount, isDerivingAccount, onSeedTextInput, selectedAccount?.seedPhrase])

	const onRecoverAccount = (): void => {
		goToPin()
	};

	const onRecoverConfirm = (): void | Promise<void> => {
		if (!isSeedValid.valid) {
			if (isSeedValid.accountRecoveryAllowed) {
				return alertRisks(setAlert, `${isSeedValid.reason}`, onRecoverAccount);
			} else {
				return alertError(setAlert, `${isSeedValid.reason}`);
			}
		}

		return onRecoverAccount();
	};

	const onDerivationChange = useCallback(({ derivationPassword, derivationPath, isDerivationPathValid }: OnDerivationType) => {
		setDerivationPassword(derivationPassword)
		setDerivationPath(derivationPath)
		setIsDerivationPathValid(isDerivationPathValid)
	}, [])

	const { address, name, networkKey } = newAccount;

	return (
		<KeyboardScrollView>
			<ScreenHeading title={isDerivingAccount ? 'Derive Account' : 'Recover Account'} />
			<View style={styles.step}>
				<Text style={styles.title}>Name</Text>
				<TextInput
					onChangeText={(input: string): void =>
						updateNew({ name: input })
					}
					placeholder="account name"
					value={name}
				/>
			</View>
			<View style={styles.step}>
				<Text style={styles.title}>Network</Text>
				<NetworkCard
					networkKey={networkKey}
					onPress={(): void => navigate('NetworkList', { substrateOnly: isDerivingAccount })}
					title={selectedNetwork?.title || 'Select Network'}
				/>
			</View>
			{!isDerivingAccount && (
				<View style={styles.step}>
					<Text style={styles.title}>Secret Phrase</Text>
					<AccountSeed
						onChangeText={onSeedTextInput}
						returnKeyType="done"
						valid={isSeedValid.bip39}
					/>
				</View>
			)}
			{isSubstrate && (
				<View style={styles.step}>
					<DerivationPathField
						isDropdown={isDerivingAccount}
						onChange={onDerivationChange}
						styles={styles}
						value={`${derivationPath}${derivationPassword ? '///' : '' }${derivationPassword}`}
					/>
				</View>
			)}
			{ isSeedValid.bip39 && !!networkKey && !!address && !accountAlreadyExists && (
				<View style={styles.step}>
					<AccountCard
						address={address}
						derivationPath={derivationPath}
						networkKey={networkKey}
						title={name || '<no name>'}
					/>
				</View>
			)}
			{ accountAlreadyExists && !(isDerivingAccount && !derivationPath) && (
				<View style={styles.step}>
					<Text style={styles.errorText}>
						An account with this secret phrase already exists.
					</Text>
				</View>
			)}
			{ !isDerivationPathValid && (
				<View style={styles.step}>
					<Text style={styles.errorText}>
						Invalid derivation path.
					</Text>
				</View>
			)}
			<View style={styles.btnBox}>
				<Button
					disabled={!isSeedValid.bip39 || !networkKey || !address || accountAlreadyExists || !isDerivationPathValid}
					onPress={onRecoverConfirm}
					small={true}
					title={isDerivingAccount ? 'Derive' : 'Recover'}
				/>
			</View>
		</KeyboardScrollView>
	);
}

export default RecoverAccount;

const styles = StyleSheet.create({
	body: {
		backgroundColor: colors.background.app,
		flex: 1,
		overflow: 'hidden'
	},
	btnBox: {
		alignContent: 'center',
		marginTop: 10
	},
	errorText:{
		color: colors.signal.error,
		fontSize: 20,
		textAlign: 'center'
	},
	step: {
		padding: 16
	},
	title: {
		...fontStyles.h_subheading,
		color: colors.text.main
	}
});
