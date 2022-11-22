import Square from '../square.js';
import { ChessPosition, toArrayPosition } from '../position.js';
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
		super('pawn', color === 'white' ? 'P' : 'p', color);
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
		const offset = offsets[this.color];

		const oneSquareForward           = this.board.get(row + offset[0][0], column + offset[0][1]);
		const twoSquaresForward          = this.board.get(row + offset[1][0], column + offset[1][1]);
		const oneSquareDiagonallyToLeft  = this.board.get(row + offset[2][0], column + offset[2][1]);
		const oneSquareDiagonallyToRight = this.board.get(row + offset[3][0], column + offset[3][1]);

		const isQuiet = (square: Square | null) => {
			return square && square.empty;
		};

		const isCapture = (square: Square | null) => {
			return square && (!square.empty && square.piece?.color !== this.color);
		};

		const moves: ChessPosition[] = [];

		if (isQuiet(oneSquareForward)) {
			moves.push((oneSquareForward as Square).name);

			if (isQuiet(twoSquaresForward) && this.moves === 0) {
				moves.push((twoSquaresForward as Square).name);
			}
		}

		if (isCapture(oneSquareDiagonallyToLeft)) {
			moves.push((oneSquareDiagonallyToLeft as Square).name);
		}
		if (isCapture(oneSquareDiagonallyToRight)) {
			moves.push((oneSquareDiagonallyToRight as Square).name);
		}

		return moves;
	}
}
