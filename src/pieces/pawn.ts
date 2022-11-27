import Chess from '../chess.js';
import Square from '../board/square.js';
import ChessPiece, { ChessPieceColor } from './piece.js';
import { Coordinate, ChessPosition } from '../board/position.js';

const offsets: { [key: string]: Coordinate[] } = {
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
	constructor(color: ChessPieceColor, square?: ChessPosition) {
		super('p', color, square || '-');
	}

	possibleMoves(chess: Chess): ChessPosition[] {
		if (!this.square) {
			return [];
		}

		const square = chess.board.get(this.square);

		if (!square) {
			return [];
		}

		const offset = offsets[this.color];

		const oneSquareForward = chess.board.at(this.square, offset[0]);
		const twoSquaresForward = chess.board.at(this.square, offset[1]);
		const oneSquareDiagonallyToLeft = chess.board.at(this.square, offset[2]);
		const oneSquareDiagonallyToRight = chess.board.at(this.square, offset[3]);
		const leftSquare = chess.board.at(this.square, offset[4]);
		const rightSquare = chess.board.at(this.square, offset[5]);

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

			if (isQuiet(twoSquaresForward) && this._canMoveTwoSquares()) {
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

	_canMoveTwoSquares() {
		return this.square &&
			((this.color === 'white' && this.square[1] === '2') ||
				(this.color === 'black' && this.square[1] === '7'));
	}
}
