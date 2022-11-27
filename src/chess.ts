import { decode, encode, Flags } from './fen.js';
import King from './pieces/king.js';
import Square from './board/square.js';
import createPiece from './factory.js';
import ChessBoard from './board/board.js';
import { Coordinate, ChessPosition } from './board/position.js';
import ChessPiece, { ChessPieceColor, ChessPieceSymbol } from './pieces/piece.js';
import makeMove, { ChessMove, ChessMoveResult, ChessMoveOptions } from './move.js';

const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

type CanMoveOptions = ChessPosition | { to?: ChessPosition, illegal?: boolean };

export default class Chess {
	board: ChessBoard;
	turn: ChessPieceColor;
	white: Map<ChessPosition, ChessPiece>;
	black: Map<ChessPosition, ChessPiece>;
	whiteKing: King | null;
	blackKing: King | null;
	history: ChessMove[];
	flags: Flags;
	_fen: string;

	constructor(fen?: string) {
		this.board = new ChessBoard();
		this.white = new Map();
		this.black = new Map();
		this.whiteKing = null;
		this.blackKing = null;
		this.history = [];
		this.turn = 'white';
		this._fen = fen ?? DEFAULT_POSITION;
		this.flags = {
			WHITE_KINGSIDE_CASTLING: true,
			WHITE_QUEENSIDE_CASTLING: true,
			BLACK_KINGSIDE_CASTLING: true,
			BLACK_QUEENSIDE_CASTLING: true
		};
		this.setup(fen ?? DEFAULT_POSITION);
	}

	setup(fen: string) {
		const result = decode(fen);

		for (const [ symbol, position ] of result.pieces) {
			this._place(createPiece(symbol), position);
		}

		this.turn = result.turn;
		this.flags = result.flags;
	}

	place(piece: ChessPieceSymbol | ChessPiece, position: ChessPosition): ChessPiece {
		piece = typeof piece === 'string' ? createPiece(piece) : piece;

		this._place(piece, position);

		return piece;
	}

	_place(piece: ChessPiece, square: ChessPosition) {
		const s = this.board.place(square, piece);

		if (!s) {
			return false;
		}

		this[piece.color].set(s.name, piece);

		if (piece.type === 'k') {
			if (piece.color === 'white') {
				this.whiteKing = piece as King;
				return true;
			}

			this.blackKing = piece as King;
		}

		return true;
	}

	takeOut(position: ChessPosition, offset?: Coordinate): ChessPiece | null {
		const square = offset ? this.board.at(position, offset) : this.square(position);

		if (!square || square.empty) {
			return null;
		}

		const piece = this.board.remove(square.name);

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
		return this.board.get(position);
	}

	move(options: ChessMoveOptions): ChessMoveResult | false {
		const movingPiece = this.piece(options.from);

		if (!movingPiece || movingPiece.color !== this.turn || !this.canMove(movingPiece, options.to)) {
			return false;
		}

		const move = makeMove(this, options);

		if (move) {
			this._changeTurn();
		}

		return move.result;
	}

	undo(): ChessMoveResult | null {
		const move = this.history.pop();

		if (move) {
			move.undo();
			this._changeTurn();
			return move.result;
		}

		return null;
	}

	enemies(): Map<ChessPosition, ChessPiece> {
		return this.turn === 'white' ? this.black : this.white;
	}

	isCheck(): boolean {
		const king = this.turn === 'white' ? this.whiteKing : this.blackKing;

		return !!king && this._isKingAttacked(king);
	}

	isCheckmate() {
		const king = this.turn === 'white' ? this.whiteKing : this.blackKing;

		if (!king) {
			return false;
		}

		return this.isCheck() && !this.moves(king.square).length;
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

	moves(squareOrPiece?: ChessPosition | ChessPiece): ChessPosition[] {
		const wouldNotBeInCheck = (from: ChessPosition) => (to: ChessPosition) => {
			return !this._wouldBeInCheck({
				from,
				to
			});
		};

		if (squareOrPiece) {
			const piece = typeof squareOrPiece === 'string' ? this.square(squareOrPiece)?.piece : squareOrPiece;

			return !piece ? [] : piece.possibleMoves(this).filter(wouldNotBeInCheck(piece.square as ChessPosition));
		}

		const pieces = [ ...this[this.turn].values() ];

		const moves = pieces.map(piece => {
			return piece.possibleMoves(this).filter(wouldNotBeInCheck(piece.square as ChessPosition));
		}).flat();

		return moves;
	}

	canMove(from: ChessPosition | ChessPiece, options: CanMoveOptions): boolean {
		const piece = typeof from === 'string' ? this.piece(from) : from;
		const to = typeof options === 'string' ? options : options.to;
		const illegal = typeof options === 'string' ? false : options.illegal;

		if (!piece) {
			return false;
		}

		const moves = illegal ? piece.possibleMoves(this) : this.moves(piece);

		return to ? moves.includes(to) : !!moves.length;
	}

	clear() {
		this.board.clear();
		this.history = [];
		this.turn = 'white';
		this.whiteKing = null;
		this.blackKing = null;
		this.white = new Map();
		this.black = new Map();
	}

	reset() {
		this.clear();
		this.setup(this._fen);
	}

	fen() {
		return encode(this);
	}

	_changeTurn() {
		this.turn = this.turn === 'white' ? 'black' : 'white';
		return this.turn;
	}

	_isKingAttacked(king: King): boolean {
		if (!king.square) {
			return false;
		}

		const enemies = this[king.color === 'white' ? 'black' : 'white'].values();

		for (const enemy of enemies) {
			if (this.canMove(enemy, { to: king.square, illegal: true })) {
				return true;
			}
		}

		return false;
	}

	_wouldBeInCheck(move: ChessMoveOptions) {
		const result = makeMove(this, move);

		if (!result) {
			return false;
		}

		if (this.isCheck()) {
			result.undo();
			return true;
		}

		result.undo();
		return false;
	}
}
