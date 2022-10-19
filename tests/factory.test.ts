import createPiece, { ChessPieceLetter } from '../src/factory';

it.each([
    // White pieces
    { name: 'king', color: 'white', letter: 'k' },
    { name: 'queen', color: 'white', letter: 'q' },
    { name: 'rook', color: 'white', letter: 'r' },
    { name: 'bishop', color: 'white', letter: 'b' },
    { name: 'knight', color: 'white', letter: 'n' },
    { name: 'pawn', color: 'white', letter: 'p' },

    // Black pieces
    { name: 'king', color: 'black', letter: 'K' },
    { name: 'queen', color: 'black', letter: 'Q' },
    { name: 'rook', color: 'black', letter: 'R' },
    { name: 'bishop', color: 'black', letter: 'B' },
    { name: 'knight', color: 'black', letter: 'N' },
    { name: 'pawn', color: 'black', letter: 'P' },

])('it should create a $color $name when passed the letter $letter', (piece) => {
    expect(createPiece(piece.letter as ChessPieceLetter)).toMatchObject(piece);
});
