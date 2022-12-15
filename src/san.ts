import Chess from './chess';
import { file, rank } from './utils';
import generateMoves from './pieces/moves';
import { ChessMove, MoveType } from './move';
import { CHESS_POSITIONS, SQUARE_MAP } from './board/board';
import { ChessPieceType, PawnPromotion } from './pieces/piece';

const CASTLING_SQUARES: { [key: string]: { kingside: number, queenside: number } } = {
	white: {
		kingside: SQUARE_MAP.g1,
		queenside: SQUARE_MAP.c1
	},
	black: {
		kingside: SQUARE_MAP.g8,
		queenside: SQUARE_MAP.c8
	}
};

export function parse(chess: Chess, san: string): ChessMove | false {
	san = stripDecorators(san);

	if (san.startsWith('O-O') || san.startsWith('o-o')) {
		const king = chess.kings[chess.turn];

		if (!king) {
			return false;
		}

		const isKingsideCastle = san.length === 3;
		const to = isKingsideCastle ?
			CHESS_POSITIONS[CASTLING_SQUARES[chess.turn].kingside] :
			CHESS_POSITIONS[CASTLING_SQUARES[chess.turn].queenside];

		return {
			from: king.square,
			to,
		};
	}

	const matches = /([NBQKR])?([a-h1-8][1-8]?)?x?([a-h][1-8])([NBQR])?/g.exec(san);

	if (!matches) {
		return false;
	}

	const [
		pieceType,
		disambiguator,
		to,
		promoteTo
	] = matches.slice(1);

	if (!to) {
		return false;
	}

	const moves = generateMoves(chess, { piece: (pieceType ?? 'p').toLowerCase() as ChessPieceType });
	const possibleMoves = moves.filter(m => m.to === to);

	if (!possibleMoves.length) {
		return false;
	}

	// Ambiguious moves
	if (possibleMoves.length > 1 && disambiguator) {
		// Takes the move where the 'from' position contains the disambiguator
		const move = possibleMoves.find(m => m.from.indexOf(disambiguator) !== -1);

		return !move ? false : {
			from: move.from,
			to: move.to
		};
	}

	const move = possibleMoves[0];

	return !promoteTo ? move : {
		from: move.from,
		to: move.to,
		promoteTo: promoteTo.toLowerCase() as PawnPromotion
	};
}

export function encode(move: ChessMove & { type: MoveType }, chess: Chess): string {
	switch (move.type) {
		case MoveType.KINGSIDE_CASTLE:
			return 'O-O';

		case MoveType.QUEENSIDE_CASTLE:
			return 'O-O-O';

		default: {
			const piece = chess.piece(move.from);

			if (!piece) {
				return '';
			}

			let san = piece.type === 'p' ? '' : piece.type.toUpperCase();

			const result = checkAmbiguity(move, chess);

			if (result.sameRank) {
				san += move.from[0];
			}

			if (result.sameFile) {
				san += move.from[1];
			}

			if (chess.piece(move.to)) {
				san += san.length ? 'x' : move.from[0] + 'x';
			}

			san += move.to;

			if (move.type === MoveType.PAWN_PROMOTION && move.promoteTo) {
				san += move.promoteTo.toUpperCase();
			}

			chess.move(san);

			if (chess.isCheck()) {
				san += chess.isCheckmate() ? '#' : '+';
			}

			chess.undo();

			return san;
		}
	}
}

function checkAmbiguity(move: ChessMove & { type: MoveType }, chess: Chess) {
	const result = {
		sameFile: false,
		sameRank: false
	};

	const moves = generateMoves(chess, { piece: chess.piece(move.from)?.type });
	const ambiguousMoves = moves.filter(m => m.from !== move.from && m.to === move.to);

	if (!ambiguousMoves.length) {
		return result;
	}

	if (ambiguousMoves.length > 1) {
		result.sameFile = true;
		result.sameRank = true;

		return result;
	}

	const { from } = ambiguousMoves[0];

	// Piece on same rank
	if (rank(from) === rank(move.from)) {
		result.sameRank = true;
	}

	// Piece on same file
	if (file(from) === file(move.from)) {
		result.sameFile = true;
	}

	// Piece on different rank and file
	if (!result.sameRank && !result.sameFile) {
		result.sameRank = true;
	}

	return result;
}

function stripDecorators(san: string) {
	return san.replace(/[=+#?!]+/, '');
}

export default {
	parse,
	encode
};
