import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';

import { SafeAreaScrollViewContainer } from './SafeAreaContainer';

interface Props {
    label?: string
}
export const Loader = ({ label }: Props) => (
	<SafeAreaScrollViewContainer>
		<View style={styles.container}>
			<ActivityIndicator
				color={colors.text.main}
				size={60}
				style={styles.indicator}
			/>
			{!!label && (
				<Text style={styles.label}>
					{label}
				</Text>)
			}
		</View>
	</SafeAreaScrollViewContainer>
);

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flexDirection: 'column',
		height:'100%',
		justifyContent: 'center',
		textAlign: 'center'
	},
	indicator:{
	},
	label: {
		...fontStyles.t_big,
		color: colors.text.main
	}
});