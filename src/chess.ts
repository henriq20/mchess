import fenParser from './fen.js';
import sanParser from './san.js';
import Square from './board/square.js';
import ChessBoard from './board/board.js';
import generateMoves from './pieces/moves.js';
import makeMove, { ChessMove, ChessMoveResult, ChessMoveOptions, MoveType } from './move.js';
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

type CanMoveOptions = ChessPosition | {
	to?: ChessPosition,
	illegal?: boolean
};

export default class Chess {
	board: ChessBoard;
	turn: ChessPieceColor;
	kings: { white: ChessPiece | null, black: ChessPiece | null };
	history: ChessMove[];
	flags: Flags;

	constructor(fen?: string) {
		this.board = new ChessBoard();
		this.kings = { white: null, black: null };
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

		if (piece.type === 'k') {
			this.kings[piece.color] = piece;
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

		return piece;
	}

	piece(position: ChessPosition): ChessPiece | null {
		return this.square(position)?.piece || null;
	}

	square(position: ChessPosition): Square | null {
		return this.board.get(position);
	}

	move(san: string, promoteTo?: 'q' | 'n' | 'b' | 'r'): ChessMoveResult | false;
	move(options: { from: ChessPosition, to: ChessPosition }, promoteTo?: 'q' | 'n' | 'b' | 'r'): ChessMoveResult | false;
	move(options: { from: ChessPosition, to: ChessPosition } | string, promoteTo?: 'q' | 'n' | 'b' | 'r'): ChessMoveResult | false {
		let from: ChessPosition, to: ChessPosition;

		if (typeof options === 'string') {
			const move = sanParser.parse(this, options);

			if (!move) {
				return false;
			}

			from = move.from;
			to = move.to;
		} else {
			from = options.from;
			to = options.to;
		}

		const movingPiece = this.piece(from);

		if (!movingPiece || movingPiece.color !== this.turn) {
			return false;
		}

		const legalMove = this.moves(from).find(m => m.to === to);

		if (!legalMove) {
			return false;
		}

		const move = makeMove(this, { from, to, type: legalMove.type, promoteTo });

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

	isCheck(): boolean {
		const king = this.kings[this.turn];

		return !!king && this.isAttacked(king);
	}

	isCheckmate() {
		const king = this.kings[this.turn];

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
		this.kings = { white: null, black: null };
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
