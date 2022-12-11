import sanParser from './san.js';
import fenParser from './fen.js';
import { occupied } from './utils.js';
import Square from './board/square.js';
import ChessBoard from './board/board.js';
import generateMoves, { PseudoMove } from './pieces/moves.js';
import { makeMove, undoMove, ChessMove, ChessMoveResult, ChessMoveOptions, MoveType } from './move.js';
import ChessPiece, { ChessPieceColor, ChessPieceSymbol, ChessPosition, createPiece } from './pieces/piece.js';

export const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export type Flags = {
	[key: string]: { kingsideCastling: boolean, queensideCastling: boolean },
	white: {
		kingsideCastling: boolean,
		queensideCastling: boolean
	},
	black: {
		kingsideCastling: boolean,
		queensideCastling: boolean
	}
};

export type MovesOptions = {
	square?: ChessPosition,
	san?: boolean
};

export type State = {
	move: ChessMoveResult,
	turn: ChessPieceColor
};

export type ChessHistory = State[];

export default class Chess {
	board: ChessBoard;
	turn: ChessPieceColor;
	kings: { white: ChessPiece | null, black: ChessPiece | null };
	enPassantSquare: ChessPosition | null;
	history: ChessHistory;
	flags: Flags;

	constructor(fen?: string) {
		this.board = new ChessBoard();
		this.kings = { white: null, black: null };
		this.enPassantSquare = null;
		this.history = [];
		this.turn = 'white';
		this.flags = {
			white: {
				kingsideCastling: true,
				queensideCastling: true
			},
			black: {
				kingsideCastling: true,
				queensideCastling: true
			}
		};
		this.setup(fen ?? DEFAULT_POSITION);
	}

	setup(fen: string) {
		const result = fenParser.parse(fen);

		if (!result) {
			return;
		}

		for (const [ symbol, position ] of result.pieces) {
			this._place(createPiece(symbol), position);
		}

		this.turn = result.turn;
		this.flags = result.flags;
		this.enPassantSquare = result.enPassantSquare;
	}

	place(piece: ChessPieceSymbol | ChessPiece, square: ChessPosition, offset?: number): ChessPiece {
		piece = typeof piece === 'string' ? createPiece(piece) : piece;

		this._place(piece, square, offset);

		return piece;
	}

	private _place(piece: ChessPiece, square: ChessPosition, offset?: number): boolean {
		if (!this.board.place(piece, square, offset)) {
			return false;
		}

		if (piece.type === 'k') {
			this.kings[piece.color] = piece;
		}

		return true;
	}

	takeOut(square: ChessPosition, offset?: number): ChessPiece | null {
		const squareWithPieceToRemove = offset ? this.board.at(square, offset) : this.square(square);

		if (!occupied(squareWithPieceToRemove)) {
			return null;
		}

		return this.board.remove(squareWithPieceToRemove.name);
	}

	piece(square: ChessPosition): ChessPiece | null {
		return this.square(square)?.piece || null;
	}

	square(square: ChessPosition): Square | null {
		return this.board.get(square);
	}

	move(san: string): ChessMoveResult | false;
	move(move: ChessMove): ChessMoveResult | false;
	move(moveOrSan: ChessMove | string): ChessMoveResult | false {
		const move = typeof moveOrSan === 'string' ? sanParser.parse(this, moveOrSan) : moveOrSan;

		return move ? this._move(move) : false;
	}

	private _move(move: ChessMove): ChessMoveResult | false {
		const piece = this.piece(move.from);

		if (!piece || piece.color !== this.turn) {
			return false;
		}

		const legalMove = this.moves({ square: piece.square }).find(m => m.to === move.to);

		if (legalMove) {
			const result = makeMove(this, { ...legalMove, promoteTo: move.promoteTo });
			const state = this.history.at(-1);

			if (result && state) {
				this._changeTurn();
				this._updateFlags(state);
				this._updateEnPassantSquare(state);
			}

			return result;
		}

		return false;
	}

	undo(): ChessMoveResult | null {
		const result = undoMove(this);

		if (result ) {
			this._changeTurn();

			return result;
		}

		return null;
	}

	moves(square: ChessPosition): { from: ChessPosition, to: ChessPosition, type: MoveType }[];
	moves(options?: MovesOptions & { san?: false }): { from: ChessPosition, to: ChessPosition, type: MoveType }[];
	moves(options?:  MovesOptions & { san?: true }): string[];
	moves(optionsOrSquare: ChessPosition | MovesOptions = {}): { from: ChessPosition, to: ChessPosition, type: MoveType }[] | string[] {
		if (typeof optionsOrSquare === 'string') {
			return this._moves({
				square: optionsOrSquare,
				legal: true
			});
		}

		return this._moves({ ...optionsOrSquare, legal: true });
	}

	private _moves(options: MovesOptions & { legal?: boolean } = { legal: true }): { from: ChessPosition, to: ChessPosition, type: MoveType }[] | string[] {
		const wouldNotBeInCheck = (move: PseudoMove) => {
			return !this._wouldBeInCheck({
				from: move.from,
				to: move.to,
				type: move.type
			});
		};

		let moves = [];

		moves = generateMoves(this, { square: options.square });

		if (options.legal) {
			moves = moves.filter(wouldNotBeInCheck);
		}

		if (options.san) {
			moves = moves.map(m => sanParser.encode(m, this));
		}

		return moves;
	}

	/**
	 * Indicates whether a movement can be made.
	 *
	 * If the `from` parameter is omitted, it returns whether any piece from the current turn can move.
	 * If the `to` square is omitted, it returns whether the piece on the `from` square can move at all.
	 *
	 * @returns `true` if the movement is legal; `false`, otherwise.
	 */
	canMove(options: { from?: ChessPosition, to?: ChessPosition } = {}): boolean {
		options = Object.assign({
			legal: true
		}, options);

		const moves = this.moves({ square: options.from });

		return options.to ? moves.some(move => move.to === options.to) : !!moves.length;
	}

	isCheck(): boolean {
		const king = this.kings[this.turn];

		return !!king && this.isAttacked(king);
	}

	isCheckmate() {
		return this.isCheck() && !this.moves().length;
	}

	isStalemate() {
		return !this.isCheck() && !this.moves().length;
	}

	isGameOver() {
		return this.isCheckmate() || this.isStalemate();
	}

	isDraw() {
		return this.isStalemate();
	}

	isAttacked(piece: ChessPiece): boolean {
		const enemyMoves = generateMoves(this, {
			color: piece.color === 'white' ? 'black' : 'white'
		});

		return enemyMoves.some(move => move.to === piece.square);
	}

	clear() {
		this.board.clear();
		this.history = [];
		this.turn = 'white';
		this.kings = { white: null, black: null };
		this.enPassantSquare = null;
	}

	reset() {
		this.clear();
		this.setup(DEFAULT_POSITION);
	}

	fen() {
		return fenParser.encode(this);
	}

	private _changeTurn() {
		this.turn = this.turn === 'white' ? 'black' : 'white';
		return this.turn;
	}

	private _wouldBeInCheck(move: ChessMoveOptions) {
		const result = makeMove(this, move);

		if (!result) {
			return false;
		}

		if (this.isCheck()) {
			undoMove(this);
			return true;
		}

		undoMove(this);
		return false;
	}

	private _updateFlags(state: State) {
		if (state.move.type === MoveType.KINGSIDE_CASTLE) {
			this.flags[state.turn].kingsideCastling = false;
			return;
		}

		if (state.move.type === MoveType.QUEENSIDE_CASTLE) {
			this.flags[state.turn].queensideCastling = false;
		}
	}

	private _updateEnPassantSquare(state: State) {
		if (state.move.type !== MoveType.BIG_PAWN) {
			this.enPassantSquare = null;
			return;
		}

		const offset = state.turn === 'white' ? 10 : -10;
		this.enPassantSquare = this.board.at(state.move.to, offset)?.name || null;
	}
}
