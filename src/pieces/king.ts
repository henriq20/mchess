import Square from '../square.js';
import ChessPiece, { ChessPieceColor } from './piece.js';

const offsets = [
	[  1,  0 ], // One square forward
	[  1,  1 ], // One square forward and diagonally to the right
	[  1, -1 ], // One square forward and diagonally to the left
	[  0, -1 ], // One square to the left
	[  0,  1 ], // One square to the right
	[ -1,  0 ], // One square backward
	[ -1,  1 ], // One square backward and diagonally to the right
	[ -1, -1 ]  // One square backward and diagonally to the left
];

export default class King extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('king', color === 'white' ? 'K' : 'k', color);
	}

	possibleMoves(): Square[] {
		if (!this.chess || !this.square) {
			return [];
		}

		const square = this.chess.square(this.square);

		if (!square) {
			return [];
		}

		const [ row, column ] = square.position;
		const moves = [];

		for (const offset of offsets) {
			const square = this.chess.board.get(row + offset[0], column + offset[1]);

			if (square && (!square.piece || square.piece.color !== this.color)) {
				moves.push(square);
			}
		}

		return moves;
	}
}
