export type ChessPosition = string;
export type ArrayPosition = [ x: number, y: number ];

export function toChessPosition(x: number, y: number) {
	const rank = x + 1;
	const file = String.fromCharCode('a'.charCodeAt(0) + y);

	return file + rank;
}

export function toArrayPosition(position: ChessPosition): [ x: number, y: number ] {
	const rank = Number(position[1]);
	const file = position[0];

	return [ rank - 1, file.charCodeAt(0) - 'a'.charCodeAt(0) ];
}
