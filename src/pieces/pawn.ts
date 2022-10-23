import Square from '../square';
import ChessPiece, { ChessPieceColor } from './piece';

export default class Pawn extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('pawn', color === 'white' ? 'p' : 'P', color);
	}

	possibleMoves(): Square[] {
		if (!this.board || !this.square) {
			return [];
		}

		const moves = [];
		const b = this.board;
		const row = this.square.x;
		const column = this.square.y;

		const squares = {
			oneSquareForward: b.get(row + 1, column),
			twoSquaresForward: b.get(row + 2, column),
			diagonalLeft: b.get(row + 1, column - 1),
			diagonalRight: b.get(row + 1, column + 1)
		};

		if (squares.oneSquareForward && !squares.oneSquareForward.piece) {
			moves.push(squares.oneSquareForward);

			if (squares.twoSquaresForward && !squares.twoSquaresForward.piece && this.moves === 0) {
				moves.push(squares.twoSquaresForward);
			}
		}

		if (squares.diagonalLeft && squares.diagonalLeft.piece && squares.diagonalLeft.piece.color !== this.color) {
			moves.push(squares.diagonalLeft);
		}

		if (squares.diagonalRight && squares.diagonalRight.piece && squares.diagonalRight.piece.color !== this.color) {
			moves.push(squares.diagonalRight);
		}

		return moves;
	}
}
