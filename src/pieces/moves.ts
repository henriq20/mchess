import Chess from '../chess';
import { rank } from '../utils';
import { MoveType } from '../move';
import { MAILBOX, MAILBOX64, SQUARE_MAP } from '../board/board';
import ChessPiece, { ChessPieceColor, ChessPosition } from './piece';

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
	piece?: string
};

export default function generateMoves(chess: Chess, options: GenerateMovesOptions = {}): PseudoMove[] {
	const moves: PseudoMove[] = [];

	const addMove = (from: ChessPosition, to: ChessPosition, type: MoveType) => {
		moves.push({
			from,
			to,
			type
		});
	};

	let firstSquare = SQUARE_MAP.a8;
	let lastSquare = SQUARE_MAP.h1;

	if (options.square) {
		firstSquare = lastSquare = SQUARE_MAP[options.square];
	}

	const { color, piece: pieceTypes } = Object.assign({
		color: chess.turn,
		piece: 'pnrbqk'
	}, options);

	for (let i = firstSquare; i <= lastSquare; i++) {
		const square = chess.board._board[i];

		if (square.piece?.color !== color || pieceTypes.indexOf(square.piece.type) === -1) {
			continue;
		}

		const piece = square.piece;
		const index = SQUARE_MAP[square.name];

		if (piece.type !== 'p') {
			const offsets = OFFSETS[piece.type];

			for (let j = 0; j < offsets.length; j++) {
				const offset = offsets[j];

				let n = index;
				while (n !== -1) {
					n = MAILBOX[MAILBOX64[n] + offset];

					if (n === -1) {
						break;
					}

					const square = chess.board._board[n];

					if (!square.piece) {
						addMove(piece.square, square.name, MoveType.QUIET);
					}

					if (square.piece && square.piece.color !== piece.color) {
						addMove(piece.square, square.name, MoveType.CAPTURE);
					}

					if (!SLIDES[piece.type] || square.piece) {
						break;
					}
				}
			}

			if (piece.type !== 'k') {
				continue;
			}
		}

		if (piece.type === 'k') {
			if (chess.flags[piece.color].kingsideCastling) {
				const kingsideCastleSquare = chess.board.at(piece.square, 2);
				const kingsideCastleRook = chess.board.at(piece.square, 3);

				if (
					kingsideCastleSquare?.empty &&
					kingsideCastleRook?.piece?.type === 'r' &&
					kingsideCastleRook.piece.color === piece.color &&
					chess.board.at(piece.square, 1)?.empty
				) {
					addMove(piece.square, kingsideCastleSquare.name, MoveType.KINGSIDE_CASTLE);
				}
			}

			if (chess.flags[piece.color].queensideCastling) {
				const queensideCastleSquare = chess.board.at(piece.square, -2);
				const queensideCastleRook = chess.board.at(piece.square, -4);

				if (
					queensideCastleSquare?.empty &&
					queensideCastleRook?.piece?.type === 'r' &&
					queensideCastleRook.piece.color === piece.color &&
					chess.board.at(piece.square, -1)?.empty &&
					chess.board.at(piece.square, -3)?.empty
				) {
					addMove(piece.square, queensideCastleSquare.name, MoveType.QUEENSIDE_CASTLE);
				}
			}

			continue;
		}

		const oneSquareForward = chess.board.at(piece.square, PAWN_OFFSETS[piece.color][0]);

		if (oneSquareForward && oneSquareForward.empty) {
			let moveType = MoveType.QUIET;

			if (oneSquareForward.name[1] === '8' || oneSquareForward.name[1] === '1') {
				moveType = MoveType.PAWN_PROMOTION;
			}

			addMove(piece.square, oneSquareForward.name, moveType);

			if (_canMoveTwoSquares(piece)) {
				const twoSquaresForward = chess.board.at(piece.square, PAWN_OFFSETS[piece.color][1]);

				if (twoSquaresForward && twoSquaresForward.empty) {
					addMove(piece.square, twoSquaresForward.name, MoveType.BIG_PAWN);
				}
			}
		}

		for (let i = 2; i < 4; i++) {
			const offset = PAWN_OFFSETS[piece.color][i];

			const square = chess.board._board[MAILBOX[MAILBOX64[index] + offset]];

			if (!square) {
				continue;
			}

			if (!square.empty && square.piece?.color !== piece.color) {
				const moveType = square.name[1] === '8' || square.name[1] === '1' ? MoveType.PAWN_PROMOTION : MoveType.CAPTURE;
				addMove(piece.square, square.name, moveType);
				continue;
			}

			if (square.name === chess.enPassantSquare) {
				addMove(piece.square, square.name, MoveType.EN_PASSANT);
			}
		}
	}

	return moves;
}

function _canMoveTwoSquares(piece: ChessPiece) {
	return (piece.color === 'white' && rank(piece.square) === '2') ||
        (piece.color === 'black' && rank(piece.square) === '7');
}
