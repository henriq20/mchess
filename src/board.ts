import Square from './square.js';
import { ChessPiece } from './pieces/piece.js';

export default class ChessBoard {
	readonly size: number;
	_board: Square[][];

	constructor() {
		this.size = 8;
		this._board = this.clear();
	}

	clear() {
		this._board = [];

		for (let row = 0; row < this.size; row++) {
			const rank = String.fromCharCode('a'.charCodeAt(0) + row);
			this._board[row] = [];

			for (let column = 0; column < this.size; column++) {
				this._board[row].push(new Square(rank + (column + 1).toString(), row, column));
			}
		}

		return this._board;
	}

	place(row: number, column: number, piece: ChessPiece): boolean {
		if (this._isOffBounds(row, column)) {
			return false;
		}

		piece.board = this;
		piece.square = this._board[row][column];

		this._board[row][column].piece = piece;

		return true;
	}

	get(row: number, column: number): Square | null {
		if (this._isOffBounds(row, column)) {
			return null;
		}

		return this._board[row][column];
	}

	_isOffBounds(row: number, column: number): boolean {
		return row < 0 || row > 7 || column < 0 || column > 7;
	}
}
