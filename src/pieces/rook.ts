import Square from '../board/square.js';
import ChessPiece, { ChessPieceColor } from './piece.js';
import { ChessPosition } from '../board/position.js';
import Chess from '../chess.js';

export default class Rook extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('r', color);
	}

	possibleMoves(chess: Chess): ChessPosition[] {
		if (!this.square) {
			return [];
		}

		const square = chess.board.get(this.square);

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

		chess.board.traverse(square, [ 'top', 'left', 'bottom', 'right' ], validate.bind(this));

		return moves;
	}
}
