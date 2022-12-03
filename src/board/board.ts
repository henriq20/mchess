import Square from './square.js';
import ChessPiece, { ChessPosition } from '../pieces/piece.js';

export const SQUARE_MAP: { [key in ChessPosition]: number } = {
	a8: 0,  b8: 1,  c8: 2,  d8: 3,  e8: 4,  f8: 5,  g8: 6,  h8: 7,
	a7: 8,  b7: 9,  c7: 10, d7: 11, e7: 12, f7: 13, g7: 14, h7: 15,
	a6: 16, b6: 17, c6: 18, d6: 19, e6: 20, f6: 21, g6: 22, h6: 23,
	a5: 24, b5: 25, c5: 26, d5: 27, e5: 28, f5: 29, g5: 30, h5: 31,
	a4: 32, b4: 33, c4: 34, d4: 35, e4: 36, f4: 37, g4: 38, h4: 39,
	a3: 40, b3: 41, c3: 42, d3: 43, e3: 44, f3: 45, g3: 46, h3: 47,
	a2: 48, b2: 49, c2: 50, d2: 51, e2: 52, f2: 53, g2: 54, h2: 55,
	a1: 56, b1: 57, c1: 58, d1: 59, e1: 60, f1: 61, g1: 62, h1: 63,
	'-': -1
};

export const CHESS_POSITIONS = Object.keys(SQUARE_MAP).slice(0, -1) as ChessPosition[];

export const MAILBOX = [
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1,  0,  1,  2,  3,  4,  5,  6,  7, -1,
	-1,  8,  9, 10, 11, 12, 13, 14, 15, -1,
	-1, 16, 17, 18, 19, 20, 21, 22, 23, -1,
	-1, 24, 25, 26, 27, 28, 29, 30, 31, -1,
	-1, 32, 33, 34, 35, 36, 37, 38, 39, -1,
	-1, 40, 41, 42, 43, 44, 45, 46, 47, -1,
	-1, 48, 49, 50, 51, 52, 53, 54, 55, -1,
	-1, 56, 57, 58, 59, 60, 61, 62, 63, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1
];

export const MAILBOX64 = [
	21, 22, 23, 24, 25, 26, 27, 28,
	31, 32, 33, 34, 35, 36, 37, 38,
	41, 42, 43, 44, 45, 46, 47, 48,
	51, 52, 53, 54, 55, 56, 57, 58,
	61, 62, 63, 64, 65, 66, 67, 68,
	71, 72, 73, 74, 75, 76, 77, 78,
	81, 82, 83, 84, 85, 86, 87, 88,
	91, 92, 93, 94, 95, 96, 97, 98
];

export default class ChessBoard {
	_board: Square[];

	constructor() {
		this._board = this.fill();
	}

	fill() {
		this._board = [];

		for (let i = 0; i < 64; i++) {
			this._board.push(new Square(CHESS_POSITIONS[i]));
		}

		return this._board;
	}

	place(piece: ChessPiece, square: ChessPosition, offset?: number): Square | false {
		let position = SQUARE_MAP[square];

		if (offset) {
			position += offset;
		}

		if (isNaN(position)) {
			return false;
		}

		const s = this._board[position];
		s.piece = piece;
		piece.square = s.name;

		return s;
	}

	get(square: ChessPosition): Square | null {
		return this._board[SQUARE_MAP[square]] || null;
	}

	at(from: ChessPosition, offset: number): Square | null {
		const squareIndex = SQUARE_MAP[from];
		const index = MAILBOX[MAILBOX64[squareIndex] + offset];

		return index === -1 ? null : this._board[index];
	}

	remove(square: ChessPosition): ChessPiece | null {
		const position = SQUARE_MAP[square];

		if (isNaN(position)) {
			return null;
		}

		const removedPiece = this.get(square)?.piece;

		if (!removedPiece) {
			return null;
		}

		this._board[SQUARE_MAP[square]].piece = null;

		return removedPiece;
	}

	clear() {
		this._board = this.fill();
	}
}
