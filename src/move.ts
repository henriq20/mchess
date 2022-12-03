import Chess from './chess.js';
import ChessPiece, { ChessPieceSymbol, ChessPosition, createPiece } from './pieces/piece.js';

export type ChessMoveOptions = {
	type: MoveType,
	from: ChessPosition,
	to: ChessPosition,
	promoteTo?: 'q' | 'n' | 'b' | 'r'
};

export enum MoveType {
	INVALID = 0,
	QUIET = 1,
	CAPTURE = 2,
	EN_PASSANT = 3,
	KINGSIDE_CASTLE = 4,
	QUEENSIDE_CASTLE = 5,
	PAWN_PROMOTION = 6
}

export type ChessMoveResult = {
	type: MoveType,
	from: ChessPosition,
	to: ChessPosition,
	piece?: ChessPiece | null,
	capturedPiece?: ChessPiece,
	promotedTo?: 'q' | 'n' | 'b' | 'r'
};

export class ChessMove {
	chess: Chess;
	result: ChessMoveResult;

	constructor(chess: Chess, result: ChessMoveResult) {
		this.chess = chess;
		this.result = result;
	}

	undo() {
		const { from, to, type, capturedPiece } = this.result;

		const piece = this.chess.takeOut(to);

		if (!piece) {
			return;
		}

		this.chess.place(piece, from);
		this.chess.history.pop();

		switch (type) {
			case MoveType.CAPTURE:
			case MoveType.EN_PASSANT:
				if (capturedPiece) {
					return this._undoCapture(capturedPiece);
				}
				break;

			case MoveType.PAWN_PROMOTION:
				return this._undoPromotion(piece);

			case MoveType.KINGSIDE_CASTLE:
			case MoveType.QUEENSIDE_CASTLE:
				return this._undoCastling();

			default:
				break;
		}
	}

	_undoCapture(capturedPiece: ChessPiece) {
		if (this.result.type === MoveType.EN_PASSANT) {
			this.chess.place(capturedPiece, capturedPiece.square);
			return;
		}

		this.chess.place(capturedPiece, capturedPiece.square);
	}

	_undoPromotion(piece: ChessPiece) {
		this.chess.place(new ChessPiece('p', piece.color), this.result.from);
	}

	_undoCastling() {
		if (this.result.type === MoveType.KINGSIDE_CASTLE) {
			const rook = this.chess.takeOut(this.result.from, 1);

			if (rook) {
				this.chess.place(rook, this.result.from, 3);
			}

			return;
		}

		const rook = this.chess.takeOut(this.result.from, -1);

		if (rook) {
			this.chess.place(rook, this.result.from, -4);
		}
	}
}

export default function makeMove(chess: Chess, options: ChessMoveOptions): ChessMove {
	const from = chess.square(options.from);
	const to = chess.square(options.to);
	let piece = from?.piece;

	const result: ChessMoveResult = {
		type: MoveType.INVALID,
		from: options.from,
		to: options.to,
		piece
	};

	const move = new ChessMove(chess, result);

	if (!from || !piece || !to || !piece.square) {
		return move;
	}

	result.type = options.type;

	switch (result.type) {
		case MoveType.EN_PASSANT: {
			const capturedPiece = chess.takeOut(from.name, -1);

			if (capturedPiece) {
				result.capturedPiece = capturedPiece;
			}
			break;
		}

		case MoveType.CAPTURE:
		case MoveType.PAWN_PROMOTION: {
			if (result.type === MoveType.PAWN_PROMOTION) {
				result.promotedTo = options.promoteTo || 'q';
				piece = createPiece((piece.color === 'white' ? result.promotedTo.toUpperCase() : result.promotedTo.toLowerCase()) as ChessPieceSymbol);
			}

			const capturedPiece = chess.takeOut(options.to);

			if (capturedPiece) {
				result.capturedPiece = capturedPiece;
			}
			break;
		}

		case MoveType.KINGSIDE_CASTLE: {
			const rook = chess.takeOut(from.name, 3);

			if (rook && rook.type === 'r') {
				const toSquare = chess.board.at(from.name, 1)?.name;

				if (toSquare) {
					chess.place(rook, toSquare);
				}
			}
			break;
		}

		case MoveType.QUEENSIDE_CASTLE: {
			const rook = chess.takeOut(from.name, -4);

			if (rook && rook.type === 'r') {
				const toSquare = chess.board.at(from.name, -1)?.name;

				if (toSquare) {
					chess.place(rook, toSquare);
				}
			}
			break;
		}

		default:
			break;
	}

	chess.takeOut(options.from);
	chess.place(piece, options.to);
	chess.history.push(move);

	return move;
}
