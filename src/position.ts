export function toChessPosition(x: number, y: number) {
	const rank = x + 1;
	const file = String.fromCharCode('a'.charCodeAt(0) + y);

	return file + rank;
}

export function toArrayPosition(chessPosition: string): [ x: number, y: number ] {
	const rank = Number(chessPosition[1]);
	const file = chessPosition[0];

	return [ rank - 1, file.charCodeAt(0) - 'a'.charCodeAt(0) ];
}
