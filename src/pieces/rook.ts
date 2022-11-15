import Square from '../square';
import ChessPiece, { ChessPieceColor } from './piece';

export default class Rook extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('rook', color === 'white' ? 'r' : 'R', color);
	}

	possibleMoves(): Square[] {
		if (!this.board || !this.square) {
			return [];
		}

		const moves = [];
		const row = this.square.x;
		const column = this.square.y;

		// Horizontal right
		for (let i = column + 1; i < this.board.size; i++) {
			const square = this.board.get(row, i);

			if (!square) {
				break;
			}

			if (!square.hasPiece()) {
				moves.push(square);
				continue;
			}

			if (this.isEnemy(square)) {
				moves.push(square);
				break;
			}

			break;
		}

		// Horizontal left
		for (let i = column - 1; i >= 0; i--) {
			const square = this.board.get(row, i);

			if (!square) {
				break;
			}

			if (!square.hasPiece()) {
				moves.push(square);
				continue;
			}

			if (this.isEnemy(square)) {
				moves.push(square);
				break;
			}

			break;
		}

		// Vertical up
		for (let i = row + 1; i < this.board.size; i++) {
			const square = this.board.get(i, column);

			if (!square) {
				break;
			}

			if (!square.hasPiece()) {
				moves.push(square);
				continue;
			}

			if (this.isEnemy(square)) {
				moves.push(square);
				break;
			}

			break;
		}

		// Vertical down
		for (let i = row - 1; i >= 0; i--) {
			const square = this.board.get(i, column);

			if (!square) {
				break;
			}

			if (!square.hasPiece()) {
				moves.push(square);
				continue;
			}

			if (this.isEnemy(square)) {
				moves.push(square);
				break;
			}

			break;
		}

		return moves;
	}
}
