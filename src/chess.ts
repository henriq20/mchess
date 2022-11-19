import Square from './square';
import ChessBoard from './board';
import King from './pieces/king';
import createPiece from './factory';
import ChessPiece from './pieces/piece';
import { toArrayPosition } from './position';
import { ChessPieceLetter } from './factory';
import { ArrayPosition, ChessPosition } from './position';
import makeMove, { ChessMove, ChessMoveResult } from './move';

export type SetupFn = (place: (pieceName: ChessPieceLetter, position: ChessPosition | ArrayPosition) => ChessPiece | null) => void;

export default class Chess {
	board: ChessBoard;
	white: Map<ChessPosition, ChessPiece>;
	black: Map<ChessPosition, ChessPiece>;
	whiteKing?: King;
	blackKing?: King;
	history: ChessMoveResult[];

	constructor(setupFn?: SetupFn) {
		this.board = new ChessBoard();
		this.white = new Map();
		this.black = new Map();
		this.history = [];
		this.setup(setupFn);
	}

	setup(fn?: SetupFn) {
		if (typeof fn === 'function') {
			return fn(this.place.bind(this));
		}

		// Place pawns
		for (let column = 0; column < this.board.size; column++) {
			this.place('p', [ 1, column ]);
			this.place('P', [ 6, column ]);
		}

		this.place('r', [ 0, 0 ]);
		this.place('n', [ 0, 1 ]);
		this.place('b', [ 0, 2 ]);
		this.place('q', [ 0, 3 ]);
		this.place('k', [ 0, 4 ]);
		this.place('b', [ 0, 5 ]);
		this.place('n', [ 0, 6 ]);
		this.place('r', [ 0, 7 ]);

		this.place('R', [ 7, 0 ]);
		this.place('N', [ 7, 1 ]);
		this.place('B', [ 7, 2 ]);
		this.place('Q', [ 7, 3 ]);
		this.place('K', [ 7, 4 ]);
		this.place('B', [ 7, 5 ]);
		this.place('N', [ 7, 6 ]);
		this.place('R', [ 7, 7 ]);
	}

	place(pieceName: ChessPieceLetter, position: ChessPosition | ArrayPosition): ChessPiece | null {
		const piece = createPiece(pieceName);
		const [ row, column ] = typeof position === 'string' ? toArrayPosition(position) : position;

		const result = this.board.place(row, column, piece);

		if (result) {
			piece.square = this.board.get(row, column)?.name;
			piece.chess = this;

			this[piece.color].set(piece.square as ChessPosition, piece);

			if (piece instanceof King) {
				if (piece.color === 'white') {
					this.whiteKing = piece;
					return piece;
				}

				this.blackKing = piece;
			}

			return piece;
		}

		return null;
	}

	takeOut(position: ChessPosition | ArrayPosition): ChessPiece | null {
		const square = this.square(position);

		if (!square || !square.hasPiece()) {
			return null;
		}

		const piece = this.board.remove(square.x, square.y);

		if (!piece) {
			return null;
		}

		this[piece.color].delete(square.name);

		return piece;
	}

	piece(position: ChessPosition | ArrayPosition): ChessPiece | null {
		return this.square(position)?.piece || null;
	}

	square(position: ChessPosition | ArrayPosition): Square | null {
		const [ row, column ] = typeof position === 'string' ? toArrayPosition(position) : position;
		return this.board.get(row, column);
	}

	move(move: ChessMove): ChessMoveResult | false {
		const result = makeMove(this, move);

		if (result) {
			this.history.push(result);
		}

		return result;
	}

	isCheck(): boolean {
		const isWhiteMoving = this.history.at(-1)?.piece.color === 'black' || true;
		const pieces = isWhiteMoving ? this.white : this.black;
		const king = isWhiteMoving ? this.blackKing : this.whiteKing;

		for (const [ _, piece ] of pieces) {
			if (piece instanceof King) {
				continue;
			}

			if (piece.possibleMoves().some(square => square.name === king?.square)) {
				return true;
			}
		}

		return false;
	}
}
