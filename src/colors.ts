const colors = {
	reset: '\u001b[0m',
	black: '\u001b[30m',
	red: '\u001b[31m',
	green: '\u001b[32m',
	yellow: '\u001b[33m',
	blue: '\u001b[34m',
	magenta: '\u001b[35m',
	cyan: '\u001b[36m',
	white: '\u001b[37m',
	gray: '\u001b[38;5;250m',
	darkGray: '\u001b[38;5;238m',
};

export type Color = 'reset' | 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray' | 'darkGray';

function colorize(input: string, color: string) {
	if (process.env.NO_COLOR && !process.env.FORCE_COLOR) {
		return input;
	}

	return `${ color }${ input }${ colors.reset }`;
}

export default {
	reset: (input: string) => colorize(input, colors.reset),
	black: (input: string) => colorize(input, colors.reset),
	red: (input: string) => colorize(input, colors.red),
	green: (input: string) => colorize(input, colors.green),
	yellow: (input: string) => colorize(input, colors.yellow),
	blue: (input: string) => colorize(input, colors.blue),
	magenta: (input: string) => colorize(input, colors.magenta),
	cyan: (input: string) => colorize(input, colors.cyan),
	white: (input: string) => colorize(input, colors.white),
	gray: (input: string) => colorize(input, colors.gray),
	darkGray: (input: string) => colorize(input, colors.darkGray)
};
