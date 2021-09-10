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

import Clipboard from '@react-native-community/clipboard';

import { Action, SetAlert } from '../context/AlertContext';

export const alertError = (setAlert: SetAlert, message: string): void =>
	setAlert('Error', message);

const buildAlertButtons = (onConfirm: () => any, confirmText: string): Action[] => [
	{
		onPress: (): void => {
			onConfirm();
		},
		text: confirmText
	},
	{ text: 'Cancel' }
];

const buildAlertDeleteButtons = (onDelete: () => any): Action[] => buildAlertButtons(onDelete, 'Delete');

export const alertDeleteAccount = (setAlert: SetAlert,
	accountName: string,
	onDelete: () => any): void => {
	setAlert('Delete Account',
		`Do you really want to delete ${accountName}?
This account can only be recovered with its associated secret phrase.`,
		buildAlertDeleteButtons(onDelete));
};

export const alertCopyBackupPhrase = (setAlert: SetAlert, seedPhrase: string): void =>
	setAlert('Write this secret phrase on paper',
		'It is not recommended to transfer or store a secret phrase digitally and unencrypted. Anyone in possession of this secret phrase is able to spend funds from this account.',
		[
			{
				onPress: (): void => {
					Clipboard.setString(seedPhrase);
				},
				text: 'Copy'
			},
			{ text: 'Cancel' }
		]);

export const alertRisks = (setAlert: SetAlert, message: string, onPress: () => any): void =>
	setAlert('Warning', message, [
		{
			onPress,
			text: 'Proceed'
		},
		{ text: 'Back' }
	]);

export const alertDecodeError = (setAlert: SetAlert, error: string): void =>
	setAlert('Could not decode method with available metadata.',
		`Signing something you do not understand is inherently unsafe. Do not sign this extrinsic unless you know what you are doing, or update Stylo to be able to decode this message. If you are not sure, or you are using the latest version, please open an issue on github.com/stylo-app/stylo.
		
Error: ${error}`,
		[
			{ text: 'OK' }
		]);

export const alertBackupDone = (setAlert: SetAlert, onPress: () => any): void =>
	setAlert('Important',
		"Make sure you've backed up this secret phrase. It is the only way to restore your account in case of device failure/loss.",
		[
			{
				onPress,
				text: 'Proceed'
			},
			{ text: 'Cancel' }
		]);

export const showSpecVersionMismatchAlert = (setAlert: SetAlert, networkTitle: string, onPress: () => any): void =>
	setAlert('Warning',
		`This version of Stylo is not up to date with the latest version of ${networkTitle} network.

The transaction details can be wrong or meaningless.

You should stop right here, cancel this transaction by tapping "Back" and update Stylo.

If you proceed you may put your funds at risk.`, [
			{ text: 'Proceed' },
			{
				onPress,
				text: 'Back'
			}
		])