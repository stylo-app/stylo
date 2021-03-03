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

import { CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'types/routes';

export type GenericNavigationProps<
	RouteName extends keyof RootStackParamList
> = StackNavigationProp<RootStackParamList, RouteName>;

export const resetNavigationTo = <
RouteName extends keyof RootStackParamList>(navigation: GenericNavigationProps<RouteName>, screenName: string, params: Record<string, unknown> = {}, isNew = false): void => {
	const resetAction = CommonActions.reset({
		index: 1,
		routes: [
			{
				name: 'AccountList',
				params: { isNew }
			},
			{
				name: screenName,
				params: params
			}
		]
	});

	navigation.dispatch(resetAction);
};

export const resetNavigationWithScanner = <
	RouteName extends keyof RootStackParamList
>(
		navigation: GenericNavigationProps<RouteName>,
		screenName: string
	): void => {
	const resetAction = CommonActions.reset({
		index: 1,
		routes: [
			{
				name: 'AccountList',
				params: { isNew: false }
			},
			{ name: 'QrScanner' },
			{ name: screenName }
		]
	});

	navigation.dispatch(resetAction);
};

export const resetNavigationToHome = <RouteName extends keyof RootStackParamList>(
	navigation: GenericNavigationProps<RouteName>,
	screenName: string,
	params?: any
): void => {
	const resetAction = CommonActions.reset({
		index: 0,
		routes: [{ name: screenName, params }]
	});

	navigation.dispatch(resetAction);
};

export const navigateToNetworkSettings = <
	RouteName extends keyof RootStackParamList
>(
		navigation: GenericNavigationProps<RouteName>
	): void => resetNavigationTo(navigation, 'NetworkSettings');

export const navigateToPathsList = <RouteName extends keyof RootStackParamList>(
	navigation: GenericNavigationProps<RouteName>,
	networkKey: string
): void =>
		resetNavigationTo(navigation, 'PathsList', { networkKey });

export const navigateToQrScanner = <RouteName extends keyof RootStackParamList>(
	navigation: GenericNavigationProps<RouteName>
): void => resetNavigationTo(navigation, 'QrScanner');

export const navigateToAccountList = <RouteName extends keyof RootStackParamList>(navigation: GenericNavigationProps<RouteName>): void =>
	resetNavigationToHome(navigation, 'AccountList');
