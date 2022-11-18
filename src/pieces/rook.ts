import Square from '../square';
import ChessPiece, { ChessPieceColor } from './piece';

export default class Rook extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('rook', color === 'white' ? 'r' : 'R', color);
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

		this.board.traverse(this.square, [ 'top', 'left', 'bottom', 'right' ], validate.bind(this));

		return moves;
	}
}
