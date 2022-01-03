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

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import strings from 'modules/sign/strings';
import { useContext } from 'react';
import { RootStackParamList } from 'types/routes';
import { CompletedParsedData, EthereumParsedData, isMultiFramesInfo, isMultipartData, isNetworkParsedData, NetworkParsedData, ParsedData, SubstrateParsedData, TxRequestData } from 'types/scannerTypes';
import { constructDataFromBytes, isAddressString, isJsonString, rawDataToU8A } from 'utils/decoders';

import { AccountsContext, NetworksContext, ScannerContext } from '../../context';

export function useProcessBarCode(showAlertMessage: (title: string, message: string, isSuccess?: boolean) => void): (txRequestData: TxRequestData) => Promise<void> {
	const { networks } = useContext(NetworksContext);
	const { getAccountByAddress } = useContext(AccountsContext);
	const scannerStore = useContext(ScannerContext);
	const navigation: StackNavigationProp<RootStackParamList,'QrScanner'> = useNavigation();

	async function parseQrData(txRequestData: TxRequestData): Promise<ParsedData> {
		if (isAddressString(txRequestData.data)) {
			throw new Error(strings.ERROR_ADDRESS_MESSAGE);
		} else if (isJsonString(txRequestData.data)) {
			// Add Network
			const parsedJsonData = JSON.parse(txRequestData.data);

			if (parsedJsonData.hasOwnProperty('genesisHash')) {
				return {
					action: 'addNetwork',
					data: parsedJsonData
				} as NetworkParsedData;
			}

			// Ethereum Legacy
			return parsedJsonData;
		} else if (!scannerStore.state.multipartComplete) {
			const strippedData = rawDataToU8A(txRequestData.rawData);

			if (strippedData === null) throw new Error(strings.ERROR_NO_RAW_DATA);
			const parsedData = await constructDataFromBytes(strippedData, false, networks);

			return parsedData;
		} else {
			throw new Error(strings.ERROR_NO_RAW_DATA);
		}
	}

	async function checkMultiFramesData(parsedData: SubstrateParsedData | EthereumParsedData): Promise<null | CompletedParsedData> {
		if (isMultipartData(parsedData)) {
			const multiFramesResult = await scannerStore.setPartData(parsedData.currentFrame, parsedData.frameCount, parsedData.partData);

			if (isMultiFramesInfo(multiFramesResult)) {
				return null;
			}

			//Otherwise all the frames are assembled as completed parsed data
			return multiFramesResult;
		} else {
			return parsedData;
		}
	}

	async function processBarCode(txRequestData: TxRequestData): Promise<void> {
		try {
			const parsedData = await parseQrData(txRequestData);

			if (isNetworkParsedData(parsedData)) {
				return showAlertMessage('Not supported',
					'Adding a network is not supported in Stylo as it is considered insecure',
					false);
			}

			const unsignedData = await checkMultiFramesData(parsedData);

			if (unsignedData === null) {
				console.error('Unsigned data is null')

				return;
			}

			const qrInfo = await scannerStore.setData(unsignedData);

			scannerStore.clearMultipartProgress();

			const { senderAddress, type } = qrInfo;
			const senderAccount = getAccountByAddress(senderAddress);

			if (!senderAccount){

				return showAlertMessage(strings.ERROR_TITLE, strings.ERROR_NO_SENDER_FOUND);
			}

			navigation.navigate('AccountUnlockAndSign', { next: type === 'transaction' ? 'SignedTx' : 'SignedMessage' });

		} catch (e) {
			console.error(e);
			const message = e instanceof Error ? e.message : 'unknown error :('

			return showAlertMessage(strings.ERROR_TITLE, message);
		}
	}

	return processBarCode;
}

export const unwrapMessage = (message: string) => {
	const prefix = '<Bytes>'
	const suffix = '</Bytes>'

	let unwrapped = message;

	unwrapped = unwrapped.substr(0,prefix.length) === prefix ? unwrapped.substr(prefix.length, unwrapped.length) : unwrapped
	unwrapped = unwrapped.substr(unwrapped.length - suffix.length, suffix.length) === suffix ? unwrapped.substr(0, unwrapped.length - suffix.length) : unwrapped

	return unwrapped
}