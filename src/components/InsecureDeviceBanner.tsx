import React from 'react';
import { StyleSheet, Text,TouchableWithoutFeedback,View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import colors from 'styles/colors';

interface Props {
    onPress?: () => void
}

const InsecureDeviceBanner = ({ onPress }: Props) =>
	<TouchableWithoutFeedback
		onPress={onPress}
	>
		<View style={styles.insecureDeviceBanner}>
			<Icon
				color={colors.text.white}
				name="shield-off"
				size={22}
			/>
			<Text style={styles.warningText}>Insecure device</Text>
		</View>
	</TouchableWithoutFeedback>

export default InsecureDeviceBanner;

const styles = StyleSheet.create({
	insecureDeviceBanner: {
		alignItems: 'center',
		backgroundColor: colors.signal.error,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		padding: 5
	},
	warningText: {
		color: colors.text.white,
		marginLeft: 5
	}
})