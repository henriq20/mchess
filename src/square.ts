import ChessPiece from './pieces/piece.js';
import { ChessPosition } from './position.js';

export default class Square {
	readonly name: ChessPosition;
	readonly x: number;
	readonly y: number;
	piece: ChessPiece | null;

	constructor(name: ChessPosition, x: number, y: number, piece?: ChessPiece) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.piece = piece ?? null;
	}

	hasPiece() {
		return !!this.piece;
	}
}
