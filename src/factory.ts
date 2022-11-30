import ChessPiece, { ChessPieceColor, ChessPieceSymbol, ChessPieceType } from './pieces/piece.js';

export default function createPiece(symbol: ChessPieceSymbol): ChessPiece {
	const color: ChessPieceColor = /[a-z]/.test(symbol) ? 'black' : 'white';

	return new ChessPiece(symbol.toLowerCase() as ChessPieceType, color);
}
