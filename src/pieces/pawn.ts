import Chess from '../chess.js';
import Square from '../board/square.js';
import ChessPiece, { ChessPieceColor } from './piece.js';
import { ArrayPosition, ChessPosition, toArrayPosition } from '../board/position.js';

const offsets: { [ key: string ]: ArrayPosition[] } = {
	white: [
		[ 1, 0 ],
		[ 2, 0 ],
		[ 1, -1 ],
		[ 1, 1 ],
		[ 0, -1 ],
		[ 0, 1 ]
	],
	black: [
		[ -1, 0 ],
		[ -2, 0 ],
		[ -1, -1 ],
		[ -1, 1 ],
		[ 0, -1 ],
		[ 0, 1 ]
	],
};

export default class Pawn extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('p', color);
	}

	possibleMoves(chess: Chess): ChessPosition[] {
		if (!this.board || !this.square) {
			return [];
		}

		const position = toArrayPosition(this.square);
		const square = this.board.get(...position);

		if (!square) {
			return [];
		}

		const offset = offsets[this.color];

		const oneSquareForward = this.board.at(position, offset[0]);
		const twoSquaresForward = this.board.at(position, offset[1]);
		const oneSquareDiagonallyToLeft = this.board.at(position, offset[2]);
		const oneSquareDiagonallyToRight = this.board.at(position, offset[3]);
		const leftSquare = this.board.at(position, offset[4]);
		const rightSquare = this.board.at(position, offset[5]);

		const isQuiet = (square: Square | null) => {
			return square && square.empty;
		};

		const isCapture = (square: Square | null) => {
			return square && (!square.empty && square.piece?.color !== this.color);
		};

		const isEnPassant = (square: Square | null) => {
			const lastMove = chess.history.at(-1);

			return lastMove &&
				   lastMove.result.piece?.type === 'p' &&
				   lastMove.result.piece.color !== this.color &&
				   square?.piece === lastMove.result.piece;
		};

		const moves: ChessPosition[] = [];

		if (isQuiet(oneSquareForward)) {
			moves.push((oneSquareForward as Square).name);

			if (isQuiet(twoSquaresForward) && this._canMoveTwoSquares(position)) {
				moves.push((twoSquaresForward as Square).name);
			}
		}

		if (isCapture(oneSquareDiagonallyToLeft) || isEnPassant(leftSquare)) {
			moves.push((oneSquareDiagonallyToLeft as Square).name);
		}
		if (isCapture(oneSquareDiagonallyToRight) || isEnPassant(rightSquare)) {
			moves.push((oneSquareDiagonallyToRight as Square).name);
		}

		return moves;
	}

	_canMoveTwoSquares(position: ArrayPosition) {
		return (this.color === 'white' && position[0] === 1) || (this.color === 'black' && position[0] === 6);
	}
}
