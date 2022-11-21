import King from './pieces/king.js';
import Pawn from './pieces/pawn.js';
import Rook from './pieces/rook.js';
import Queen from './pieces/queen.js';
import Knight from './pieces/knight.js';
import Bishop from './pieces/bishop.js';
import ChessPiece, { ChessPieceColor } from './pieces/piece.js';

export type ChessPieceLetter =
    'k' | 'q' | 'r' | 'b' | 'n' | 'p' |
    'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

export default function createPiece(letter: ChessPieceLetter): ChessPiece {
	const color: ChessPieceColor = /[a-z]/.test(letter) ? 'black' : 'white';

	switch (letter) {
	case 'r':
	case 'R':
		return new Rook(color);

	case 'k':
	case 'K':
		return new King(color);

	case 'q':
	case 'Q':
		return new Queen(color);

	case 'n':
	case 'N':
		return new Knight(color);

	case 'b':
	case 'B':
		return new Bishop(color);

	default:
		return new Pawn(color);
	}
}
