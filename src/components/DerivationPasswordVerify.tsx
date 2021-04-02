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

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from 'styles/colors';
import fonts from 'styles/fonts';
import fontStyles from 'styles/fontStyles';

import TextInput from './TextInput';

interface Props {
	password: string;
}

export default function DerivationPasswordVerify({ password }: Props): React.ReactElement {
	const [enteredPassword, setEnteredPassword] = useState('');
	const [verifyField, setVerifyField] = useState(false);
	const isMatching = enteredPassword === password;

	const toggleVerifyField = (): void => {
		setEnteredPassword('')
		setVerifyField(!verifyField);
	};

	return (
		<>
			<Text style={styles.passwordText}>
				<Icon
					color={colors.text.faded}
					name={'info'}
					size={16}
				/>
					This account uses a derivation password.{' '}
			</Text>
			<TouchableOpacity
				onPress={toggleVerifyField}
			>
				<View style={styles.container}>
					<Text
						onPress={toggleVerifyField}
						style={{ ...styles.passwordText, ...styles.link }}
					>
					Verify it here
					</Text>
					<Icon
						name={verifyField ? 'arrow-drop-up' : 'arrow-drop-down'}
						size={20}
						style={styles.icon}
					/>
				</View>
			</TouchableOpacity>
			{verifyField && (
				<TextInput
					onChangeText={setEnteredPassword}
					placeholder="password without ///"
					style={isMatching ? { ...styles.input, ...styles.validInput } : { ...styles.input, ...styles.invalidInput }}
					value={enteredPassword}
				/>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flexDirection: 'row'
	},
	icon: {
		color: colors.text.faded
	},
	input: {
		...fontStyles.t_seed,
		color: colors.text.faded,
		lineHeight: 18,
		minHeight: 1,
		paddingHorizontal: 16,
		paddingVertical: 0
	},
	invalidInput: {
		borderBottomColor: colors.signal.error,
		borderColor: colors.signal.error
	},
	link: {
		marginTop: 0,
		textDecorationLine: 'underline'
	},
	passwordText: {
		color: colors.text.faded,
		fontFamily: fonts.regular,
		fontSize: 18,
		marginTop: 20,
		paddingBottom: 0
	},
	validInput: {
		borderBottomColor: colors.border.valid,
		borderColor: colors.border.valid,
		color: colors.border.valid
	}
});
