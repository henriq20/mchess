import Chess from './chess';
import Square from './board/square';
import { ChessPosition, toChessPosition } from './board/position';
import { ChessPieceColor, ChessPieceSymbol } from './pieces/piece';

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

export function decode(fen: string): FENResult {
	const [ placement, turn, castlingRights ] = fen.split(/\s+/);

	const pieces: Array<[ChessPieceSymbol, ChessPosition]> = [];

	let i = -1, row = 7, column = 0;
	while (++i < placement.length) {
		const char = placement.charAt(i);

		if (char === '/') {
			row--;
			column = 0;
			continue;
		}
		if (isDigit(char)) {
			column += Number(char);
			continue;
		}

		pieces.push([ char as ChessPieceSymbol, toChessPosition(row, column++) ]);
	}

	return {
		pieces,
		turn: turn === 'b' ? 'black' : 'white',
		flags: {
			WHITE_KINGSIDE_CASTLING: castlingRights?.includes('K') ?? false,
			WHITE_QUEENSIDE_CASTLING: castlingRights?.includes('Q') ?? false,
			BLACK_KINGSIDE_CASTLING: castlingRights?.includes('k') ?? false,
			BLACK_QUEENSIDE_CASTLING: castlingRights?.includes('q') ?? false
		}
	};
}

export function encode(chess: Chess): string {
	const rows = [];

	for (let row = chess.board.size - 1; row >= 0; row--) {
		let emptySquares = 0;
		let currentRow = '';

		for (let column = 0; column < chess.board.size; column++) {
			const square = chess.board._get(row, column) as Square;

			if (square.empty) {
				emptySquares++;
				continue;
			}

			currentRow += emptySquares > 0 ? emptySquares + (square.piece?.symbol as string) : square.piece?.symbol;
			emptySquares = 0;
		}

		rows.push(emptySquares === 0 ? currentRow || emptySquares : currentRow + emptySquares);
	}

	const flags = Object.keys(chess.flags).map(flag => {
		return chess.flags[flag] ? FLAGS_MAP[flag] : '';
	}).join('') || '-';

	return `${ rows.join('/') } ${ chess.turn.charAt(0) } ${ flags } - 0 1`;
}

function isDigit(char = '') {
	return /^[1-9]$/.test(char);
}
