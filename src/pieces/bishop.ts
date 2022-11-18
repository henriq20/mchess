import { Direction } from '../board';
import Square from '../square';
import ChessPiece, { ChessPieceColor } from './piece';

export default class Bishop extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('bishop', color === 'white' ? 'b' : 'B', color);
	}

	possibleMoves(): Square[] {
		if (!this.board || !this.square) {
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

		this.board.traverse(this.square, directions, validate.bind(this));

		return moves;
	}
}
