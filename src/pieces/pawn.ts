import Square from '../square.js';
import ChessPiece, { ChessPieceColor } from './piece.js';

const offsets = {
	white: [
		[ 1,  0 ],
		[ 2,  0 ],
		[ 1, -1 ],
		[ 1,  1 ]
	],
	black: [
		[ -1,  0 ],
		[ -2,  0 ],
		[ -1, -1 ],
		[ -1,  1 ]
	],
};

export default class Pawn extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('pawn', color === 'white' ? 'p' : 'P', color);
	}

	possibleMoves(): Square[] {
		if (!this.chess || !this.square) {
			return [];
		}

		const square = this.chess.square(this.square);

		if (!square) {
			return [];
		}

		const row = square.x;
		const column = square.y;
		const offset = offsets[this.color];

		const oneSquareForward           = this.chess.square([ row + offset[0][0], column + offset[0][1] ]);
		const twoSquaresForward          = this.chess.square([ row + offset[1][0], column + offset[1][1] ]);
		const oneSquareDiagonallyToLeft  = this.chess.square([ row + offset[2][0], column + offset[2][1] ]);
		const oneSquareDiagonallyToRight = this.chess.square([ row + offset[3][0], column + offset[3][1] ]);

		const moves = [];

		if (oneSquareForward && !oneSquareForward.piece) {
			moves.push(oneSquareForward);

			if (twoSquaresForward && !twoSquaresForward.piece && this.moves === 0) {
				moves.push(twoSquaresForward);
			}
		}

		if (oneSquareDiagonallyToLeft?.hasPiece() && oneSquareDiagonallyToLeft.piece?.color !== this.color) {
			moves.push(oneSquareDiagonallyToLeft);
		}
		if (oneSquareDiagonallyToRight?.hasPiece() && oneSquareDiagonallyToRight.piece?.color !== this.color) {
			moves.push(oneSquareDiagonallyToRight);
		}

		return moves;
	}
}
