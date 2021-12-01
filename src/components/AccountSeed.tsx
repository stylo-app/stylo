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

import React, { ReactElement, useState } from 'react';
import { NativeSyntheticEvent, StyleSheet, Text, TextInputProps, TextInputSelectionChangeEventData, View } from 'react-native';
import BIP39_WORDS from 'res/bip39_wordlist.json';
import PARITY_WORDS from 'res/parity_wordlist.json';
import colors from 'styles/colors';
import fonts from 'styles/fonts';
import fontStyles from 'styles/fontStyles';
import { binarySearch } from 'utils/array';

import TextInput from './TextInput';
import TouchableItem from './TouchableItem';

// Combined, de-duplicated, sorted word list (could be a precompute from json as well)
const ALL_WORDS = Array.from(new Set(PARITY_WORDS.concat(BIP39_WORDS))).sort();
const SUGGESTIONS_COUNT = 5;

interface Props extends TextInputProps { onChangeText: (text: string) => void; valid: boolean;}

export default function AccountSeed({ onChangeText, valid, ...props }: Props): React.ReactElement {
	const [cursorPosition, setCursorPosition] = useState({
		end: 0,
		start: 0
	});
	const [value, setValue] = useState('');

	function handleCursorPosition(event: NativeSyntheticEvent<TextInputSelectionChangeEventData>): void {
		setCursorPosition(event.nativeEvent.selection);
	}

	/**
	 * Generate a list of suggestions for input
	 */
	function generateSuggestions(input: string, wordList: string[]): string[] {
		const fromIndex = binarySearch(wordList, input).index; // index to start search from

		let suggestions = wordList.slice(fromIndex, fromIndex + SUGGESTIONS_COUNT);

		const lastValidIndex = suggestions.findIndex(word => !word.startsWith(input));

		if (lastValidIndex !== -1) {
			suggestions = suggestions.slice(0, lastValidIndex);
		}

		return suggestions;
	}

	function selectWordList(otherWords: string[]): string[] {
		for (const word of otherWords) {
			const isBIP39 = binarySearch(BIP39_WORDS, word).hit;
			const isParity = binarySearch(PARITY_WORDS, word).hit;

			if (!isBIP39 && isParity) {
				return PARITY_WORDS;
			} else if (isBIP39 && !isParity) {
				return BIP39_WORDS;
			}
		}

		return ALL_WORDS as string[];
	}

	function onNativeChangeText(text: string): void {
		setValue(text);
		onChangeText(text);
	}

	function renderSuggestions(): ReactElement {
		const { end, start } = cursorPosition;

		if (start !== end) return <View style={styles.suggestions} />;
		const currentPosition = end;
		let left = value.substring(0, currentPosition).split(' ');
		let right = value.substring(currentPosition).split(' ');

		const isLeftSpace =
			currentPosition === 0 || value[currentPosition - 1] === '';
		const isRightSpace =
			currentPosition === value.length - 1 || value[currentPosition + 1] === '';
		const leftInput = isLeftSpace ? '' : left[left.length - 1];
		const rightInput = isRightSpace ? '' : right[0];
		// combine last nibble before cursor and first nibble after cursor into a word
		const input = leftInput + rightInput;

		left = left.slice(0, -1);
		right = right.slice(1);

		// find a wordList using words around as discriminator
		const wordList = selectWordList(left.concat(right));
		const suggestions = generateSuggestions(input.toLowerCase(), wordList);

		return (
			<View style={styles.suggestions}>
				{suggestions.map((suggestion, i) => {
					const sepStyle =
						i !== suggestions.length - 1
							? { borderColor: colors.border.light, borderRightWidth: 0.3 }
							: {};

					return (
						<TouchableItem
							key={i}
							onPress={(): void => {
								let phrase = left.concat(suggestion, right).join(' ').trimEnd();
								const is24words = phrase.split(' ').length === 24;

								if (!is24words) phrase += ' ';
								onNativeChangeText(phrase);
							}}
						>
							<View
								key={suggestion}
								style={[styles.suggestion, sepStyle]}
							>
								<Text style={styles.suggestionText}>{suggestion}</Text>
							</View>
						</TouchableItem>
					);
				})}
			</View>
		);
	}

	const validStyles = valid ? styles.validInput : styles.invalidInput;

	return (
		<View>
			{value.length > 0 && !valid && renderSuggestions()}
			<TextInput
				autoCapitalize="none"
				autoCorrect={false}
				blurOnSubmit={true}
				multiline
				onChangeText={onNativeChangeText}
				onSelectionChange={handleCursorPosition}
				returnKeyType="done"
				style={StyleSheet.flatten([ fontStyles.t_seed, styles.input, validStyles ])}
				textAlignVertical="top"
				value={value}
				{...props}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	body: {
		flexDirection: 'column'
	},
	input: {
		borderBottomColor: colors.border.light
	},
	invalidInput: {
		borderBottomColor: colors.border.signal,
		borderColor: colors.border.signal
	},
	suggestion: {
		padding: 12,
		paddingVertical: 4
	},
	suggestionText: {
		color: colors.signal.main,
		fontFamily: fonts.regular,
		letterSpacing: fontStyles.t_seed.letterSpacing
	},
	suggestions: {
		alignItems: 'center',
		backgroundColor: colors.background.card,
		borderColor: colors.background.card,
		borderWidth: 0.5,
		flexDirection: 'row',
		height: 32,
		marginBottom: -8,
		marginHorizontal: 16,
		overflow: 'hidden'
	},
	validInput: {
		borderBottomColor: colors.border.valid,
		borderColor: colors.border.valid,
		color: colors.text.faded
	}
});
