import ChessPiece from './pieces/piece.js';

export default class Square {
	readonly name: string;
	readonly x: number;
	readonly y: number;
	piece: ChessPiece | null;

	constructor(name: string, x: number, y: number, piece?: ChessPiece) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.piece = piece ?? null;
	}

	hasPiece() {
		return !!this.piece;
	}
}
