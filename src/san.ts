import Chess from './chess';
import { MoveType } from './move';
import { ChessPieceType } from './pieces/piece';
import generateMoves, { PseudoMove } from './pieces/moves';
import { CHESS_POSITIONS, SQUARE_MAP } from './board/board';

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

export function parse(chess: Chess, san: string): PseudoMove & { promoteTo?: ChessPieceType } | false {
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
			type: isKingsideCastle ? MoveType.KINGSIDE_CASTLE : MoveType.QUEENSIDE_CASTLE
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
	if (possibleMoves.length > 1) {
		// Takes the move where the 'from' position contains the disambiguator
		return possibleMoves.find(m => m.from.indexOf(disambiguator) !== -1) || false;
	}

	return !promoteTo ? possibleMoves[0] : {
		...possibleMoves[0],
		promoteTo: promoteTo.toLowerCase() as ChessPieceType
	};
}

function stripDecorators(san: string) {
	return san.replace(/[=+#?!]+/, '');
}

export default {
	parse
};
