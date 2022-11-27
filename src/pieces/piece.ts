import Chess from '../chess.js';
import { ChessPosition } from '../board/position.js';

export type ChessPieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';

export type ChessPieceColor = 'black' | 'white';

export type ChessPieceSymbol =
	'k' | 'q' | 'r' | 'b' | 'n' | 'p' |
	'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

export default abstract class ChessPiece {
	type: ChessPieceType;
	color: ChessPieceColor;
	square: ChessPosition;

	constructor(type: ChessPieceType, color: ChessPieceColor, square?: ChessPosition) {
		this.type = type;
		this.color = color;
		this.square = square || '-';
	}

	abstract possibleMoves(chess: Chess): ChessPosition[];

	get symbol() {
		return this.color === 'white' ? this.type.toUpperCase() : this.type;
	}
}
