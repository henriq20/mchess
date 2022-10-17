import ChessBoard from '../board.js';
import Square from '../square.js';

export type ChessPieceName = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export type ChessPieceColor = 'black' | 'white';

export interface ChessPiece {
    name: ChessPieceName;
    color: ChessPieceColor;
    letter: string;
    moves?: number;
    board?: ChessBoard | null;
    square?: Square | null;
}
