import Chess from '../chess.js';
import ChessBoard from '../board/board.js';
import { ChessPosition } from '../board/position.js';

export type ChessPieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';

export type ChessPieceColor = 'black' | 'white';

export type ChessPieceSymbol =
	'k' | 'q' | 'r' | 'b' | 'n' | 'p' |
	'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

export default abstract class ChessPiece {
	type: ChessPieceType;
	color: ChessPieceColor;
	square?: ChessPosition;
	board?: ChessBoard;

	constructor(type: ChessPieceType, color: ChessPieceColor) {
		this.type = type;
		this.color = color;
	}

	abstract possibleMoves(chess?: Chess): ChessPosition[];

	hasMoved(chess: Chess) {
		return chess.history.some(m => m.result.piece === this);
	}
}
