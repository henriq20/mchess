import Chess from '../chess.js';
import ChessPiece, { ChessPieceColor } from './piece.js';
import { Coordinate, ChessPosition } from '../board/position.js';
import Square from '../board/square.js';

const offsets: Array<Coordinate> = [
	[ 1, 0 ], // One square forward
	[ 1, 1 ], // One square forward and diagonally to the right
	[ 1, -1 ], // One square forward and diagonally to the left
	[ 0, -1 ], // One square to the left
	[ 0, 1 ], // One square to the right
	[ -1, 0 ], // One square backward
	[ -1, 1 ], // One square backward and diagonally to the right
	[ -1, -1 ]  // One square backward and diagonally to the left
];

export default class King extends ChessPiece {
	constructor(color: ChessPieceColor, square?: ChessPosition) {
		super('k', color, square || '-');
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

		for (const offset of offsets) {
			const square = chess.board.at(this.square, offset);

			if (square && (!square.piece || square.piece.color !== this.color)) {
				moves.push(square.name);
			}
		}

		if (!this.hasMoved(chess)) {
			const castleSquare = chess.board.at(this.square, [ 0, 2 ]);
			const rookSquare = chess.board.at(this.square, [ 0, 3 ]);

			if (castleSquare && rookSquare?.piece?.type === 'r' && rookSquare.piece.color === this.color) {
				if (chess.board.at(this.square, [ 0, 1 ])?.empty && castleSquare.empty) {
					moves.push(castleSquare.name);
				}
			}
		}

		return moves;
	}
}
