import Chess from '../chess.js';
import Square from '../board/square.js';
import { Direction } from '../board/board';
import { ChessPosition } from '../board/position.js';
import ChessPiece, { ChessPieceColor } from './piece.js';

export default class Queen extends ChessPiece {
	constructor(color: ChessPieceColor, square?: ChessPosition) {
		super('q', color, square || '-');
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

		chess.board.traverse(square, directions, validate.bind(this));

		return moves;
	}
}
