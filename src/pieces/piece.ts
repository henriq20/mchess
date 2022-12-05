export type ChessPieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';

export type PawnPromotion = 'q' | 'n' | 'b' | 'r';

export type ChessPieceColor = 'black' | 'white';

export type ChessPieceSymbol =
	'k' | 'q' | 'r' | 'b' | 'n' | 'p' |
	'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

export type ChessPosition =
'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' |
'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' |
'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' |
'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' |
'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' |
'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' |
'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' |
'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1' | '-';

export default class ChessPiece {
	type: ChessPieceType;
	color: ChessPieceColor;
	square: ChessPosition;

	constructor(type: ChessPieceType, color: ChessPieceColor, square?: ChessPosition) {
		this.type = type;
		this.color = color;
		this.square = square || '-';
	}

	get symbol() {
		return this.color === 'white' ? this.type.toUpperCase() : this.type;
	}
}

export function createPiece(symbol: ChessPieceSymbol): ChessPiece {
	const color: ChessPieceColor = /[a-z]/.test(symbol) ? 'black' : 'white';

	return new ChessPiece(symbol.toLowerCase() as ChessPieceType, color);
}
