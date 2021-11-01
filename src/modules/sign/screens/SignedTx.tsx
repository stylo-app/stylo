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
import { Loader } from 'components/Loader';
import QrView from 'components/QrView';
import { SafeAreaScrollViewContainer } from 'components/SafeAreaContainer';
import Separator from 'components/Separator';
import EthTxDetailsCard from 'modules/sign/components/EthTxDetailsCard';
import PayloadDetailsCard from 'modules/sign/components/PayloadDetailsCard';
import { usePayloadDetails } from 'modules/sign/hooks';
import strings from 'modules/sign/strings';
import styles from 'modules/sign/styles';
import React, { useCallback , useContext, useEffect,useState  } from 'react';
import { Text, View } from 'react-native';
import fontStyles from 'styles/fontStyles';
import { isEthereumNetwork, SubstrateNetworkParams } from 'types/networkTypes';
import { NavigationProps, NavigationScannerProps } from 'types/props';
import { showSpecVersionMismatchAlert } from 'utils/alertUtils';
import { Transaction } from 'utils/transaction';

import metadataJson from '../../../constants/metadata.json';
import { AccountsContext, AlertContext, NetworksContext, ScannerContext } from '../../../context';
import { useHelperNavigation } from '../../../hooks/useNavigationHelpers';

interface Props extends NavigationScannerProps<'SignedTx'> {
	senderAddress: string;
	recipientAddress: string;
}

const SignedTxView = ({ recipientAddress, senderAddress }: Props): React.ReactElement => {
	const { getAccountByAddress } = useContext(AccountsContext);
	const sender = getAccountByAddress(senderAddress);

	const { getNetwork } = useContext(NetworksContext);
	const { state: { rawPayload, signedData, tx } } = useContext(ScannerContext)
	const { gas, gasPrice, value } = tx as Transaction;
	const [isProcessing, payload] = usePayloadDetails(rawPayload, sender?.networkKey);
	const senderNetwork = getNetwork(sender?.networkKey);
	const isEthereum = !!senderNetwork && isEthereumNetwork(senderNetwork);
	const { setAlert } = useContext(AlertContext);
	const { navigateToAccountList } = useHelperNavigation()
	const [isAlerted, setIsAlerted] = useState(false);
	const metadataSpecVersion = (metadataJson as Record<string, any>)[(senderNetwork as SubstrateNetworkParams).metadataKey].specVersion

	useEffect(() => {
		if(!isAlerted && !isEthereum && (Number(payload?.specVersion) > metadataSpecVersion)){
			setIsAlerted(true);
			showSpecVersionMismatchAlert(setAlert, senderNetwork?.title || 'unknown', navigateToAccountList);
		}
	},[isAlerted, isEthereum, metadataSpecVersion, navigateToAccountList, payload?.specVersion, senderNetwork?.title, setAlert])

	const PayloadDetails = useCallback(() => {
		if (!sender) {
			console.error('no sender');

			return <View/>;
		}

		if (isEthereum) {
			return (
				<View style={{ marginTop: 16 }}>
					<EthTxDetailsCard
						description={strings.INFO_ETH_TX}
						gas={gas}
						gasPrice={gasPrice}
						style={{ marginBottom: 20 }}
						value={value}
					/>
					<Text style={styles.title}>Recipient</Text>
					<AccountCard
						address={recipientAddress}
						networkKey={sender.networkKey}
					/>
				</View>
			);
		}

		return (
			<PayloadDetailsCard
				networkKey={sender.networkKey}
				payload={payload}
				signature={signedData}
			/>
		);
	},[gas, gasPrice, isEthereum, payload, recipientAddress, sender, signedData, value])

	if (!sender) {
		console.error('no sender');

		return <View/>;
	}

	if (isProcessing || !signedData || (!isEthereum && payload === null)) {

		return (<Loader label='Signing...'/>)
	}

	return (
		<SafeAreaScrollViewContainer>
			<Text style={styles.topTitle}>Signed transaction</Text>
			<AccountCard
				address={sender.address}
				networkKey={sender.networkKey}
			/>
			<PayloadDetails />
			<Separator
				shadow={false}
				style={{
					height: 0,
					marginVertical: 20
				}}
			/>
			<Text style={[fontStyles.h_subheading, { paddingHorizontal: 16 }]}>
				{'Scan to publish'}
			</Text>
			<View
				style={styles.qr}
			>
				<QrView data={signedData} />
			</View>
		</SafeAreaScrollViewContainer>
	);
}

function SignedTx(props: NavigationProps<'SignedTx'>): React.ReactElement {
	const { state: { recipientAddress, senderAddress } } = useContext(ScannerContext);

	if (senderAddress === null || recipientAddress === null) return <View />;

	return (
		<SignedTxView
			recipientAddress={recipientAddress}
			senderAddress={senderAddress}
			{...props}
		/>
	);
}

export default SignedTx;
