import Chess from '../chess.js';
import Square from '../board/square.js';
import { ChessPosition } from '../board/position.js';
import ChessPiece, { ChessPieceColor } from './piece.js';

export default class Rook extends ChessPiece {
	constructor(color: ChessPieceColor, square?: ChessPosition) {
		super('r', color, square);
	}

	possibleMoves(chess: Chess): ChessPosition[] {
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
