export function pad(str: string, char: string, maxLength: number): string {
	return str.padStart(str.length + Math.floor((maxLength - str.length) / 2), char)
		.padEnd(maxLength, char);
}
