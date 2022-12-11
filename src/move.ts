import Chess from './chess.js';
import { SQUARE_MAP } from './board/board.js';
import ChessPiece, { ChessPieceType, ChessPosition, PawnPromotion } from './pieces/piece.js';

export type ChessMoveOptions = {
	type: MoveType,
	from: ChessPosition,
	to: ChessPosition,
	promoteTo?: PawnPromotion
};

export enum MoveType {
	QUIET = 1,
	CAPTURE = 2,
	EN_PASSANT = 3,
	KINGSIDE_CASTLE = 4,
	QUEENSIDE_CASTLE = 5,
	PAWN_PROMOTION = 6,
	BIG_PAWN = 7
}

export type ChessMove = {
	from: ChessPosition,
	to: ChessPosition,
	promoteTo?: PawnPromotion
};

export type ChessMoveResult = {
	type: MoveType,
	from: ChessPosition,
	to: ChessPosition,
	piece: ChessPieceType,
	captured: ChessPiece | null,
	promotedTo?: PawnPromotion
};

export function makeMove(chess: Chess, options: ChessMoveOptions): ChessMoveResult | false {
	const from = chess.square(options.from);
	const to = chess.square(options.to);
	let piece = from?.piece;

	if (!from || !piece || !to || piece.square === '-') {
		return false;
	}

	const result: ChessMoveResult = {
		type: options.type,
		from: from.name,
		to: to.name,
		piece: piece.type,
		captured: null,
	};

	switch (result.type) {
		case MoveType.EN_PASSANT: {
			const capturedPiece = chess.takeOut(chess.history.at(-1)?.move.to as ChessPosition);

			if (capturedPiece) {
				result.captured = capturedPiece;
			}
			break;
		}

		case MoveType.CAPTURE:
		case MoveType.PAWN_PROMOTION: {
			if (result.type === MoveType.PAWN_PROMOTION) {
				result.promotedTo = options.promoteTo || 'q';
				piece = new ChessPiece(result.promotedTo, piece.color);
			}

			const capturedPiece = chess.takeOut(options.to);

			if (capturedPiece) {
				result.captured = capturedPiece;
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
	chess.history.push({
		move: result,
		turn: chess.turn
	});

	return result;
}

export function undoMove(chess: Chess): ChessMoveResult | false {
	const lastState = chess.history.pop();

	if (!lastState) {
		return false;
	}

	const { from, to, type, captured, piece: pieceType } = lastState.move;

	const board = chess.board;
	const piece = board.remove(to);

	if (piece) {
		piece.type = pieceType;
		board.place(piece, from);
	}

	switch (type) {
		case MoveType.CAPTURE:
		case MoveType.EN_PASSANT: {
			if (captured) {
				board.place(captured, captured.square);
			}

			return lastState.move;
		}

		case MoveType.KINGSIDE_CASTLE: {
			const fromIndex = SQUARE_MAP[from];
			const rookSquare = board._board[fromIndex + 1];

			if (rookSquare) {
				board.shift(rookSquare.name, board._board[fromIndex + 3].name);
			}

			return lastState.move;
		}

		case MoveType.QUEENSIDE_CASTLE: {
			const fromIndex = SQUARE_MAP[from];
			const rookSquare = board._board[fromIndex - 1];

			if (rookSquare) {
				board.shift(rookSquare.name, board._board[fromIndex - 4].name);
			}

			return lastState.move;
		}

		default:
			return lastState.move;
	}
}

export default {
	makeMove,
	undoMove
};
