import Square from './board/square.js';
import consoleColors from './colors.js';
import ChessBoard, { SQUARE_MAP } from './board/board.js';

export type RenderOptions = {
	rank: (rank: string) => string,
	file: (file: string) => string,
	square: (square: Square) => string,
	separator: (separator: string) => string
};

export const DEFAULTS: RenderOptions = {
	rank: rank => consoleColors.gray(rank),
	file: file => consoleColors.gray(file),
	separator: separator => consoleColors.darkGray(separator),
	square: square => {
		if (square.piece) {
			return square.piece.color === 'white' ? square.piece.symbol : consoleColors.darkYellow(square.piece.symbol);
		}

		return ' ';
	}
};

const TOP    = '┌───┬───┬───┬───┬───┬───┬───┬───┐';
const MIDDLE = '├───┼───┼───┼───┼───┼───┼───┼───┤';
const BOTTOM = '└───┴───┴───┴───┴───┴───┴───┴───┘';

const FILES = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];

export default class ChessBoardRenderer {
	board: ChessBoard;

	constructor(board: ChessBoard) {
		this.board = board;
	}

	render(options: Partial<RenderOptions> = {}) {
		const {
			file: renderFile,
			rank: renderRank,
			square: renderSquare,
			separator: renderSeparator
		} = Object.assign({}, DEFAULTS, options);

		let board = `  ${ renderSeparator(TOP) }\n`;

		const verticalSeparator = renderSeparator('│');

		for (let i = SQUARE_MAP.a8; i <= SQUARE_MAP.h1; i++) {
			const square = this.board._board[i];
			const renderedSquare = renderSquare(square);

			if (square.name[0] === 'a') {
				const rank = renderRank(square.name[1]);
				board += `${ rank } ${ verticalSeparator }`;
			}

			board += ` ${ renderedSquare } ${ verticalSeparator }`;

			if (square.name[0] === 'h' && i !== SQUARE_MAP.h1) {
				board += `\n  ${ renderSeparator(MIDDLE) }\n`;
			}
		}

		board += `\n  ${ renderSeparator(BOTTOM) }\n    `;
		board += FILES.map(renderFile).join('   ');

		return board;
	}
}
