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

import '../shim';
import 'utils/iconLoader';
import '../ReactotronConfig';

import { NavigationContainer } from '@react-navigation/native';
import CustomAlert from 'components/CustomAlert';
import * as React from 'react';
import { LogBox,StatusBar } from 'react-native';
import NavigationBar from 'react-native-navbar-color';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import colors from 'styles/colors';

import { AccountsContextProvider, AlertContextProvider, NetworksContextProvider, RegistriesContextProvider, ScannerContextProvider } from './context';
import { AppNavigator } from './screens';

export default function App(): React.ReactElement {
	NavigationBar.setColor(colors.background.os);

	if (__DEV__) {
		LogBox.ignoreLogs([
			'Warning: componentWillReceiveProps',
			'Warning: componentWillMount',
			'Warning: componentWillUpdate',
			'Sending `onAnimatedValueUpdate`',
			'MenuProviders',
			'Non-serializable values were found in the navigation state' // https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
		]);
	}

	return (
		<SafeAreaProvider>
			<NetworksContextProvider>
				<AccountsContextProvider>
					<ScannerContextProvider>
						<RegistriesContextProvider>
							<AlertContextProvider>
								<MenuProvider backHandler={true}>
									<StatusBar
										backgroundColor={colors.background.app}
										barStyle="light-content"
									/>
									<CustomAlert />
									<NavigationContainer>
										<AppNavigator />
									</NavigationContainer>
								</MenuProvider>
							</AlertContextProvider>
						</RegistriesContextProvider>
					</ScannerContextProvider>
				</AccountsContextProvider>
			</NetworksContextProvider>
		</SafeAreaProvider>
	);
}
