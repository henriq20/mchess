import createPiece from '../src/factory';
import { ChessPieceSymbol } from '../src/pieces/piece';

it.each([
    // White pieces
    { type: 'k', color: 'white', symbol: 'K' },
    { type: 'q', color: 'white', symbol: 'Q' },
    { type: 'r', color: 'white', symbol: 'R' },
    { type: 'b', color: 'white', symbol: 'B' },
    { type: 'n', color: 'white', symbol: 'N' },
    { type: 'p', color: 'white', symbol: 'P' },

    // Black pieces
    { type: 'k', color: 'black', symbol: 'k' },
    { type: 'q', color: 'black', symbol: 'q' },
    { type: 'r', color: 'black', symbol: 'r' },
    { type: 'b', color: 'black', symbol: 'b' },
    { type: 'n', color: 'black', symbol: 'n' },
    { type: 'p', color: 'black', symbol: 'p' },

])('it should create a $color $name when passed the letter $symbol', ({ type, color, symbol }) => {
    const piece = createPiece(symbol as ChessPieceSymbol);

    expect(piece.type).toBe(type);
    expect(piece.color).toBe(color);
});
