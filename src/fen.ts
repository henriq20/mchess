import Chess from './chess';
import { CHESS_POSITIONS } from './board/board';
import { ChessPieceColor, ChessPieceSymbol, ChessPosition } from './pieces/piece';

export type Flags = {
	[key: string]: { kingsideCastling: boolean, queensideCastling: boolean },
	white: {
		kingsideCastling: boolean,
		queensideCastling: boolean,
	},
	black: {
		kingsideCastling: boolean,
		queensideCastling: boolean,
	}
};

export type FENResult = {
	pieces: Array<[ChessPieceSymbol, ChessPosition]>
	turn: ChessPieceColor,
	flags: Flags
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

export function decode(fen: string): FENResult {
	const [ placement, turn, castlingRights ] = fen.split(/\s+/);

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

	const flags = Object.keys(chess.flags).map(color => {
		const flag = chess.flags[color];

		const kingside = flag.kingsideCastling ? FLAGS_MAP[color].kingsideCastling : '';
		const queenside = flag.queensideCastling ? FLAGS_MAP[color].queensideCastling : '';

		return kingside + queenside;
	}).join('') || '-';

	const fullMoves = chess.history.filter(m => m.result.piece?.color === 'black').length + 1;

	return `${ fen } ${ chess.turn.charAt(0) } ${ flags } - 0 ${ fullMoves }`;
}

function isDigit(char = '') {
	return /^[1-9]$/.test(char);
}
