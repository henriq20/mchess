import Square from './board/square.js';
import ChessPiece, { ChessPosition } from './pieces/piece.js';

export function rank(square: ChessPosition): string {
	return square[1];
}

export function file(square: ChessPosition): string {
	return square[0];
}

export function occupied(square: Square | null): square is Square & { piece: ChessPiece } {
	return !!(square?.piece);
}

export function empty(square: Square | null): square is Square & { piece: null } {
	return !!(square && !square.piece);
}
