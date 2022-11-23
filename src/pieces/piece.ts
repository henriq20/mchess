import ChessBoard from '../board.js';
import { ChessPosition } from '../position.js';

export type ChessPieceName = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export type ChessPieceColor = 'black' | 'white';

export type ChessPieceLetter =
    'k' | 'q' | 'r' | 'b' | 'n' | 'p' |
    'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

export default abstract class ChessPiece {
	name: ChessPieceName;
	color: ChessPieceColor;
	letter: ChessPieceLetter;
	moves: number;
	board?: ChessBoard;
	square?: ChessPosition;

	constructor(name: ChessPieceName, letter: ChessPieceLetter, color: ChessPieceColor) {
		this.name = name;
		this.letter = letter;
		this.color = color;
		this.moves = 0;
	}

	canMove(to: ChessPosition): boolean {
		if (!this.board || !this.square) {
			return false;
		}

		return this.possibleMoves().includes(to);
	}

    abstract possibleMoves(): ChessPosition[];
}
