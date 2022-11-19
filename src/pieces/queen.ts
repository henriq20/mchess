import Square from '../square';
import { Direction } from '../board';
import ChessPiece, { ChessPieceColor } from './piece';

export default class Queen extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('queen', color === 'white' ? 'q' : 'Q', color);
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
			'diagonalTopRight',
			'top',
			'left',
			'bottom',
			'right'
		];

		this.chess.board.traverse(square, directions, validate.bind(this));

		return moves;
	}
}
