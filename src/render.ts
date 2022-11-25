import { pad } from './utils.js';
import ChessBoard from './board/board.js';
import ChessPiece from './pieces/piece.js';
import consoleColors, { Color } from './colors.js';

type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends Function
	? T[P]
	: T[P] extends object
	? RecursivePartial<T[P]>
	: T[P]
};

export type RenderOptions = {
	rank: (this: ChessBoard, rank: string) => string,
	file: (this: ChessBoard, file: string) => string,
	piece: (this: ChessBoard, piece: ChessPiece | null) => string,
	squareHeight: number,
	squareWidth: number,
	separators: {
		[key: string]: string,
		horizontal: string,
		vertical: string,
		downAndRight: string,
		downAndLeft: string,
		upAndRight: string,
		upAndLeft: string,
		verticalAndRight: string,
		verticalAndLeft: string,
		downAndHorizontal: string,
		upAndHorizontal: string,
		verticalAndHorizontal: string
	},
	colors: {
		[key: string]: string,
		rank: Color,
		file: Color,
		piece: Color,
		separator: Color
	}
};

export const defaultOptions: RenderOptions = {
	rank: rank => rank,
	file: file => file,
	piece: piece => {
		if (piece) {
			return piece.color === 'white' ? piece.type.toUpperCase() : piece.type.toLowerCase();
		}

		return ' ';
	},
	squareHeight: 1,
	squareWidth: 3,
	separators: {
		horizontal: '─',
		vertical: '│',
		downAndRight: '┌',
		downAndLeft: '┐',
		upAndRight: '└',
		upAndLeft: '┘',
		verticalAndRight: '├',
		verticalAndLeft: '┤',
		downAndHorizontal: '┬',
		upAndHorizontal: '┴',
		verticalAndHorizontal: '┼'
	},
	colors: {
		rank: 'gray',
		file: 'gray',
		piece: 'white',
		separator: 'darkGray'
	}
};

export default class ChessBoardRenderer {
	board: ChessBoard;
	options: RenderOptions;
	lastRender: string;

	constructor(board: ChessBoard, options: RecursivePartial<RenderOptions> = {}) {
		this.board = board;
		this.lastRender = '';
		this.options = this._setOptions(options);
	}

	clear() {
		this.lastRender = '';
	}

	render() {
		if (!this.lastRender.length) {
			this.lastRender = this._render();
			return this.lastRender;
		}

		let currentRow = this.board.size;
		const lines = this.lastRender.split('\n').map(line => {
			if (line.startsWith(' ')) {
				return line;
			}

			return this._renderRow(--currentRow);
		});

		this.lastRender = lines.join('\n');

		return this.lastRender;
	}

	_renderRow(row: number) {
		const { colors, rank, separators } = this.options;

		let currentRank = rank.call(this.board, (row + 1).toString());
		currentRank = this._applyColor(colors.rank, currentRank);

		const pieces = this._renderPieces(row);

		const line = `${currentRank} ${separators.vertical}${pieces}${separators.vertical}`;

		return line;
	}

	_createLine(separator: string) {
		return new Array(this.board.size)
			.fill(this.options.separators.horizontal
				.repeat(this.options.squareWidth))
			.join(separator);
	}

	_renderPieces(row: number) {
		const { piece, squareWidth, colors, separators } = this.options;

		return this.board._board[row].map(s => {
			let currentPiece = piece.call(this.board, s.piece);
			currentPiece = pad(currentPiece, ' ', squareWidth);

			return this._applyColor(colors.piece, currentPiece);
		}).join(separators.vertical);
	}

	_renderFiles() {
		const { colors, squareWidth, file } = this.options;
		const files = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];

		return files.map(f => this._applyColor(colors.file, file.call(this.board, f)))
			.join(' '.repeat(squareWidth));
	}

	_render() {
		const { separators, colors } = this.options;

		for (const key in separators) {
			separators[key] = this._applyColor(colors.separator, separators[key]);
		}

		let matrix = '';

		const line = this._createLine(separators.verticalAndHorizontal);

		for (let row = this.board.size - 1; row >= 0; row--) {
			matrix += this._renderRow(row);

			if (row > 0) {
				const newLine = `\n  ${separators.verticalAndRight}${line}${separators.verticalAndLeft}\n`;
				matrix += newLine;
			}
		}

		const top = `  ${separators.downAndRight}${this._createLine(separators.downAndHorizontal)}${separators.downAndLeft}`;
		const bottom = `  ${separators.upAndRight}${this._createLine(separators.upAndHorizontal)}${separators.upAndLeft}`;

		const files = this._renderFiles();

		return `${top}\n${matrix}\n${bottom}\n    ${files}`;
	}

	_setOptions(options: RecursivePartial<RenderOptions> = {}): RenderOptions {
		return Object.assign({}, defaultOptions, {
			...options,
			separators: {
				...defaultOptions.separators,
				...options.separators
			},
			colors: {
				...defaultOptions.colors,
				...options.colors
			}
		});
	}

	_applyColor(color: Color, input: string) {
		return consoleColors[color](input);
	}
}
