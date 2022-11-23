import ChessPiece from '../pieces/piece.js';
import { ArrayPosition, ChessPosition } from './position.js';

export default class Square {
	readonly name: ChessPosition;
	readonly position: ArrayPosition;
	piece: ChessPiece | null;

	constructor(name: ChessPosition, position: ArrayPosition, piece?: ChessPiece) {
		this.name = name;
		this.piece = piece ?? null;
		this.position = position;
	}

	get empty(): boolean {
		return !this.piece;
	}
}
