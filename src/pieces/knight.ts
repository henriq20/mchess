import Chess from '../chess.js';
import ChessPiece, { ChessPieceColor } from './piece.js';
import { Coordinate, ChessPosition } from '../board/position.js';

const offsets: Array<Coordinate> = [
	[ 2, -1 ], // Two squares forward and one to the left
	[ 1, -2 ], // One square forward and two to the left

	[ 2, 1 ], // Two squares forward and one to the right
	[ 1, 2 ], // One square forward and two to the right

	[ -2, -1 ], // Two squares backward and one to the left
	[ -1, -2 ], // One square backward and two to the left

	[ -2, 1 ], // Two squares backward and one to the right
	[ -1, 2 ]  // One square backward and two to the right
];

export default class Knight extends ChessPiece {
	constructor(color: ChessPieceColor, square?: ChessPosition) {
		super('n', color, square || '-');
	}

	possibleMoves(chess: Chess): ChessPosition[] {
		const square = chess.board.get(this.square);

		if (!square) {
			return [];
		}

		const moves: ChessPosition[] = [];

		for (const offset of offsets) {
			const square = chess.board.at(this.square, offset);

			if (square && (!square.piece || square.piece.color !== this.color)) {
				moves.push(square.name);
			}
		}

		return moves;
	}
}
