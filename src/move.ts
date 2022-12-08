import Chess from './chess.js';
import { SQUARE_MAP } from './board/board.js';
import ChessPiece, { ChessPieceSymbol, ChessPosition, createPiece, PawnPromotion } from './pieces/piece.js';

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
	piece: ChessPiece,
	captured: ChessPiece | null,
	promotedTo?: PawnPromotion
};

export function makeMove(chess: Chess, options: ChessMoveOptions): ChessMoveResult | false {
	const from = chess.square(options.from);
	const to = chess.square(options.to);
	let piece = from?.piece;

	if (!from || !piece || !to || !piece.square) {
		return false;
	}

	const result: ChessMoveResult = {
		type: options.type,
		from: from.name,
		to: to.name,
		piece,
		captured: null,
	};

	switch (result.type) {
		case MoveType.EN_PASSANT: {
			const capturedPiece = chess.takeOut(chess.history.at(-1)?.piece?.square as ChessPosition);

			if (capturedPiece) {
				result.captured = capturedPiece;
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
	chess.history.push(result);

	return result;
}

export function undoMove(chess: Chess): ChessMoveResult | false {
	const move = chess.history.pop();

	if (!move) {
		return false;
	}

	const { type, piece, captured } = move;

	const board = chess.board._board;
	const from = SQUARE_MAP[move.from];
	const to = SQUARE_MAP[move.to];

	piece.square = move.from;
	board[from].piece = piece;
	board[to].piece = captured;

	switch (type) {
		case MoveType.EN_PASSANT: {
			if (captured) {
				board[to].piece = null;
				board[SQUARE_MAP[captured.square]].piece = captured;
			}

			return move;
		}

		case MoveType.PAWN_PROMOTION: {
			piece.type = 'p';
			return move;
		}

		case MoveType.KINGSIDE_CASTLE: {
			const rookSquare = board[from + 1];

			if (rookSquare) {
				board[from + 3].piece = rookSquare.piece;
				rookSquare.piece = null;
			}

			return move;
		}

		case MoveType.QUEENSIDE_CASTLE: {
			const rookSquare = board[from - 1];

			if (rookSquare) {
				board[from - 4].piece = rookSquare.piece;
				rookSquare.piece = null;
			}

			return move;
		}

		default:
			return move;
	}
}

export default {
	makeMove,
	undoMove
};
