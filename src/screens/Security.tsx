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

import InsecureDeviceBanner from 'components/InsecureDeviceBanner';
import { SafeAreaScrollViewContainer } from 'components/SafeAreaContainer';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from 'styles/colors'

const Security = () => {
	return (
		<SafeAreaScrollViewContainer>
			<InsecureDeviceBanner />
			<Text style={styles.mainText}>
				This device is considered insecure because it has access to the internet
				or because any kind of connectivity is enabled.
			</Text>
			<Text style={styles.mainText}>
				Stylo is meant to be used on a device that is offline at any time.
				Enabling any connectivity such as wifi, cellular network, bluetooth, NFC,
				usb is a threat to the safety of the private keys stored on this device.
			</Text>
			<Text style={styles.mainText}>
				Make sure to follow the security instructions available on stylo-app.com
				to use this application as intended, and guarantee the highest security for
				your funds.
			</Text>
		</SafeAreaScrollViewContainer>
	);
}

const styles = StyleSheet.create({
	mainText: {
		color: colors.text.main,
		fontSize: 16,
		padding: 16,
		paddingBottom: 0
	}
})

export default Security