import Square from '../board/square.js';
import ChessPiece, { ChessPieceColor } from './piece.js';
import { ChessPosition, toArrayPosition } from '../board/position.js';

export default class Rook extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('rook', color === 'white' ? 'R' : 'r', color);
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

		this.board.traverse(square, ['top', 'left', 'bottom', 'right'], validate.bind(this));

		return moves;
	}
}
