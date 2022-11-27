import ChessPiece from '../pieces/piece.js';
import { ChessPosition } from './position.js';

export default class Square {
	readonly name: ChessPosition;
	piece: ChessPiece | null;

	constructor(name: ChessPosition, piece?: ChessPiece) {
		this.name = name;
		this.piece = piece ?? null;
	}

	get empty(): boolean {
		return !this.piece;
	}
}
