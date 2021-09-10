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

import { CommonActions, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

export const useHelperNavigation = () => {
	const navigation = useNavigation();

	const resetNavigationTo = useCallback((screenName: string, params: Record<string, unknown> = {}, isNew = false): void => {
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
	}, [navigation])

	const resetNavigationToHome = useCallback((screenName: string, params?: any): void => {
		const resetAction = CommonActions.reset({
			index: 0,
			routes: [{ name: screenName, params }]
		});

		navigation.dispatch(resetAction);
	}, [navigation])

	const navigateToAccountDetails = useCallback(() => {
		const resetAction = CommonActions.reset({
			index: 1,
			routes: [{ name: 'AccountList' }, { name: 'AccountDetails' }]
		});

		navigation.dispatch(resetAction);
	}, [navigation])

	const navigateToAccountList = useCallback((): void => resetNavigationToHome('AccountList'), [resetNavigationToHome]);

	const navigateToQrScanner = useCallback((): void => resetNavigationTo('QrScanner'), [resetNavigationTo]);

	const navigateToNetworkSettings = useCallback((): void => resetNavigationTo('NetworkSettings'), [resetNavigationTo]);

	return {
		navigateToAccountDetails,
		navigateToAccountList,
		navigateToNetworkSettings,
		navigateToQrScanner
	}

}