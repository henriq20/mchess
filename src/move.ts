import Chess from './chess.js';
import Pawn from './pieces/pawn.js';
import createPiece from './factory.js';
import Square from './board/square.js';
import ChessPiece, { ChessPieceSymbol } from './pieces/piece.js';
import { ChessPosition, toChessPosition } from './board/position.js';

export type ChessMoveOptions = {
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
};

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

			default:
				break;
		}
	}

	_undoCapture(capturedPiece: ChessPiece) {
		if (this.result.type === MoveType.EN_PASSANT) {
			this.chess.place(capturedPiece, capturedPiece.square as ChessPosition);
			return;
		}

		this.chess.place(capturedPiece, capturedPiece.square as ChessPosition);
	}

	_undoPromotion(piece: ChessPiece) {
		this.chess.place(new Pawn(piece.color), this.result.from);
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

	result.type = determineMoveType(chess, from, to);

	switch (result.type) {
		case MoveType.EN_PASSANT: {
			const capturedPiece = chess.takeOut(toChessPosition(to.position[0] - 1, to.position[1]));

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

		default:
			break;
	}

	chess.takeOut(options.from);
	chess.place(piece, options.to);
	chess.history.push(move);

	return move;
}

function determineMoveType(chess: Chess, from: Square, to: Square): MoveType {
	const lastMove = chess.history.at(-1);

	if (lastMove?.result.piece?.type === 'p' && from.piece?.type === 'p' && from.position[1] !== to.position[1]) {
		return MoveType.EN_PASSANT;
	}
	if (from.piece?.type === 'p' && (to.position[0] === 0 || to.position[0] === 7)) {
		return MoveType.PAWN_PROMOTION;
	}
	if (to.empty) {
		return MoveType.QUIET;
	}

	return MoveType.CAPTURE;
}
