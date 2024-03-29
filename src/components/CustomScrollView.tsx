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

import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import React from 'react';
import { Animated, LayoutChangeEvent, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import colors from 'styles/colors';

export default class CustomScrollView extends React.PureComponent<
	{
		contentContainerStyle: ViewStyle;
	},
	{
		indicator: Animated.AnimatedValue;
		visible: boolean;
		visibleHeight: number;
		wholeHeight: number;
	}
> {
	state = {
		indicator: new Animated.Value(0),
		visible: false,
		visibleHeight: 0,
		wholeHeight: 1
	};

	render(): React.ReactElement {
		const indicatorSize =
			this.state.wholeHeight > this.state.visibleHeight
				? (this.state.visibleHeight * this.state.visibleHeight) /
				  this.state.wholeHeight
				: this.state.visibleHeight;

		const difference =
			this.state.visibleHeight > indicatorSize
				? this.state.visibleHeight - indicatorSize
				: 1;

		return (
			<SafeAreaViewContainer>
				<ScrollView
					bounces={false}
					onContentSizeChange={(width: number, height: number): void => {
						this.setState({ wholeHeight: height });
					}}
					onLayout={({ nativeEvent: { layout: { height } } }: LayoutChangeEvent): void =>
						this.setState({ visibleHeight: height })
					}
					onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.indicator } } }],
						{ useNativeDriver: false })}
					scrollEventThrottle={16}
					showsVerticalScrollIndicator={false}
					{...this.props}
				>
					{this.props.children}
				</ScrollView>
				<Animated.View
					style={[
						styles.indicator,
						{
							height: indicatorSize,
							transform: [
								{
									translateY: Animated.multiply(this.state.indicator,
										this.state.visibleHeight / this.state.wholeHeight).interpolate({
										extrapolate: 'clamp',
										inputRange: [0, difference],
										outputRange: [0, difference]
									})
								}
							]
						}
					]}
				/>
			</SafeAreaViewContainer>
		);
	}
}

const styles = StyleSheet.create({
	indicator: {
		backgroundColor: colors.text.main,
		borderRadius: 5,
		position: 'absolute',
		right: 0,
		width: 5
	}
});
