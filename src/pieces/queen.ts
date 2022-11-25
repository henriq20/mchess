import Square from '../board/square.js';
import { Direction } from '../board/board';
import ChessPiece, { ChessPieceColor } from './piece.js';
import { ChessPosition, toArrayPosition } from '../board/position.js';

export default class Queen extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('q', color);
	}

	possibleMoves(): ChessPosition[] {
		if (!this.board || !this.square) {
			return [];
		}

		const square = this.board.get(...toArrayPosition(this.square));

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
			'bottomLeft',
			'bottomRight',
			'topLeft',
			'topRight',
			'top',
			'left',
			'bottom',
			'right'
		];

		this.board.traverse(square, directions, validate.bind(this));

		return moves;
	}
}
