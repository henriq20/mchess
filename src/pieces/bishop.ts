import Square from '../square.js';
import { Direction } from '../board';
import { ChessPosition } from '../position';
import ChessPiece, { ChessPieceColor } from './piece.js';

export default class Bishop extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('bishop', color === 'white' ? 'B' : 'b', color);
	}

	possibleMoves(): ChessPosition[] {
		if (!this.chess || !this.square) {
			return [];
		}

		const square = this.chess.square(this.square);

		if (!square) {
			return [];
		}

		const moves: ChessPosition[] = [];

		const validate = (square: Square) => {
			if (square.empty) {

				moves.push(square.name);
				return false;
			}

			if (square.piece?.color !== this.color) {
				moves.push(square.name);
				return true;
			}

			return true;
		};

		const directions: Direction[] = [
			'topLeft',
			'topRight',
			'bottomLeft',
			'bottomRight'
		];

		this.chess.board.traverse(square, directions, validate.bind(this));

		return moves;
	}
}
