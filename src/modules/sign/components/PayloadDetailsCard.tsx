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

import type { Call, ExtrinsicEra } from '@polkadot/types/interfaces';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';
import { isSubstrateNetwork } from 'types/networkTypes';
import { alertDecodeError } from 'utils/alertUtils';

import { GenericExtrinsicPayload } from '@polkadot/types';
import { AnyJson, AnyU8a, IExtrinsicEra, IMethod } from '@polkadot/types/types';
import { formatBalance } from '@polkadot/util';

import { AlertContext, NetworksContext, RegistriesContext } from '../../../context';

type ExtrinsicPartProps = {
	label: string;
	networkKey: string;
	value: AnyJson | AnyU8a | IMethod | IExtrinsicEra;
};

const ExtrinsicPart = ({ label, networkKey, value }: ExtrinsicPartProps): React.ReactElement => {
	const [period, setPeriod] = useState<string>();
	const [phase, setPhase] = useState<string>();
	const [formattedCallArgs, setFormattedCallArgs] = useState<any>();
	const [tip, setTip] = useState<string>();
	const [useFallback, setUseFallBack] = useState(false);
	const { getTypeRegistry } = useContext(RegistriesContext);
	const { setAlert } = useContext(AlertContext);
	const { getSubstrateNetwork } = useContext(NetworksContext);
	const network = getSubstrateNetwork(networkKey);
	const { color: networkColor } = network || {}
	const typeRegistry = useMemo(() => getTypeRegistry(networkKey)!, [getTypeRegistry, networkKey]);

	useEffect(() => {
		if (useFallback) {
			return
		}

		if (label === 'Method') {

			try {
				const call = typeRegistry.createType('Call', value);
				const methodArgs = {};

				function formatArgs(callInstance: Call, callMethodArgs: any, depth: number): void {
					const { args, meta } = callInstance;
					const paramArgKvArray = [];

					const sectionMethod = `${call.section}.${call.method}`;

					if (!meta.args.length) {

						callMethodArgs[sectionMethod] = null;

						return;
					}

					for (let i = 0; i < meta.args.length; i++) {
						let argument;

						if (args[i].toRawType().startsWith('Vec')) {
							// toString is nicer than toHuman here because
							// toHuman tends to concatenate long strings and would hide data
							argument = (args[i] as any).map((v: any) => v.toString());
						} else if (args[i].toRawType().startsWith('AccountId')) {
							// toString is nicer than toHumand here because it removes
							// an additionnal { "Id": ...
							argument = args[i].toString()
					 	} else if ((args[i] as Call).section) {
							// go deeper into the nested calls
							argument = formatArgs(args[i] as Call, callMethodArgs, depth++);
						} else {
							// toHuman takes care of the balance formating
							// with the right chain unit
							argument = JSON.stringify(args[i].toHuman());
						}

						const param = meta.args[i].name.toHuman();

						paramArgKvArray.push([param, argument]);
						callMethodArgs[sectionMethod] = paramArgKvArray;
					}
				}

				formatArgs(call, methodArgs, 0);
				setFormattedCallArgs(methodArgs);
			} catch (e) {
				console.error(e)
				alertDecodeError(setAlert, (e as Error).message);
				setUseFallBack(true);
			}
		}

		if (label === 'Era') {
			if ((value as ExtrinsicEra).isMortalEra) {
				setPeriod((value as ExtrinsicEra).asMortalEra.period.toString());
				setPhase((value as ExtrinsicEra).asMortalEra.phase.toString());
			}
		}

		if (label === 'Tip') {
			setTip(formatBalance(value as any));
		}
	}, [label, setAlert, typeRegistry, useFallback, value]);

	const renderEraDetails = (): React.ReactElement => {
		if (period && phase) {
			return (
				<View style={styles.era}>
					<Text style={{ ...styles.secondaryText, flex: 1 }}>
						phase: {phase}{' '}
					</Text>
					<Text style={{ ...styles.secondaryText, flex: 1 }}>
						period: {period}
					</Text>
				</View>
			);
		} else {
			return (
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						flexWrap: 'wrap'
					}}
				>
					<Text style={{ ...styles.secondaryText, flex: 1 }}>
						Immortal Era
					</Text>
					<Text style={{ ...styles.secondaryText, flex: 3 }}>
						{value?.toString()}
					</Text>
				</View>
			);
		}
	};

	type ArgsList = Array<[string, any]>;
	type MethodCall = [string, ArgsList];
	type FormattedArgs = Array<MethodCall>;

	const renderMethodDetails = (): React.ReactNode => {
		if (formattedCallArgs) {
			const formattedArgs: FormattedArgs = Object.entries(formattedCallArgs);

			// HACK: if there's a sudo method just put it to the front.
			// A better way would be to order by depth but currently this is
			// only relevant for a single extrinsic, so seems like overkill.
			for (let i = 1; i < formattedArgs.length; i++) {
				if (formattedArgs[i][0].includes('sudo')) {
					const tmp = formattedArgs[i];

					formattedArgs.splice(i, 1);
					formattedArgs.unshift(tmp);
					break;
				}
			}

			return formattedArgs.map((entry, index) => {
				const sectionMethod = entry[0];
				const paramArgs: Array<[any, any]> = entry[1];

				return (
					<View
						key={index}
						style={styles.callDetails}
					>
						<Text style={styles.secondaryText}>
							Call <Text style={styles.titleText}>{sectionMethod}</Text> with
							the following arguments:
						</Text>
						{paramArgs ? (
							paramArgs.map(([param, arg]) => (
								<View
									key={param}
									style={styles.callDetails}
								>
									<Text style={styles.titleText}>
										{param}:{' '}
										{arg && arg instanceof Array
											? arg.join(', ')
											: arg}{' '}
									</Text>
								</View>
							))
						) : (
							<Text style={styles.secondaryText}>
								This method takes no argument.
							</Text>
						)}
					</View>
				);
			});
		}
	};

	const renderTipDetails = (): React.ReactElement => {
		return (
			<View style={{ display: 'flex', flexDirection: 'column' }}>
				<Text style={styles.secondaryText}>{tip}</Text>
			</View>
		);
	};

	return (
		<View style={[{ alignItems: 'baseline', justifyContent: 'flex-start' }]}>
			<View style={{ marginBottom: 12, width: '100%' }}>
				<Text style={[styles.label, { backgroundColor: networkColor }]}>{label}</Text>
				{label === 'Method' && !useFallback ? (
					renderMethodDetails()
				) : label === 'Era' ? (
					renderEraDetails()
				) : label === 'Tip' ? (
					renderTipDetails()
				) : (
					<Text style={styles.secondaryText}>
						{useFallback ? value?.toString() : value}
					</Text>
				)}
			</View>
		</View>
	);
};

interface PayloadDetailsCardProps {
	description?: string;
	payload?: GenericExtrinsicPayload | null;
	signature?: string;
	style?: ViewStyle;
	networkKey: string;
}

const PayloadDetailsCard = ({ description, networkKey, payload, signature, style }: PayloadDetailsCardProps): React.ReactElement =>  {
	const { getNetwork } = useContext(NetworksContext);
	const network = useMemo(() => getNetwork(networkKey),[getNetwork, networkKey]);
	const fallback = useMemo(() => !network, [network]);

	if (isSubstrateNetwork(network)) {
		formatBalance.setDefaults({
			decimals: network.decimals,
			unit: network.unit
		});
	}

	return (
		<View style={[styles.body, style]}>
			{!!description && <Text style={styles.titleText}>{description}</Text>}
			{!!payload && (
				<View style={styles.extrinsicContainer}>
					<ExtrinsicPart
						label="Method"
						networkKey={networkKey}
						value={fallback ? payload.method.toHuman() : payload.method}
					/>
					<ExtrinsicPart
						label="Era"
						networkKey={networkKey}
						value={fallback ? payload.era.toString() : payload.era}
					/>
					<ExtrinsicPart
						label="Nonce"
						networkKey={networkKey}
						value={payload.nonce.toString()}
					/>
					<ExtrinsicPart
						label="Tip"
						networkKey={networkKey}
						value={payload.tip.toString()}
					/>
				</View>
			)}
			{!!signature && (
				<View style={styles.extrinsicContainer}>
					<Text style={[styles.label, { backgroundColor: network?.color }]}>Signature</Text>
					<Text style={styles.secondaryText}>{signature}</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	body: {
		marginTop: 8
	},
	callDetails: {
		marginBottom: 4
	},
	era: {
		flexDirection: 'row'
	},
	extrinsicContainer: {
		paddingTop: 16
	},
	label: {
		...fontStyles.t_label,
		color: colors.text.white,
		marginBottom: 10,
		paddingLeft: 8,
		textAlign: 'left'
	},
	secondaryText: {
		...fontStyles.t_codeS,
		color: colors.text.faded,
		paddingHorizontal: 8,
		textAlign: 'left'
	},
	titleText: {
		...fontStyles.t_codeS,
		color: colors.text.white,
		fontWeight: 'bold'
	}
});

export default PayloadDetailsCard;
