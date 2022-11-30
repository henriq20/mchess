import Chess from './chess';
import { SQUARE_MAP } from './board/board';
import { ChessPieceColor, ChessPieceSymbol, ChessPosition } from './pieces/piece';

export type Flags = {
	[key: string]: boolean,
	WHITE_KINGSIDE_CASTLING: boolean,
	WHITE_QUEENSIDE_CASTLING: boolean,
	BLACK_KINGSIDE_CASTLING: boolean,
	BLACK_QUEENSIDE_CASTLING: boolean
};

export type FENResult = {
	pieces: Array<[ChessPieceSymbol, ChessPosition]>
	turn: ChessPieceColor,
	flags: Flags
};

const FLAGS_MAP: { [key: string]: string } = {
	WHITE_KINGSIDE_CASTLING: 'K',
	WHITE_QUEENSIDE_CASTLING: 'Q',
	BLACK_KINGSIDE_CASTLING: 'k',
	BLACK_QUEENSIDE_CASTLING: 'q'
};

const CHESS_POSITIONS = Object.keys(SQUARE_MAP);

export function decode(fen: string): FENResult {
	const [ placement, turn, castlingRights ] = fen.split(/\s+/);

	const pieces: Array<[ChessPieceSymbol, ChessPosition]> = [];

	let i = 0, j = 0;
	while (i < placement.length) {
		const char = placement.charAt(i++);

		if (char === '/') {
			continue;
		}

		if (isDigit(char)) {
			j += Number(char);
			continue;
		}

		pieces.push([ char as ChessPieceSymbol, CHESS_POSITIONS[j] as ChessPosition ]);
		j++;
	}

	return {
		pieces,
		turn: turn === 'b' ? 'black' : 'white',
		flags: {
			WHITE_KINGSIDE_CASTLING: castlingRights?.indexOf('K') >= 0,
			WHITE_QUEENSIDE_CASTLING: castlingRights?.indexOf('Q') >= 0,
			BLACK_KINGSIDE_CASTLING: castlingRights?.indexOf('k') >= 0,
			BLACK_QUEENSIDE_CASTLING: castlingRights?.indexOf('q') >= 0
		}
	};
}

export function encode(chess: Chess): string {
	let emptySquares = 0, fen = '';
	for (let i = 0; i < chess.board.size; i++) {
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

	const flags = Object.keys(chess.flags).map(flag => {
		return chess.flags[flag] ? FLAGS_MAP[flag] : '';
	}).join('') || '-';

	const fullMoves = chess.history.filter(m => m.result.piece?.color === 'black').length || 1;

	return `${ fen } ${ chess.turn.charAt(0) } ${ flags } - 0 ${ fullMoves }`;
}

function isDigit(char = '') {
	return /^[1-9]$/.test(char);
}
