import { ChessPosition, toArrayPosition, toChessPosition } from '../src/position';

it.each([
    [ [0, 0], 'a1' ],
    [ [0, 1], 'b1' ],
    [ [0, 2], 'c1' ],
    [ [0, 3], 'd1' ],
    [ [0, 4], 'e1' ],
    [ [0, 5], 'f1' ],
    [ [0, 6], 'g1' ],
    [ [0, 7], 'h1' ],

    [ [1, 0], 'a2' ],
    [ [2, 0], 'a3' ],
    [ [3, 0], 'a4' ],
    [ [4, 0], 'a5' ],
    [ [5, 0], 'a6' ],
    [ [6, 0], 'a7' ],
    [ [7, 0], 'a8' ],

    [ [1, 1], 'b2' ],
    [ [2, 2], 'c3' ],
    [ [3, 3], 'd4' ],
    [ [4, 4], 'e5' ],
    [ [5, 5], 'f6' ],
    [ [6, 6], 'g7' ],
    [ [7, 7], 'h8' ]
])('should convert %p to %p', ([ x, y ], expected) => {
    expect(toChessPosition(x, y)).toBe(expected);
});

it.each([
    [ 'a1', [0, 0] ],
    [ 'b1', [0, 1] ],
    [ 'c1', [0, 2] ],
    [ 'd1', [0, 3] ],
    [ 'e1', [0, 4] ],
    [ 'f1', [0, 5] ],
    [ 'g1', [0, 6] ],
    [ 'h1', [0, 7] ],

    [ 'a2', [1, 0] ],
    [ 'a3', [2, 0] ],
    [ 'a4', [3, 0] ],
    [ 'a5', [4, 0] ],
    [ 'a6', [5, 0] ],
    [ 'a7', [6, 0] ],
    [ 'a8', [7, 0] ],

    [ 'b2', [1, 1] ],
    [ 'c3', [2, 2] ],
    [ 'd4', [3, 3] ],
    [ 'e5', [4, 4] ],
    [ 'f6', [5, 5] ],
    [ 'g7', [6, 6] ],
    [ 'h8', [7, 7] ]
])('should convert %p back to %p', (chessPosition, [ x, y ]) => {
    expect(toArrayPosition(chessPosition as ChessPosition)).toStrictEqual([ x, y ]);
});
