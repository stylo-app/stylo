import React from 'react';
import { View } from 'react-native';

// from https://medium.com/@agungsurya/view-with-fading-background-in-react-native-ae37dcf6ddd3

const divisor = 10;
const step = 1/divisor;

interface Props {
    color: string,
    height: number,
    direction: 'up' | 'side',
    children?: any,
    style: Record<any, any>
}

function hexToRgb(hex: string) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

	hex = hex.replace(shorthandRegex, function (m, r, g, b) {
		return r + r + g + g + b + b;
	});

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	return result ? {
		b: parseInt(result[3], 16),
		g: parseInt(result[2], 16),
		r: parseInt(result[1], 16)
	} : null;
}

const Faded = ({ children, color, direction, height, style }: Props) => {
	let i;
	let r = 0, g = 0, b = 0;
	const collection = [];
	let pixelsStyle: Record<string, string|number> = {
		flexDirection: 'column',
		height: height,
		position: 'absolute',
		width: '100%'
	}

	if (direction === 'up') {
		pixelsStyle = {
			...pixelsStyle, bottom: 0
		}
		collection.push(0);
		i = step;

		while (i < 1) {
			collection.push(i);
			i += step;
		}

		collection.push(1);
	} else {
		pixelsStyle = {
			...pixelsStyle, top: 0
		}
		collection.push(1);
		i = 1.00;

		while (i > 0) {
			collection.push(i);
			i -= step;
		}

		collection.push(0);
	}

	const rgb = hexToRgb(color);

	if (rgb) {
		r = rgb.r;
		g = rgb.g;
		b = rgb.b;
	}

	return (
		<View style={[{ flexDirection: 'column' }, style]}>
			<View style={pixelsStyle}>
				{collection.map((o, key) =>
					<View key={key}
						style={{
							backgroundColor: `rgba(${r}, ${g}, ${b}, ${o})`,
							height: (height / divisor)
						}} />)}
			</View>
			{children}
		</View>
	);
}

export default Faded