import parseFEN from './fen.js';
import Square from './square.js';
import ChessBoard from './board.js';
import King from './pieces/king.js';
import createPiece from './factory.js';
import { toArrayPosition } from './position.js';
import { ArrayPosition, ChessPosition } from './position.js';
import ChessPiece, { ChessPieceColor, ChessPieceLetter } from './pieces/piece.js';
import makeMove, { ChessMove, ChessMoveResult } from './move.js';

const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default class Chess {
	board: ChessBoard;
	turn: ChessPieceColor;
	white: Map<ChessPosition, ChessPiece>;
	black: Map<ChessPosition, ChessPiece>;
	whiteKing?: King;
	blackKing?: King;
	history: ChessMoveResult[];

	constructor(fen?: string) {
		this.board = new ChessBoard();
		this.white = new Map();
		this.black = new Map();
		this.history = [];
		this.turn = 'white';
		this.setup(fen ?? DEFAULT_POSITION);
	}

	setup(fen: string) {
		const result = parseFEN(fen);

		for (const [ letter, position ] of result.pieces) {
			this.place(letter, position);
		}

		this.turn = result.turn;
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

	takeOut(position: ChessPosition): ChessPiece | null {
		const square = this.square(position);

		if (!square || square.empty) {
			return null;
		}

		const piece = this.board.remove(...toArrayPosition(square.name));

		if (!piece) {
			return null;
		}

		this[piece.color].delete(square.name);

		return piece;
	}

	piece(position: ChessPosition): ChessPiece | null {
		return this.white.get(position) ?? this.black.get(position) ?? null;
	}

	square(position: ChessPosition): Square | null {
		return this.board.get(...toArrayPosition(position));
	}

	move(move: ChessMove): ChessMoveResult | false {
		const movingPiece = this.piece(move.from);

		if (!movingPiece || !movingPiece.canMove(move.to)) {
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
		const king = this.turn === 'white' ? this.whiteKing : this.blackKing;

		return !!king && this._isKingAttacked(king);
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
