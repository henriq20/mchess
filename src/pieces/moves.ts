import Chess from '../chess';
import Square from '../board/square';
import ChessPiece, { ChessPosition } from './piece';
import { MAILBOX, MAILBOX64, SQUARE_MAP } from '../board/board';

const OFFSETS = {
	r: { slide: true, offsets: [ -10, -1, 1, 10 ] },
	b: { slide: true, offsets: [ -11, -9, 9, 11 ] },
	q: { slide: true, offsets: [ -11, -10, -9, -1, 1, 9, 10, 11 ] },
	k: { slide: false, offsets: [ -11, -10, -9, -1, 1,  9, 10, 11 ] },
	n: { slide: false, offsets: [ -21, -19, -12, -8, 8, 12, 19, 21 ] }
};

const PAWN_OFFSETS = {
	white: [ -10, -20, -11, -9 ],
	black: [ 10, 20, 11, 9 ]
};

export default function generateMoves(chess: Chess, piece: ChessPiece): ChessPosition[] {
	const moves: ChessPosition[] = [];
	const index = SQUARE_MAP[piece.square];

	if (piece.type !== 'p') {
		const pieceOffset = OFFSETS[piece.type];

		for (const offset of pieceOffset.offsets) {
			let n = index;
			while (n !== -1) {
				n = MAILBOX[MAILBOX64[n] + offset];

				if (n === -1) {
					break;
				}

				const square = chess.board._board[n];

				if (!square.piece || square.piece.color !== piece.color) {
					moves.push(square.name);
				}

				if (!pieceOffset.slide || !square.empty) {
					break;
				}
			}
		}

		if (piece.type !== 'k') {
			return moves;
		}
	}

	if (piece.type === 'p') {
		return generatePawnMoves(chess, piece);
	}

	return [ ...moves, ...generateKingMoves(chess, piece) ];
}

function generateKingMoves(chess: Chess, piece: ChessPiece): ChessPosition[] {
	const moves: ChessPosition[] = [];

	if (chess.flags[piece.color].kingsideCastling) {
		const kingsideCastleSquare = chess.board.at(piece.square, 2);
		const kingsideCastleRook = chess.board.at(piece.square, 3);

		if (
			kingsideCastleSquare?.empty &&
			kingsideCastleRook?.piece?.type === 'r' &&
			kingsideCastleRook.piece.color === piece.color &&
			chess.board.at(piece.square, 1)?.empty
		) {
			moves.push(kingsideCastleSquare.name);
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
			moves.push(queensideCastleSquare.name);
		}
	}

	return moves;
}

function generatePawnMoves(chess: Chess, piece: ChessPiece): ChessPosition[] {
	const moves: ChessPosition[] = [];
	const index = SQUARE_MAP[piece.square];

	const oneSquareForward = chess.board.at(piece.square, PAWN_OFFSETS[piece.color][0]);

	if (oneSquareForward && oneSquareForward.empty) {
		moves.push(oneSquareForward.name);

		if (_canMoveTwoSquares(piece)) {
			const twoSquaresForward = chess.board.at(piece.square, PAWN_OFFSETS[piece.color][1]);

			if (twoSquaresForward && twoSquaresForward.empty) {
				moves.push(twoSquaresForward.name);
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
			moves.push(square.name);
			continue;
		}

		const enPassantSquare = chess.board.at(piece.square, offset + (Math.sign(offset) * -10));

		if (enPassantSquare && _isEnPassant(chess, piece, enPassantSquare)) {
			moves.push(square.name);
		}
	}

	return moves;
}

function _canMoveTwoSquares(piece: ChessPiece) {
	return (piece.color === 'white' && piece.square[1] === '2') ||
        (piece.color === 'black' && piece.square[1] === '7');
}

function _isEnPassant(chess: Chess, piece: ChessPiece, to: Square) {
	const lastMovePiece = chess.history.at(-1)?.result.piece;

	return lastMovePiece &&
        lastMovePiece.type === 'p' &&
        lastMovePiece.color !== piece.color &&
        to.piece === lastMovePiece;
}
