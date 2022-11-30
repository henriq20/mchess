import Square from './board/square.js';
import consoleColors from './colors.js';
import ChessBoard from './board/board.js';

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
	options: RenderOptions;

	constructor(board: ChessBoard, options: Partial<RenderOptions> = {}) {
		this.board = board;
		this.options = Object.assign({}, DEFAULTS, options);
	}

	render(options: Partial<RenderOptions> = {}) {
		const {
			file: renderFile,
			rank: renderRank,
			square: renderSquare,
			separator: renderSeparator
		} = Object.assign(this.options, options);

		let board = `  ${ renderSeparator(TOP) }\n`;

		const verticalSeparator = renderSeparator('│');

		for (let i = 0; i < this.board.size; i++) {
			const square = this.board._board[i];
			const renderedSquare = renderSquare(square);

			if (square.name[0] === 'a') {
				const rank = renderRank(square.name[1]);
				board += `${ rank } ${ verticalSeparator }`;
			}

			board += ` ${ renderedSquare } ${ verticalSeparator }`;

			if (square.name[0] === 'h' && i !== this.board.size - 1) {
				board += `\n  ${ renderSeparator(MIDDLE) }\n`;
			}
		}

		board += `\n  ${ renderSeparator(BOTTOM) }\n    `;
		board += FILES.map(renderFile).join('   ');

		return board;
	}
}
