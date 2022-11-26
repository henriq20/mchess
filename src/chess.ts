import parseFEN from './fen.js';
import King from './pieces/king.js';
import Square from './board/square.js';
import createPiece from './factory.js';
import ChessBoard from './board/board.js';
import { toArrayPosition } from './board/position.js';
import { ArrayPosition, ChessPosition } from './board/position.js';
import ChessPiece, { ChessPieceColor, ChessPieceSymbol } from './pieces/piece.js';
import makeMove, { ChessMove, ChessMoveResult, ChessMoveOptions } from './move.js';

const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

type CanMoveOptions = ChessPosition | { to?: ChessPosition, illegal?: boolean };

export default class Chess {
	board: ChessBoard;
	turn: ChessPieceColor;
	white: Map<ChessPosition, ChessPiece>;
	black: Map<ChessPosition, ChessPiece>;
	whiteKing?: King;
	blackKing?: King;
	history: ChessMove[];

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

		for (const [ symbol, position ] of result.pieces) {
			this._place(createPiece(symbol), position);
		}

		this.turn = result.turn;
	}

	place(piece: ChessPieceSymbol | ChessPiece, position: ChessPosition): ChessPiece {
		piece = typeof piece === 'string' ? createPiece(piece) : piece;

		this._place(piece, toArrayPosition(position));

		return piece;
	}

	_place(piece: ChessPiece, position: ArrayPosition) {
		const square = this.board.place(...position, piece);

		if (!square) {
			return false;
		}

		this[piece.color].set(square.name, piece);

		if (piece.type === 'k') {
			if (piece.color === 'white') {
				this.whiteKing = piece;
				return true;
			}

			this.blackKing = piece;
		}

		return true;
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

		if (!king?.square) {
			return false;
		}

		return this.isCheck() && !this.moves(king.square).length;
	}

	isStalemate() {
		const king = this.turn === 'white' ? this.whiteKing : this.blackKing;

		if (!king?.square) {
			return false;
		}

		return !this.isCheck() && !this.moves().length;
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
