import Square from '../square';
import ChessPiece, { ChessPieceColor } from './piece';

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
		if (!this.board || !this.square) {
			return [];
		}

		const row = this.square.x;
		const column = this.square.y;
		const offset = offsets[this.color];

		const oneSquareForward           = this.board.get(row + offset[0][0], column + offset[0][1]);
		const twoSquaresForward          = this.board.get(row + offset[1][0], column + offset[1][1]);
		const oneSquareDiagonallyToLeft  = this.board.get(row + offset[2][0], column + offset[2][1]);
		const oneSquareDiagonallyToRight = this.board.get(row + offset[3][0], column + offset[3][1]);

		const moves = [];

		if (oneSquareForward && !oneSquareForward.piece) {
			moves.push(oneSquareForward);

			if (twoSquaresForward && !twoSquaresForward.piece && this.moves === 0) {
				moves.push(twoSquaresForward);
			}
		}

		if (oneSquareDiagonallyToLeft && oneSquareDiagonallyToLeft.piece?.color !== this.color) {
			moves.push(oneSquareDiagonallyToLeft);
		}
		if (oneSquareDiagonallyToRight && oneSquareDiagonallyToRight.piece?.color !== this.color) {
			moves.push(oneSquareDiagonallyToRight);
		}

		return moves;
	}
}
