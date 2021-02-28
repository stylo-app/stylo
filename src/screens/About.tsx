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

import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import iconLogo from 'res/img/icon.png';
import colors from 'styles/colors';
import fonts from 'styles/fonts';

import { version } from '../../package.json';

const About = () => (
	<SafeAreaViewContainer style={styles.wrapper}>
		<Image
			source={iconLogo}
			style={styles.logo}
		/>
		<Text style={styles.version}>version {version}</Text>
		<View>
			<Text style={styles.text}>
				The code of this application is available on GitHub: https://github.com/stylo-app/stylo
				and licensed under GNU General Public License v3.0.
			</Text>
			<Text style={styles.text}>
				This application is meant to be used on a phone that will remain
				offline at any point in time. To upgrade the app, you need to make
				sure you backup your accounts (e.g by writing the recovery phrase on
				paper), then factory reset the phone, then install Stylo's
				new version either from the store or from a sd card, and finally turn
				your phone offline for good before recoveing or generating new accounts.
			</Text>
			<Text style={styles.text}>
				This app does not send any data to its developer or any
				partner. The app works entirely offline once installed.
			</Text>
			<Text style={styles.text}>
				The development of this application was supported by the Polkadot treasury.
			</Text>
		</View>
	</SafeAreaViewContainer>
);

const styles = StyleSheet.create({
	bottom: {
		flexBasis: 50,
		paddingBottom: 15
	},

	logo: {
		alignSelf: 'center',
		height: 80,
		width: 157
	},
	text: {
		color: colors.text.main,
		fontFamily: fonts.regular,
		fontSize: 14,
		marginBottom: 20
	},
	top: {
		flex: 1
	},
	version: {
		color: colors.text.main,
		fontFamily: fonts.light,
		fontSize: 18,
		paddingBottom: 20,
		textAlign: 'center'
	},
	wrapper: {
		padding: 20
	}
});

export default About;