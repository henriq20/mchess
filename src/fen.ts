import Chess, { Flags } from './chess';
import { CHESS_POSITIONS, SQUARE_MAP } from './board/board';
import { ChessPieceColor, ChessPieceSymbol, ChessPosition } from './pieces/piece';

export type FENResult = {
	pieces: Array<[ChessPieceSymbol, ChessPosition]>
	turn: ChessPieceColor,
	flags: Flags,
	enPassantSquare: ChessPosition | null
};

const FLAGS_MAP: { [key: string]: { kingsideCastling: string, queensideCastling: string } } = {
	white: {
		kingsideCastling: 'K',
		queensideCastling: 'Q',
	},
	black: {
		kingsideCastling: 'k',
		queensideCastling: 'q',
	},
};

export function parse(fen: string): FENResult | null {
	if (!isValid(fen)) {
		return null;
	}

	const [ placement, turn, castlingRights, enPassantSquare ] = fen.split(/\s+/);

	const pieces: Array<[ChessPieceSymbol, ChessPosition]> = [];

	let i = 0, squares = 0;
	while (i < placement.length) {
		const char = placement.charAt(i++);

		if (char === '/') {
			continue;
		}

		if (isDigit(char)) {
			squares += Number(char);
			continue;
		}

		pieces.push([ char as ChessPieceSymbol, CHESS_POSITIONS[squares] as ChessPosition ]);
		squares++;
	}

	return {
		pieces,
		turn: turn === 'b' ? 'black' : 'white',
		enPassantSquare: enPassantSquare === '-' ? null : enPassantSquare as ChessPosition,
		flags: {
			white: {
				kingsideCastling: castlingRights?.indexOf('K') >= 0,
				queensideCastling: castlingRights?.indexOf('Q') >= 0
			},
			black: {
				kingsideCastling: castlingRights?.indexOf('k') >= 0,
				queensideCastling: castlingRights?.indexOf('q') >= 0
			}
		}
	};
}

export function encode(chess: Chess): string {
	let emptySquares = 0, fen = '';
	for (let i = SQUARE_MAP.a8; i <= SQUARE_MAP.h1; i++) {
		const square = chess.board._board[i];

		if (!square.piece) {
			emptySquares++;
		} else {
			fen += (emptySquares > 0 ? emptySquares : '') + square.piece.symbol;
			emptySquares = 0;
		}

		if (square.name[0] === 'h') {
			if (!square.piece) {
				fen += emptySquares;
			}

			fen += '/';
			emptySquares = 0;
		}
	}

	fen = fen.substring(0, fen.length - 1);

	const flags = Object.keys(chess.flags).map(color => {
		const flag = chess.flags[color];

		const kingside = flag.kingsideCastling ? FLAGS_MAP[color].kingsideCastling : '';
		const queenside = flag.queensideCastling ? FLAGS_MAP[color].queensideCastling : '';

		return kingside + queenside;
	}).join('') || '-';

	const fullMoves = chess.history.filter(m => m.piece.color === 'black').length + 1;

	return `${ fen } ${ chess.turn.charAt(0) } ${ flags } ${ chess.enPassantSquare || '-' } 0 ${ fullMoves }`;
}

function isDigit(char = '') {
	return /^[1-9]$/.test(char);
}

function isValid(fen: string): boolean {
	return /(?:(?:\/|^)[prnbqkPRNBQK1-8]+)+\s+[wb]\s+[KkQq-]{1,4}\s+(?:-|[a-h][1-8])\s+\d+\s+\d+$/g.test(fen);
}

export default {
	parse,
	encode
};
