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

import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import HeaderMenus from 'components/HeaderMenus';
import HeaderTitleHome from 'components/HeaderTitleHome';
import testIDs from 'e2e/testIDs';
import NetworkDetails from 'modules/network/screens/NetworkDetails';
import NetworkSettings from 'modules/network/screens/NetworkSettings';
import QrScanner from 'modules/sign/screens/QrScanner';
import SignedMessage from 'modules/sign/screens/SignedMessage';
import SignedTx from 'modules/sign/screens/SignedTx';
import PinNew from 'modules/unlock/screens/PinNew';
import * as React from 'react';
import { View } from 'react-native';
import About from 'screens/About';
import AccountDetails from 'screens/AccountDetails';
import AccountEdit from 'screens/AccountEdit';
import AccountList from 'screens/AccountList';
import AccountNew from 'screens/AccountNew';
import AccountPin from 'screens/AccountPin';
import { AccountUnlock, AccountUnlockAndSign } from 'screens/AccountUnlock';
import Main from 'screens/Main';
import Mnemonic from 'screens/Mnemonic';
import NetworkList from 'screens/NetworkList';
import RecoverAccount from 'screens/RecoverAccount';
import Security from 'screens/Security';
import TermsAndConditions from 'screens/TermsAndConditions';
import colors from 'styles/colors';
import { headerHeight, horizontalPadding } from 'styles/containerStyles';
import { RootStackParamList } from 'types/routes';

export const ScreenStack = createStackNavigator<RootStackParamList>();

const HeaderLeft = (): React.ReactElement => {
	const route = useRoute();
	const isFirstRouteInParent = useNavigationState(state => state.routes[0].key === route.key);

	return isFirstRouteInParent
		? <></>
		: <HeaderLeftWithBack/>;
};

const HeaderTitle = (): React.ReactElement => {
	const route = useRoute();
	const isFirstRouteInParent = useNavigationState(state => state.routes[0].key === route.key);

	return isFirstRouteInParent
		? <HeaderTitleHome/>
		: <></>;
};

const globalStackNavigationOptions = {
	//more transition animations refer to: https://reactnavigation.org/docs/en/stack-navigator.html#animations
	cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
	headerBackTitleStyle: { color: colors.text.main },
	headerBackTitleVisible: false,
	headerLeft: (): React.ReactElement => <HeaderLeft/>,
	headerLeftContainerStyle: {
		height: headerHeight,
		paddingLeft: 8
	},
	headerRight: (): React.ReactElement => <HeaderMenus/>,
	headerRightContainerStyle: {
		height: headerHeight,
		paddingRight: horizontalPadding
	},
	headerStyle: {
		backgroundColor: colors.background.app,
		borderBottomColor: colors.background.app,
		borderBottomWidth: 0,
		elevation: 0,
		height: headerHeight,
		shadowColor: 'transparent'
	},
	headerTintColor: colors.text.main,
	headerTitle: (): React.ReactElement => <HeaderTitle/>
};

const HeaderLeftWithBack = (): React.ReactElement => {
	const navigation = useNavigation();

	return (
		<View testID={testIDs.Header.headerBackButton}>
			<HeaderBackButton
				labelStyle={globalStackNavigationOptions.headerBackTitleStyle}
				labelVisible={false}
				onPress={(): void => navigation.goBack()}
				tintColor={colors.text.main}
			/>
		</View>
	);
};

export const AppNavigator = (): React.ReactElement => (
	<ScreenStack.Navigator
		initialRouteName="Main"
		screenOptions={globalStackNavigationOptions}
	>
		<ScreenStack.Screen
			component={Main}
			name="Main"
		/>
		<ScreenStack.Screen
			component={About}
			name="About"
		/>
		<ScreenStack.Screen
			component={AccountDetails}
			name="AccountDetails"
		/>
		<ScreenStack.Screen
			component={AccountEdit}
			name="AccountEdit"
		/>
		<ScreenStack.Screen
			component={AccountPin}
			name="AccountPin"
		/>
		<ScreenStack.Screen
			component={AccountUnlock}
			name="AccountUnlock"
		/>
		<ScreenStack.Screen
			component={AccountNew}
			name="AccountNew"
		/>
		<ScreenStack.Screen
			component={AccountUnlockAndSign}
			name="AccountUnlockAndSign"
		/>
		<ScreenStack.Screen
			component={Mnemonic}
			name="Mnemonic"
		/>
		<ScreenStack.Screen
			component={AccountList}
			name="AccountList"
		/>
		<ScreenStack.Screen
			component={NetworkList}
			name="NetworkList"
		/>
		<ScreenStack.Screen
			component={RecoverAccount}
			name="RecoverAccount"
		/>
		<ScreenStack.Screen
			component={NetworkDetails}
			name="NetworkDetails"
		/>
		<ScreenStack.Screen
			component={NetworkSettings}
			name="NetworkSettings"
		/>
		<ScreenStack.Screen
			component={PinNew}
			name="PinNew"
		/>
		<ScreenStack.Screen
			component={QrScanner}
			name="QrScanner"
		/>
		<ScreenStack.Screen
			component={Security}
			name="Security"
		/>
		<ScreenStack.Screen
			component={SignedMessage}
			name="SignedMessage"
		/>
		<ScreenStack.Screen
			component={SignedTx}
			name="SignedTx"
		/>
		<ScreenStack.Screen
			component={TermsAndConditions}
			name="TermsAndConditions"
		/>
	</ScreenStack.Navigator>
);
