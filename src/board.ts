import Square from './square.js';

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
}
