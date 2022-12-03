import Square from './board/square.js';
import ChessBoard from './board/board.js';
import generateMoves from './pieces/moves.js';
import { decode, encode, Flags } from './fen.js';
import makeMove, { ChessMove, ChessMoveResult, ChessMoveOptions, MoveType } from './move.js';
import ChessPiece, { ChessPieceColor, ChessPieceSymbol, ChessPosition, createPiece } from './pieces/piece.js';

const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

type CanMoveOptions = ChessPosition | {
	to?: ChessPosition,
	illegal?: boolean
};

export default class Chess {
	board: ChessBoard;
	turn: ChessPieceColor;
	white: Map<ChessPosition, ChessPiece>;
	black: Map<ChessPosition, ChessPiece>;
	whiteKing: ChessPiece | null;
	blackKing: ChessPiece | null;
	history: ChessMove[];
	flags: Flags;
	private _fen: string;

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
		const result = decode(fen);

		for (const [ symbol, position ] of result.pieces) {
			this._place(createPiece(symbol), position);
		}

		this.turn = result.turn;
		this.flags = result.flags;
	}

	place(piece: ChessPieceSymbol | ChessPiece, position: ChessPosition, offset?: number): ChessPiece {
		piece = typeof piece === 'string' ? createPiece(piece) : piece;

		this._place(piece, position, offset);

		return piece;
	}

	private _place(piece: ChessPiece, square: ChessPosition, offset?: number): boolean {
		const s = this.board.place(piece, square, offset);

		if (!s) {
			return false;
		}

		this[piece.color].set(s.name, piece);

		if (piece.type === 'k') {
			if (piece.color === 'white') {
				this.whiteKing = piece;
				return true;
			}

			this.blackKing = piece;
		}

		return true;
	}

	takeOut(position: ChessPosition, offset?: number): ChessPiece | null {
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

	move(options: { from: ChessPosition, to: ChessPosition }, promoteTo?: 'q' | 'n' | 'b' | 'r'): ChessMoveResult | false {
		const movingPiece = this.piece(options.from);

		if (!movingPiece || movingPiece.color !== this.turn) {
			return false;
		}

		const legalMove = this.moves(options.from).find(m => m.to === options.to);

		if (!legalMove) {
			return false;
		}

		const move = makeMove(this, { ...options, type: legalMove.type, promoteTo });

		if (move.result.type !== MoveType.INVALID) {
			this._changeTurn();
			this._updateFlags(move.result);
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

		return !!king && this.isAttacked(king);
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

	isAttacked(piece: ChessPiece): boolean {
		const enemyMoves = generateMoves(this, {
			color: piece.color === 'white' ? 'black' : 'white'
		});

		return enemyMoves.some(move => move.to === piece.square);
	}

	moves(squareOrPiece?: ChessPosition | ChessPiece): { from: ChessPosition, to: ChessPosition, type: MoveType }[] {
		const wouldNotBeInCheck = ({ from, to, type }: { from: ChessPosition, to: ChessPosition, type: MoveType }) => {
			return !this._wouldBeInCheck({
				from,
				to,
				type
			});
		};

		if (squareOrPiece) {
			const square = typeof squareOrPiece !== 'string' ? squareOrPiece.square : squareOrPiece;

			return generateMoves(this, { square }).filter(wouldNotBeInCheck);
		}

		return generateMoves(this).filter(wouldNotBeInCheck);
	}

	moved(piece: ChessPiece | ChessPosition) {
		piece = typeof piece !== 'string' ? piece.square : piece;
		return this.history.some(m => m.result.piece?.square === piece);
	}

	canMove(from: ChessPosition | ChessPiece, options: CanMoveOptions): boolean {
		const piece = typeof from === 'string' ? this.piece(from) : from;
		const to = typeof options === 'string' ? options : options.to;
		const illegal = typeof options === 'string' ? false : options.illegal;

		if (!piece) {
			return false;
		}

		const moves = illegal ? generateMoves(this, { square: piece.square }) : this.moves(piece);

		return to ? moves.some(m => m.to === to) : !!moves.length;
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
			result.undo();
			return true;
		}

		result.undo();
		return false;
	}

	private _updateFlags(moveResult: ChessMoveResult) {
		if (moveResult.piece && moveResult.type === MoveType.KINGSIDE_CASTLE) {
			this.flags[moveResult.piece.color].kingsideCastling = false;
			return;
		}

		if (moveResult.piece && moveResult.type === MoveType.QUEENSIDE_CASTLE) {
			this.flags[moveResult.piece.color].queensideCastling = false;
		}
	}
}
