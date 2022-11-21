import Square from './square.js';
import ChessPiece from './pieces/piece.js';
import { toChessPosition } from './position.js';

export type Direction = 'left'
	| 'right'
	| 'top'
	| 'bottom'
	| 'diagonalBottomLeft'
	| 'diagonalBottomRight'
	| 'diagonalTopLeft'
	| 'diagonalTopRight';

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
				return new Square(toChessPosition(row, column), row, column);
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

	traverse(from: Square, directions: Direction[], callback: (square: Square) => boolean) {
		for (const direction of directions) {
			this._traverse(from, direction, callback);
		}
	}

	_traverse(from: Square, direction: Direction, fn: (square: Square) => boolean) {
		const row = from.x, column = from.y;

		switch (direction) {
		case 'top':
		case 'bottom':
		case 'left':
		case 'right': {
			const directions = {
				left: column,
				bottom: row,
				top: this.size - row,
				right: this.size - column
			};

			const isColumnDirection = direction === 'left' || direction === 'right';
			const invertDirection = [ 'left', 'bottom' ].includes(direction) ? -1 : 1;

			for (let i = 1; i <= directions[direction]; i++) {
				const currentColumn = !isColumnDirection ? column : column + i * invertDirection;
				const currentRow = isColumnDirection ? row : row + i * invertDirection;

				const square = this.get(currentRow, currentColumn);

				if (!square || fn(square)) {
					break;
				}
			}
			break;
		}

		case 'diagonalTopLeft':
		case 'diagonalTopRight':
		case 'diagonalBottomRight':
		case 'diagonalBottomLeft': {
			const directions = {
				diagonalTopLeft: column,
				diagonalBottomLeft: column,
				diagonalTopRight: this.size - column,
				diagonalBottomRight: this.size - column
			};

			const rowDirection = direction === 'diagonalTopRight' || direction === 'diagonalTopLeft' ? 1 : -1;
			const columnDirection = direction === 'diagonalTopRight' || direction === 'diagonalBottomRight' ? 1 : -1;

			for (let i = 1; i <= directions[direction]; i++) {
				const currentRow = row + i * rowDirection;
				const currentColumn = column + i * columnDirection;

				const square = this.get(currentRow, currentColumn);

				if (!square || fn(square)) {
					break;
				}
			}
			break;
		}

		default:
			break;
		}
	}

	_isOffBounds(row: number, column: number): boolean {
		return row < 0 || row > 7 || column < 0 || column > 7;
	}
}
