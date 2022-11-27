import Chess from '../chess.js';
import Square from '../board/square.js';
import ChessPiece, { ChessPieceColor } from './piece.js';
import { Coordinate, ChessPosition } from '../board/position.js';

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
		super('k', color, square);
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

		if (!this.hasMoved(chess)) {
			const kingsideCastleSquare = chess.board.at(this.square, [ 0, 2 ]);
			const queensideCastleSquare = chess.board.at(this.square, [ 0, -2 ]);

			if (kingsideCastleSquare && this._canKingsideCastle(chess, kingsideCastleSquare)) {
				moves.push(kingsideCastleSquare.name);
			}

			if (queensideCastleSquare && this._canQueensideCastle(chess, queensideCastleSquare)) {
				moves.push(queensideCastleSquare.name);
			}
		}

		return moves;
	}

	_canKingsideCastle(chess: Chess, to: Square) {
		const rook = chess.board.at(this.square, [ 0, 3 ])?.piece;

		return rook &&
			rook.type === 'r' &&
			rook.color === this.color &&
			to.empty &&
			chess.board.at(this.square, [ 0, 1 ])?.empty;
	}

	_canQueensideCastle(chess: Chess, to: Square) {
		const rook = chess.board.at(this.square, [ 0, -4 ])?.piece;

		return rook &&
			rook.type === 'r' &&
			rook.color === this.color &&
			to.empty &&
			chess.board.at(this.square, [ 0, -1 ])?.empty &&
			chess.board.at(this.square, [ 0, -3 ])?.empty;
	}
}
