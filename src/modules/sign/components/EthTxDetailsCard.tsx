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

import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import colors from 'styles/colors';
import fonts from 'styles/fonts';

const WEI_IN_ETH = 1000000000000000000;

interface Props {
	value: string;
	description: string;
	gas: string;
	gasPrice: string;
	style: ViewStyle;
}

interface AmountProps {
	value: string;
	gas: string;
	gasPrice: string;
	style: ViewStyle;
}

function EthAmount({ gas, gasPrice, style, value }: AmountProps): React.ReactElement<AmountProps> {
	const fee = (parseInt(gas, 10) * parseInt(gasPrice, 10)) / WEI_IN_ETH;

	return (
		<View style={[styles.amountContainer, style]}>
			<Text style={styles.amountTextContainer}>
				<Text style={{ color: colors.text.main }}>{value}</Text>
				<Text style={{ color: colors.text.faded }}> ETH</Text>
			</Text>
			<View style={{ marginTop: 5 }}>
				<Text style={styles.amountText}>fee: {fee} ETH</Text>
			</View>
		</View>
	);
}

const TxDetailsCard = ({ description, gas, gasPrice, style, value }: Props): React.ReactElement => {

	return (
		<View style={[styles.body, style]}>
			<Text style={styles.titleText}>{description}</Text>
			<EthAmount
				gas={gas}
				gasPrice={gasPrice}
				style={{ marginTop: 10 }}
				value={value}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	amountContainer: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	amountText: {
		color: colors.text.main,
		fontSize: 12,
		fontWeight: '800',
		textAlign: 'center'
	},
	amountTextContainer: {
		fontSize: 20,
		fontWeight: '800',
		textAlign: 'center'
	},
	body: {
		backgroundColor: colors.background.card,
		flexDirection: 'column',
		padding: 20,
		paddingTop: 10
	},
	titleText: {
		color: colors.text.faded,
		fontFamily: fonts.bold,
		fontSize: 14,
		textAlign: 'center'
	}
});

export default TxDetailsCard;