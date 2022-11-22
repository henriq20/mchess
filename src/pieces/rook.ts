import Square from '../square.js';
import ChessPiece, { ChessPieceColor } from './piece.js';

export default class Rook extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('rook', color === 'white' ? 'R' : 'r', color);
	}

	possibleMoves(): Square[] {
		if (!this.chess || !this.square) {
			return [];
		}

		const square = this.chess.square(this.square);

		if (!square) {
			return [];
		}

		const moves: Square[] = [];

		const validate = (square: Square) => {
			if (square.empty) {
				moves.push(square);
				return false;
			}

			if (square.piece?.color !== this.color) {
				moves.push(square);
				return true;
			}

			return true;
		};

		this.chess.board.traverse(square, [ 'top', 'left', 'bottom', 'right' ], validate.bind(this));

		return moves;
	}
}
