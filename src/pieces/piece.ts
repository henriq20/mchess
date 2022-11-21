import Chess from '../chess.js';
import Square from '../square.js';
import makeMove from '../move.js';
import { ChessPosition } from '../position.js';
import { ChessPieceLetter } from '../factory.js';

export type ChessPieceName = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export type ChessPieceColor = 'black' | 'white';

export default abstract class ChessPiece {
	name: ChessPieceName;
	color: ChessPieceColor;
	letter: ChessPieceLetter;
	moves: number;
	chess?: Chess | null;
	square?: ChessPosition | null;

	constructor(name: ChessPieceName, letter: ChessPieceLetter, color: ChessPieceColor) {
		this.name = name;
		this.letter = letter;
		this.color = color;
		this.moves = 0;
	}

	canMove(to: Square | ChessPosition): boolean {
		if (!this.chess || !this.square) {
			return false;
		}

		const square = typeof to === 'string' ? to : to.name;

		return this.possibleMoves().some(s => s.name === square);
	}

	isEnemy(square: Square): boolean {
		if (!this.chess) {
			return false;
		}

		return square.hasPiece() && square.piece?.color !== this.color;
	}

	wouldBeInCheck(to: ChessPosition) {
		const move = makeMove(this.chess as Chess, {
			from: this.square as ChessPosition,
			to
		});

		if (!move) {
			return false;
		}

		if (this.chess?.isCheck()) {
			move.undo();
			return true;
		}

		move.undo();
		return false;
	}

    abstract possibleMoves(): Square[];
}
