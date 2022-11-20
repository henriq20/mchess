import Square from './square.js';
import ChessBoard from './board.js';
import King from './pieces/king.js';
import createPiece from './factory.js';
import { toArrayPosition } from './position.js';
import { ChessPieceLetter } from './factory.js';
import { ArrayPosition, ChessPosition } from './position.js';
import ChessPiece, { ChessPieceColor } from './pieces/piece.js';
import makeMove, { ChessMove, ChessMoveResult } from './move.js';

export type SetupFn = (place: (pieceName: ChessPieceLetter, position: ChessPosition | ArrayPosition) => ChessPiece | null) => void;

export default class Chess {
	board: ChessBoard;
	turn: ChessPieceColor;
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
		this.turn = 'white';
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

	place(piece: ChessPieceLetter | ChessPiece, position: ChessPosition | ArrayPosition): ChessPiece | null {
		piece = typeof piece === 'string' ? createPiece(piece) : piece;
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
		const movingPiece = this.piece(move.from);

		if (!movingPiece || !movingPiece.canMove(this.square(move.to) as Square)) {
			return false;
		}

		const result = makeMove(this, move);

		if (result) {
			this.history.push(result);
			this._changeTurn();
		}

		return result;
	}

	undo(): ChessMoveResult | null {
		const move = this.history.pop();

		if (move) {
			move.undo();
			this._changeTurn();
			return move;
		}

		return null;
	}

	enemies(): Map<ChessPosition, ChessPiece> {
		if (!this.history.length) {
			return this.black;
		}

		return this.history.at(-1)?.piece.color === 'black' ? this.black : this.white;
	}

	isCheck(): boolean {
		if (this.turn === 'white') {
			return !!this.whiteKing && this._isKingAttacked(this.whiteKing);
		}

		return !!this.blackKing && this._isKingAttacked(this.blackKing);
	}

	moves(square?: ChessPosition): ChessPosition[] {
		if (square) {
			const piece = this.square(square)?.piece;

			return !piece ? [] : piece.possibleMoves().map(s => s.name).filter(s => !piece.wouldBeInCheck(s));
		}

		const pieces = [ ...this[this.turn].values() ];

		const moves = pieces.map(piece => {
			return piece.possibleMoves().map(s => s.name).filter(s => !piece.wouldBeInCheck(s));
		}).flat();

		return moves;
	}

	_changeTurn() {
		this.turn = this.turn === 'white' ? 'black' : 'white';
		return this.turn;
	}

	_isKingAttacked(king: King): boolean {
		const enemies = this[king.color === 'white' ? 'black' : 'white'];

		for (const [ _, enemy ] of enemies) {
			if (enemy instanceof King) {
				continue;
			}

			if (enemy.possibleMoves().some(s => s.piece === king)) {
				return true;
			}
		}

		return false;
	}
}
