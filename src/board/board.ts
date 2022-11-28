import Square from './square.js';
import ChessPiece from '../pieces/piece.js';
import { Coordinate, ChessPosition, toChessPosition } from './position.js';

export type Direction = 'left'
	| 'right'
	| 'top'
	| 'bottom'
	| 'topLeft'
	| 'topRight'
	| 'bottomLeft'
	| 'bottomRight';

const TRAVERSAL_OFFSETS = {
	top: [ 1, 0 ],
	bottom: [ -1, 0 ],
	left: [ 0, -1 ],
	right: [ 0, 1 ],
	topLeft: [ 1, -1 ],
	topRight: [ 1, 1 ],
	bottomLeft: [ -1, -1 ],
	bottomRight: [ -1, 1 ]
};

const SQUARE_MAP: { [key in ChessPosition]: Coordinate } = {
	a8: [ 7, 0 ], b8: [ 7, 1 ], c8: [ 7, 2 ], d8: [ 7, 3 ], e8: [ 7, 4 ], f8: [ 7, 5 ], g8: [ 7, 6 ], h8: [ 7, 7 ],
	a7: [ 6, 0 ], b7: [ 6, 1 ], c7: [ 6, 2 ], d7: [ 6, 3 ], e7: [ 6, 4 ], f7: [ 6, 5 ], g7: [ 6, 6 ], h7: [ 6, 7 ],
	a6: [ 5, 0 ], b6: [ 5, 1 ], c6: [ 5, 2 ], d6: [ 5, 3 ], e6: [ 5, 4 ], f6: [ 5, 5 ], g6: [ 5, 6 ], h6: [ 5, 7 ],
	a5: [ 4, 0 ], b5: [ 4, 1 ], c5: [ 4, 2 ], d5: [ 4, 3 ], e5: [ 4, 4 ], f5: [ 4, 5 ], g5: [ 4, 6 ], h5: [ 4, 7 ],
	a4: [ 3, 0 ], b4: [ 3, 1 ], c4: [ 3, 2 ], d4: [ 3, 3 ], e4: [ 3, 4 ], f4: [ 3, 5 ], g4: [ 3, 6 ], h4: [ 3, 7 ],
	a3: [ 2, 0 ], b3: [ 2, 1 ], c3: [ 2, 2 ], d3: [ 2, 3 ], e3: [ 2, 4 ], f3: [ 2, 5 ], g3: [ 2, 6 ], h3: [ 2, 7 ],
	a2: [ 1, 0 ], b2: [ 1, 1 ], c2: [ 1, 2 ], d2: [ 1, 3 ], e2: [ 1, 4 ], f2: [ 1, 5 ], g2: [ 1, 6 ], h2: [ 1, 7 ],
	a1: [ 0, 0 ], b1: [ 0, 1 ], c1: [ 0, 2 ], d1: [ 0, 3 ], e1: [ 0, 4 ], f1: [ 0, 5 ], g1: [ 0, 6 ], h1: [ 0, 7 ],
	'-': [ -1, -1 ]
};

export default class ChessBoard {
	readonly size: number;
	_board: Square[][];

	constructor() {
		this.size = 8;
		this._board = this.fill();
	}

	static coord(square: ChessPosition): Coordinate {
		return SQUARE_MAP[square];
	}

	fill() {
		this._board = [];

		let row = 0;
		while (row < 8) {
			this._board.push(new Array(this.size).fill(undefined).map((value, column) => {
				return new Square(toChessPosition(row, column));
			}));

			row++;
		}

		return this._board;
	}

	place(square: ChessPosition, piece: ChessPiece): Square | false {
		const position = SQUARE_MAP[square];

		if (!position || this._isOffBounds(position[0], position[1])) {
			return false;
		}

		const s = this._board[position[0]][position[1]];
		s.piece = piece;
		piece.square = s.name;

		return s;
	}

	get(square: ChessPosition): Square | null {
		const coord = SQUARE_MAP[square];
		return coord && this._get(coord[0], coord[1]) || null;
	}

	_get(row: number, column: number): Square | null {
		if (this._isOffBounds(row, column)) {
			return null;
		}

		return this._board[row][column];
	}

	at(from: ChessPosition, offset: Coordinate): Square | null {
		const coord = SQUARE_MAP[from];
		return this._get(coord[0] + offset[0], coord[1] + offset[1]);
	}

	remove(square: ChessPosition): ChessPiece | null {
		const position = SQUARE_MAP[square];

		if (!position) {
			return null;
		}

		const [ row, column ] = position;

		if (!position || this._isOffBounds(row, column)) {
			return null;
		}

		const removedPiece = this._board[row][column].piece;

		if (!removedPiece) {
			return null;
		}

		this._board[row][column].piece = null;

		return removedPiece;
	}

	clear() {
		this._board = this.fill();
	}

	traverse(from: Square, directions: Direction[], fn: (square: Square) => boolean) {
		for (const direction of directions) {
			this._traverse(from, direction, fn);
		}
	}

	_traverse(from: Square, direction: Direction, fn: (square: Square) => boolean) {
		const [ x, y ] = TRAVERSAL_OFFSETS[direction];
		let [ row, column ] = SQUARE_MAP[from.name];

		while (!this._isOffBounds(row += x, column += y)) {
			const square = this._board[row][column];

			if (fn(square)) {
				break;
			}
		}
	}

	_isOffBounds(row: number, column: number): boolean {
		return row < 0 || row > 7 || column < 0 || column > 7;
	}
}
