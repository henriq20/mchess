import { ArrayPosition } from './board/position';
import { ChessPieceColor, ChessPieceLetter } from './pieces/piece';

export type FENResult = {
	pieces: Array<[ChessPieceLetter, ArrayPosition]>
	turn: ChessPieceColor
};

export default function parseFEN(fen: string): FENResult {
	const [placement, turn] = fen.split(/\s+/);

	const pieces: Array<[ChessPieceLetter, ArrayPosition]> = [];

	let i = -1, row = 7, column = 0;
	while (++i < placement.length) {
		const char = placement.charAt(i);

		if (char === '/') {
			row--;
			column = 0;
			continue;
		}
		if (isDigit(char)) {
			column += Number(char);
			continue;
		}

		pieces.push([char as ChessPieceLetter, [row, column++]]);
	}

	return {
		pieces,
		turn: turn === 'b' ? 'black' : 'white'
	};
}

function isDigit(char = '') {
	return /^[1-9]$/.test(char);
}
