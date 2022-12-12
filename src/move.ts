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
	const from = chess.board.get(options.from);
	const to = chess.board.get(options.to);

	if (!from || !to || !from.piece) {
		return false;
	}

	const piece = from.piece;
	const pieceType = piece.type;
	let captured = chess.board.remove(to);

	chess.board.remove(from);
	chess.board.place(piece, to);

	switch (options.type) {
		case MoveType.PAWN_PROMOTION:
			piece.type = options.promoteTo || 'q';
			break;

		case MoveType.EN_PASSANT:
			const lastState = chess.history.at(-1);

			if (lastState) {
				captured = chess.takeOut(lastState.move.to);
			}
			break;


		case MoveType.KINGSIDE_CASTLE:
			const rightRook = chess.takeOut(from.name, 3);

			if (rightRook?.type === 'r') {
				const toSquare = chess.board.at(from.name, 1);

				if (toSquare) {
					chess.board.place(rightRook, toSquare);
				}
			}
			break;


		case MoveType.QUEENSIDE_CASTLE:
			const leftRook = chess.takeOut(from.name, -4);

			if (leftRook?.type === 'r') {
				const toSquare = chess.board.at(from.name, -1);

				if (toSquare) {
					chess.board.place(leftRook, toSquare);
				}
			}
			break;

		default:
			break;
	}

	const result = {
		type: options.type,
		from: options.from,
		to: options.to,
		piece: pieceType,
		captured: captured,
		promotedTo: piece.type as PawnPromotion
	};

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
