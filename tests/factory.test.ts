import createPiece, { ChessPieceLetter } from '../src/factory';

it.each([
    // White pieces
    { name: 'king', color: 'white', letter: 'K' },
    { name: 'queen', color: 'white', letter: 'Q' },
    { name: 'rook', color: 'white', letter: 'R' },
    { name: 'bishop', color: 'white', letter: 'B' },
    { name: 'knight', color: 'white', letter: 'N' },
    { name: 'pawn', color: 'white', letter: 'P' },

    // Black pieces
    { name: 'king', color: 'black', letter: 'k' },
    { name: 'queen', color: 'black', letter: 'q' },
    { name: 'rook', color: 'black', letter: 'r' },
    { name: 'bishop', color: 'black', letter: 'b' },
    { name: 'knight', color: 'black', letter: 'n' },
    { name: 'pawn', color: 'black', letter: 'p' },

])('it should create a $color $name when passed the letter $letter', (piece) => {
    expect(createPiece(piece.letter as ChessPieceLetter)).toMatchObject(piece);
});
