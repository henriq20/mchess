import Square from '../square.js';
import ChessBoard from '../board.js';
import { ChessPieceLetter } from '../factory.js';

export type ChessPieceName = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export type ChessPieceColor = 'black' | 'white';

export default abstract class ChessPiece {
    name: ChessPieceName;
    color: ChessPieceColor;
    letter: ChessPieceLetter;
    moves: number;
    board?: ChessBoard | null;
    square?: Square | null;

    constructor(name: ChessPieceName, letter: ChessPieceLetter, color: ChessPieceColor) {
        this.name = name;
        this.letter = letter;
        this.color = color;
        this.moves = 0;
    }

    canMove(to: Square): boolean {
        if (!this.board || !this.square) {
            return false;
        }

        return !!this.possibleMoves().find(s => s.name === to.name);
    }

    abstract possibleMoves(): Square[];
}
