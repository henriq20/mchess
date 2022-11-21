import { Direction } from '../board';
import Square from '../square.js';
import ChessPiece, { ChessPieceColor } from './piece.js';

export default class Bishop extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('bishop', color === 'white' ? 'B' : 'b', color);
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
			if (!square.hasPiece()) {
				moves.push(square);
				return false;
			}

			if (square.piece?.color !== this.color) {
				moves.push(square);
				return true;
			}

			return true;
		};

		const directions: Direction[] = [
			'diagonalBottomLeft',
			'diagonalBottomRight',
			'diagonalTopLeft',
			'diagonalTopRight'
		];

		this.chess.board.traverse(square, directions, validate.bind(this));

		return moves;
	}
}
