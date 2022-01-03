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

import type { Call, ExtrinsicEra } from '@polkadot/types/interfaces';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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

interface FormatedCall {
	args?: ArgInfo[];
	method: string;
}

interface ArgInfo {
	argName: string;
	argValue: string | string[];
}

const ExtrinsicPart = ({ label, networkKey, value }: ExtrinsicPartProps): React.ReactElement => {
	const [period, setPeriod] = useState<string>();
	const [phase, setPhase] = useState<string>();
	const [formattedCallArgs, setFormattedCallArgs] = useState<FormatedCall[]>();
	const [tip, setTip] = useState<string>();
	const [useFallback, setUseFallBack] = useState(false);
	const { getTypeRegistry } = useContext(RegistriesContext);
	const { setAlert } = useContext(AlertContext);
	const { getSubstrateNetwork } = useContext(NetworksContext);
	const network = getSubstrateNetwork(networkKey);
	const { color: networkColor } = network || {}
	const typeRegistry = useMemo(() => getTypeRegistry(networkKey)!, [getTypeRegistry, networkKey]);

	const formatArgs = useCallback((callInstance: Call): ArgInfo[] => {
		const paramArgKvArray: ArgInfo[] = [];
		const { args, meta } = callInstance;

		for (let i = 0; i < meta.args.length; i++) {
			let argument: string;

			if (args[i].toRawType().startsWith('AccountId')) {
				argument =  args[i].toString()
			} else if (args[i].toRawType().startsWith('Vec<Call>')) {
				argument = JSON.stringify(args[i].toHuman(false))
			} else if (args[i].toRawType().startsWith('Vec')) {
				// toString is nicer than toHuman here because
				// toHuman tends to concatenate long strings and would hide data
				argument = (args[i] as any).map((v: any) => v.toString());
			} else {
				// toHuman takes care of the balance formating
				// with the right chain unit
				argument = JSON.stringify(args[i].toHuman());
			}

			const argName = meta.args[i].name.toHuman();

			paramArgKvArray.push({ argName, argValue: argument } as ArgInfo);
		}

		return paramArgKvArray
	}, [])

	useEffect(() => {
		if (useFallback) {
			return
		}

		if (label === 'Method') {
			try {
				const call = typeRegistry.createType('Call', value);
				const sectionMethod = `${call.section}.${call.method}`;

				const formated: FormatedCall[] = []

				const firstArg = call.args[0]

				// that's a batch
				if (firstArg?.toRawType().startsWith('Vec<Call>')){
					formated.push({ args: undefined, method: sectionMethod });

					(firstArg as unknown as Call[]).forEach((c: Call) => {
						typeRegistry.createType('Call', c)
						formated.push({ args: formatArgs(c), method: `${c.section}.${c.method}` })
					})
				} else {
					formated.push({ args: formatArgs(call as unknown as Call), method: sectionMethod })
				}

				setFormattedCallArgs(formated);
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
	}, [formatArgs, label, setAlert, typeRegistry, useFallback, value]);

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

	const renderMethodDetails = (): React.ReactNode => {
		if (formattedCallArgs) {
			// const formattedCall = Object.entries(formattedCallArgs);

			// HACK: if there's a sudo method just put it to the front.
			// A better way would be to order by depth but currently this is
			// only relevant for a single extrinsic, so seems like overkill.
			// for (let i = 1; i < formattedCallArgs.length; i++) {
			// 	const argument = formattedCall[i].

			// 	if (argument.includes('sudo')) {
			// 		const tmp = formattedCall[i];

			// 		formattedCall.splice(i, 1);
			// 		formattedCall.unshift(tmp);
			// 		break;
			// 	}
			// }

			return formattedCallArgs.map(({ args, method }, index) => {
				// const sectionMethod = entry[0];
				// const argList = entry[1];

				return (
					<View
						key={index}
						style={styles.callDetails}
					>
						<Text style={styles.secondaryText}>
							Call <Text style={styles.titleText}>{method}{'  '}</Text>
							{args && !!args.length && (
								<Text>
									with the following arguments:
								</Text>
							)}
						</Text>
						{args && !!args.length && (
							args.map(({ argName, argValue }, index) => (
								<View
									key={index}
									style={styles.callArguments}
								>
									<Text style={styles.titleText}>
										{argName}:{' '}
										{argValue && argValue instanceof Array
											? argValue.join(', ')
											: argValue}{' '}
									</Text>
								</View>
							))
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
	callArguments: {
		marginLeft: 16
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
