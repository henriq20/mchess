import { ChessPiece, ChessPieceName } from './pieces/piece.js';

export type ChessPieceLetter =
    'k' | 'q' | 'r' | 'b' | 'n' | 'p' |
    'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

const piecesMap: { [key: string]: ChessPieceName } = {
    'k': 'king',
    'q': 'queen',
    'r': 'rook',
    'b': 'bishop',
    'n': 'knight',
    'p': 'pawn'
};

export default function createPiece(letter: ChessPieceLetter): ChessPiece {
    return {
        letter,
        name: piecesMap[letter.toLowerCase()] ?? 'pawn',
        color: /[a-z]/.test(letter) ? 'white' : 'black'
    }
}
