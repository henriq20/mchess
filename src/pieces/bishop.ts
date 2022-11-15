import Square from '../square';
import ChessPiece, { ChessPieceColor } from './piece';

export default class Bishop extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('bishop', color === 'white' ? 'b' : 'B', color);
	}

	possibleMoves(): Square[] {
		if (!this.board || !this.square) {
			return [];
		}

		const moves = [];
		const currentRow = this.square.x;
		const currentColumn = this.square.y;

		// Diagonal left up
		for (let row = currentRow + 1; row < this.board.size; row++) {
			const square = this.board.get(row, currentColumn - (row - currentColumn));

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

		// Diagonal right up
		for (let row = currentRow + 1; row < this.board.size; row++) {
			const square = this.board.get(row, currentColumn + (row - currentColumn));

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

		// Diagonal bottom left
		for (let row = currentRow - 1; row >= 0; row--) {
			const square = this.board.get(row, currentColumn - (row - currentColumn));

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

		// Diagonal bottom right
		for (let row = currentRow - 1; row >= 0; row--) {
			const square = this.board.get(row, currentColumn + (row - currentColumn));

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
