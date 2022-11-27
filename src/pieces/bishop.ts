import Square from '../board/square.js';
import { Direction } from '../board/board';
import ChessPiece, { ChessPieceColor } from './piece.js';
import { ChessPosition } from '../board/position';
import Chess from '../chess.js';

export default class Bishop extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('b', color);
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

		const directions: Direction[] = [
			'topLeft',
			'topRight',
			'bottomLeft',
			'bottomRight'
		];

		chess.board.traverse(square, directions, validate.bind(this));

		return moves;
	}
}
