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

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from 'styles/colors';

import Faded from './Faded';

interface Props {
	color?: string;
	text?: string;
}

const TEXT_LENGTH = 80
const TEXT_HEIGHT = 20
const OFFSET = TEXT_LENGTH / 2 - TEXT_HEIGHT / 2

export const NetworkFooter = ({ color, text }: Props): React.ReactElement => (
	<View
		style={[
			styles.footer,
			{ backgroundColor: color }
		]}
	>
		<Text style={styles.text}>{text}</Text>
		<Faded
			color={colors.background.app}
			direction="up"
			height={12}
			style={{
				height: TEXT_HEIGHT,
				transform: [
					{ rotate: '90deg' },
					{ translateX: 10 },
					{ translateY: 30 }
				  ],
				width: TEXT_LENGTH
			}}
		/>
	</View>
);

const styles = StyleSheet.create({
	footer: {
		height: TEXT_LENGTH,
		width: TEXT_HEIGHT
	},
	text: {
		color: colors.text.white,
		height: TEXT_HEIGHT,
		textAlign: 'center',
		transform: [
			{ rotate: '90deg' },
			{ translateX: OFFSET },
			{ translateY: OFFSET - 2 }
		  ],
		width: TEXT_LENGTH
	}
});
