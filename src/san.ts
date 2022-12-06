import Chess from './chess';
import { ChessMove } from './move';
import generateMoves from './pieces/moves';
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

	const matches = /([nbqkrNBQKR])?([a-h1-8][1-8]?)?x?([a-h][1-8])([nbqrNBQR])?/g.exec(san);

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
		}
	}

	const move = possibleMoves[0];

	return !promoteTo ? move : {
		from: move.from,
		to: move.to,
		promoteTo: promoteTo.toLowerCase() as PawnPromotion
	};
}

function stripDecorators(san: string) {
	return san.replace(/[=+#?!]+/, '');
}

export default {
	parse
};
