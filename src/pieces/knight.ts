import ChessPiece, { ChessPieceColor } from './piece.js';
import { ChessPosition, toArrayPosition } from '../position.js';

const offsets = [
	[  2, -1 ], // Two squares forward and one to the left
	[  1, -2 ], // One square forward and two to the left

	[  2,  1 ], // Two squares forward and one to the right
	[  1,  2 ], // One square forward and two to the right

	[ -2, -1 ], // Two squares backward and one to the left
	[ -1, -2 ], // One square backward and two to the left

	[ -2,  1 ], // Two squares backward and one to the right
	[ -1,  2 ]  // One square backward and two to the right
];

export default class Knight extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('knight', color === 'white' ? 'N' : 'n', color);
	}

	possibleMoves(): ChessPosition[] {
		if (!this.board || !this.square) {
			return [];
		}

		const square = this.board.get(...toArrayPosition(this.square));

		if (!square) {
			return [];
		}

		const [ row, column ] = square.position;
		const moves: ChessPosition[] = [];

		for (const offset of offsets) {
			const square = this.board.get(row + offset[0], column + offset[1]);

			if (square && (!square.piece || square.piece.color !== this.color)) {
				moves.push(square.name);
			}
		}

		return moves;
	}
}
