import { ChessPosition, toArrayPosition } from '../board/position.js';
import Chess from '../chess.js';
import ChessPiece, { ChessPieceColor } from './piece.js';

const offsets = [
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
	constructor(color: ChessPieceColor) {
		super('k', color);
	}

	possibleMoves(chess: Chess): ChessPosition[] {
		if (!this.board || !this.square) {
			return [];
		}

		const square = this.board.get(...toArrayPosition(this.square));

		if (!square) {
			return [];
		}

		const [ row, column ] = square.position;
		const moves: ChessPosition[] = [];

		for (const offset of offsets) {
			const square = this.board.get(row + offset[0], column + offset[1]);

			if (square && (!square.piece || square.piece.color !== this.color)) {
				moves.push(square.name);
			}
		}

		if (!this.hasMoved(chess)) {
			const castleSquare = this.board.at(square.position, [ 0, 2 ]);
			const rookSquare = this.board.at(square.position, [ 0, 3 ]);

			if (castleSquare && rookSquare?.piece?.type === 'r' && rookSquare.piece.color === this.color) {
				if (this.board.at(square.position, [ 0, 1 ])?.empty && castleSquare.empty) {
					moves.push(castleSquare.name);
				}
			}
		}

		return moves;
	}
}
