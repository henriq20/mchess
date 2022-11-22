import Square from './square.js';
import ChessPiece from './pieces/piece.js';
import { toChessPosition } from './position.js';

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

export default class ChessBoard {
	readonly size: number;
	_board: Square[][];

	constructor() {
		this.size = 8;
		this._board = this.fill();
	}

	fill() {
		this._board = [];

		let row = 0;
		while (row < 8) {
			this._board.push(new Array(this.size).fill(undefined).map((value, column) => {
				return new Square(toChessPosition(row, column), [ row, column ]);
			}));

			row++;
		}

		return this._board;
	}

	place(row: number, column: number, piece: ChessPiece): boolean {
		if (this._isOffBounds(row, column)) {
			return false;
		}

		this._board[row][column].piece = piece;

		return true;
	}

	get(row: number, column: number): Square | null {
		if (this._isOffBounds(row, column)) {
			return null;
		}

		return this._board[row][column];
	}

	remove(row: number, column: number): ChessPiece | null {
		if (this._isOffBounds(row, column)) {
			return null;
		}

		const removedPiece = this._board[row][column].piece;

		if (!removedPiece) {
			return null;
		}

		this._board[row][column].piece = null;

		return removedPiece;
	}

	clear(): ChessPiece[] {
		const pieces = [];

		for (let row = 0; row < this.size; row++) {
			for (let column = 0; column < this.size; column++) {
				const removedPiece = this.remove(row, column);
				if (removedPiece) {
					pieces.push(removedPiece);
				}
			}
		}

		return pieces;
	}

	traverse(from: Square, directions: Direction[], fn: (square: Square) => boolean) {
		for (const direction of directions) {
			this._traverse(from, direction, fn);
		}
	}

	_traverse(from: Square, direction: Direction, fn: (square: Square) => boolean) {
		const [ x, y ] = TRAVERSAL_OFFSETS[direction];
		let [ row, column ] = from.position;

		while (!this._isOffBounds(row += x, column += y)) {
			const square = this.get(row, column);

			if (!square || fn(square)) {
				break;
			}
		}
	}

	_isOffBounds(row: number, column: number): boolean {
		return row < 0 || row > 7 || column < 0 || column > 7;
	}
}
