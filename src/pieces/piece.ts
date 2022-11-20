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

	canMove(to: Square): boolean {
		if (!this.chess || !this.square) {
			return false;
		}

		return !!this.possibleMoves().find(s => s.name === to.name);
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
