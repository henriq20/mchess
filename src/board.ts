import Square from './square.js';
import ChessPiece from './pieces/piece.js';
import { toChessPosition } from './position.js';

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

	remove(row: number, column: number): ChessPiece | null {
		if (this._isOffBounds(row, column)) {
			return null;
		}

		const removedPiece = this._board[row][column].piece;

		if (!removedPiece) {
			return null;
		}

		removedPiece.board = null;
		removedPiece.square = null;
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

	_isOffBounds(row: number, column: number): boolean {
		return row < 0 || row > 7 || column < 0 || column > 7;
	}
}
