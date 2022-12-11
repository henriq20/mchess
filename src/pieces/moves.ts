import Chess from '../chess';
import { MoveType } from '../move';
import { empty, rank } from '../utils';
import { MAILBOX, MAILBOX64, SQUARE_MAP } from '../board/board';
import ChessPiece, { ChessPieceColor, ChessPieceType, ChessPosition } from './piece';

export type PseudoMove = {
	from: ChessPosition,
	to: ChessPosition,
	type: MoveType
};

const SLIDES = {
	r: true,
	b: true,
	q: true,
	k: false,
	n: false
};

const OFFSETS = {
	r: [ -10, -1, 1, 10 ],
	b: [ -11, -9, 9, 11 ],
	q: [ -11, -10, -9, -1, 1, 9, 10, 11 ],
	k: [ -11, -10, -9, -1, 1,  9, 10, 11 ],
	n: [ -21, -19, -12, -8, 8, 12, 19, 21 ]
};

const PAWN_OFFSETS = {
	white: [ -10, -20, -11, -9 ],
	black: [ 10, 20, 11, 9 ]
};

type GenerateMovesOptions = {
	square?: ChessPosition,
	color?: ChessPieceColor,
	piece?: ChessPieceType
};

export default function generateMoves(chess: Chess, options: GenerateMovesOptions = {}): PseudoMove[] {
	const moves: PseudoMove[] = [];

	function addMoves(piece: ChessPiece, pieceIndex: number) {
		if (options.piece && piece.type !== options.piece) {
			return;
		}

		if (piece.type === 'p') {
			_getPawnMoves(chess, piece, pieceIndex, moves);
			return;
		}

		_getMoves(chess, piece, pieceIndex, moves);
	}

	const color = options.color || chess.turn;

	if (!options.square) {
		chess.board[color].forEach(addMoves);
		return moves;
	}

	const piece = chess.board.get(options.square)?.piece;

	if (piece?.color === color) {
		addMoves(piece, SQUARE_MAP[piece.square]);
	}

	return moves;
}

function _getMoves(chess: Chess, piece: ChessPiece, index: number, moves: PseudoMove[]) {
	if (piece.type === 'p') {
		return;
	}

	const offsets = OFFSETS[piece.type];

	for (let i = 0; i < offsets.length; i++) {
		const offset = offsets[i];

		let n = index;
		while (n !== -1) {
			n = MAILBOX[MAILBOX64[n] + offset];

			if (n === -1) {
				break;
			}

			const square = chess.board._board[n];

			if (square.piece) {
				if (square.piece.color !== piece.color) {
					moves.push({ from: piece.square, to: square.name, type: MoveType.CAPTURE });
				}

				break;
			}

			moves.push({ from: piece.square, to: square.name, type: MoveType.QUIET });

			if (!SLIDES[piece.type]) {
				break;
			}
		}
	}

	if (piece.type !== 'k') {
		return;
	}

	if (chess.flags[piece.color].kingsideCastling) {
		const kingsideCastleSquare = chess.board.at(piece.square, 2);
		const kingsideCastleRook = chess.board.at(piece.square, 3);

		if (
			empty(kingsideCastleSquare) &&
			kingsideCastleRook?.piece?.type === 'r' &&
			kingsideCastleRook.piece.color === piece.color &&
			empty(chess.board.at(piece.square, 1))
		) {
			moves.push({ from: piece.square, to: kingsideCastleSquare?.name, type: MoveType.KINGSIDE_CASTLE });
		}
	}

	if (chess.flags[piece.color].queensideCastling) {
		const queensideCastleSquare = chess.board.at(piece.square, -2);
		const queensideCastleRook = chess.board.at(piece.square, -4);

		if (
			empty(queensideCastleSquare) &&
			queensideCastleRook?.piece?.type === 'r' &&
			queensideCastleRook.piece.color === piece.color &&
			empty(chess.board.at(piece.square, -1)) &&
			empty(chess.board.at(piece.square, -3))
		) {
			moves.push({ from: piece.square, to: queensideCastleSquare.name, type: MoveType.QUEENSIDE_CASTLE });
		}
	}
}

function _getPawnMoves(chess: Chess, piece: ChessPiece, index: number, moves: PseudoMove[]) {
	const offset = PAWN_OFFSETS[piece.color];
	const oneSquareForward = chess.board.at(piece.square, offset[0]);

	const isPromotion = _isPawnPromotion(piece);

	if (empty(oneSquareForward)) {
		moves.push({ from: piece.square, to: oneSquareForward.name, type: isPromotion ? MoveType.PAWN_PROMOTION : MoveType.QUIET });

		if (_canMoveTwoSquares(piece)) {
			const twoSquaresForward = chess.board.at(piece.square, offset[1]);

			if (empty(twoSquaresForward)) {
				moves.push({ from: piece.square, to: twoSquaresForward.name, type: MoveType.BIG_PAWN });
			}
		}
	}

	for (let i = 2; i < 4; i++) {
		const offset = PAWN_OFFSETS[piece.color][i];

		const square = chess.board._board[MAILBOX[MAILBOX64[index] + offset]];

		if (!square) {
			continue;
		}

		if (square.piece && square.piece.color !== piece.color) {
			moves.push({ from: piece.square, to: square.name, type: isPromotion ? MoveType.PAWN_PROMOTION : MoveType.CAPTURE });
			continue;
		}

		if (square.name === chess.enPassantSquare) {
			moves.push({ from: piece.square, to: square.name, type: MoveType.EN_PASSANT });
		}
	}
}

function _canMoveTwoSquares(piece: ChessPiece) {
	return (piece.color === 'white' && rank(piece.square) === '2') ||
        (piece.color === 'black' && rank(piece.square) === '7');
}

function _isPawnPromotion(piece: ChessPiece) {
	return (piece.color === 'white' && rank(piece.square) === '7') ||
		(piece.color === 'black' && rank(piece.square) === '2');
}
