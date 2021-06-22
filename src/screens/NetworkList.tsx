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

import { useNavigation } from '@react-navigation/native';
import { NetworkCard } from 'components/NetworkCard';
import { SafeAreaScrollViewContainer } from 'components/SafeAreaContainer';
import { UnknownNetworkKeys } from 'constants/networkSpecs';
import React, { useContext, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { NetworkParams } from 'types/networkTypes';
import { NavigationProps } from 'types/props';

import { AccountsContext, NetworksContext } from '../context';

export default function NetworkListView({ route }: NavigationProps<'NetworkList'>): React.ReactElement {
	const { changeCurrentAccountNetwork, getSelectedAccount, lockAccount, selectAccount, updateNew } = useContext(AccountsContext);
	const { allNetworks } = useContext(NetworksContext);
	const excludedNetworks = [UnknownNetworkKeys.UNKNOWN];
	const { goBack } = useNavigation()
	const shouldUpdateCurrentAccount = route.params?.changeCurrentAccountNetwork

	useEffect(() => {
		const handleAppStateChange = (nextAppState: AppStateStatus): void => {
			if (nextAppState === 'inactive') {
				goBack();
			}
		};

		AppState.addEventListener('change', handleAppStateChange);

		return (): void => {
			const { address } = getSelectedAccount() || {};

			if (address && shouldUpdateCurrentAccount) {
				lockAccount(address);
			}

			AppState.removeEventListener('change', handleAppStateChange);
		};
	}, [getSelectedAccount, goBack, lockAccount, shouldUpdateCurrentAccount]);

	return (
		<SafeAreaScrollViewContainer contentContainerStyle={{ padding: 20 }}>
			{Array.from(allNetworks.entries())
				.filter(([networkKey]: [string, any]): boolean =>
					!excludedNetworks.includes(networkKey))
				.map(([networkKey, networkParams]: [ string, NetworkParams ]): React.ReactElement => (
					<NetworkCard
						key={networkKey}
						networkKey={networkKey}
						onPress={(): void =>{
							shouldUpdateCurrentAccount
								? changeCurrentAccountNetwork(networkKey).then((newAddress) => newAddress && selectAccount(newAddress))
								: updateNew({ networkKey });
							goBack();
						}}
						title={networkParams.title}
					/>
				))}
		</SafeAreaScrollViewContainer>
	);
}
