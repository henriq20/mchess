import parseFEN from '../src/fen';

it('should parse a FEN that results in an empty board', () => {
    const result = parseFEN('8/8/8/8/8/8/8/8 w - - 0 1');

    expect(result).toMatchObject({
        pieces: [],
        turn: 'white'
    });
});

it('should parse a FEN that results in the black pieces playing first', () => {
    const result = parseFEN('8/8/8/8/8/8/8/8 b - - 0 1');

    expect(result).toMatchObject({
        pieces: [],
        turn: 'black'
    });
});

it('should parse a FEN that results in a white pawn on a1', () => {
    const result = parseFEN('8/8/8/8/8/8/8/P7 w - - 0 1');

    expect(result).toMatchObject({
        pieces: [
            [ 'P', [ 0, 0 ] ]
        ],
        turn: 'white'
    });
});

it('should parse a FEN that results in a black pawn on h8', () => {
    const result = parseFEN('7p/8/8/8/8/8/8/8 w - - 0 1');

    expect(result).toMatchObject({
        pieces: [
            [ 'p', [ 7, 7 ] ]
        ],
        turn: 'white'
    });
});

const cases = [
    {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        expected: {
            turn: 'white',
            pieces: [
                [ 'r', [ 7, 0 ] ],
                [ 'n', [ 7, 1 ] ],
                [ 'b', [ 7, 2 ] ],
                [ 'q', [ 7, 3 ] ],
                [ 'k', [ 7, 4 ] ],
                [ 'b', [ 7, 5 ] ],
                [ 'n', [ 7, 6 ] ],
                [ 'r', [ 7, 7 ] ],
                [ 'p', [ 6, 0 ] ],
                [ 'p', [ 6, 1 ] ],
                [ 'p', [ 6, 2 ] ],
                [ 'p', [ 6, 3 ] ],
                [ 'p', [ 6, 4 ] ],
                [ 'p', [ 6, 5 ] ],
                [ 'p', [ 6, 6 ] ],
                [ 'p', [ 6, 7 ] ],

                // White pieces
                [ 'R', [ 0, 0 ] ],
                [ 'N', [ 0, 1 ] ],
                [ 'B', [ 0, 2 ] ],
                [ 'Q', [ 0, 3 ] ],
                [ 'K', [ 0, 4 ] ],
                [ 'B', [ 0, 5 ] ],
                [ 'N', [ 0, 6 ] ],
                [ 'R', [ 0, 7 ] ],
                [ 'P', [ 1, 0 ] ],
                [ 'P', [ 1, 1 ] ],
                [ 'P', [ 1, 2 ] ],
                [ 'P', [ 1, 3 ] ],
                [ 'P', [ 1, 4 ] ],
                [ 'P', [ 1, 5 ] ],
                [ 'P', [ 1, 6 ] ],
                [ 'P', [ 1, 7 ] ],
            ]
        }
    },
    {
        fen: 'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 w - - 0 1',
        expected: {
            turn: 'white',
            pieces: [
                // Black pieces
                [ 'r', [ 7, 0 ] ],
                [ 'b', [ 7, 2 ] ],
                [ 'k', [ 7, 3 ] ],
                [ 'r', [ 7, 7 ] ],
                [ 'p', [ 6, 0 ] ],
                [ 'p', [ 6, 3 ] ],
                [ 'p', [ 6, 5 ] ],
                [ 'p', [ 6, 7 ] ],
                [ 'n', [ 5, 0 ] ],
                [ 'n', [ 5, 5 ] ],
                [ 'p', [ 4, 1 ] ],
                [ 'q', [ 0, 0 ] ],
                [ 'b', [ 0, 6 ] ],

                // White pieces
                [ 'B', [ 6, 4 ] ],
                [ 'N', [ 6, 6 ] ],
                [ 'N', [ 4, 3 ] ],
                [ 'P', [ 4, 4 ] ],
                [ 'P', [ 4, 7 ] ],
                [ 'P', [ 3, 6 ] ],
                [ 'P', [ 2, 3 ] ],
                [ 'P', [ 1, 0 ] ],
                [ 'P', [ 1, 2 ] ],
                [ 'K', [ 1, 4 ] ],
            ]
        }
    },
    {
        fen: 'pP6/8/8/8/8/8/8/8           b - - 0 1',
        expected: {
            turn: 'black',
            pieces: [
                [ 'p', [ 7, 0 ] ],
                [ 'P', [ 7, 1 ] ],
            ]
        }
    }
]

it.each(cases)('should parse the FEN $fen', ({ fen, expected }) => {
    const result = parseFEN(fen);

    expect(result.turn).toBe(expected.turn);
    expect(result.pieces).toHaveLength(expected.pieces.length);
    expect(result.pieces).toEqual(expect.arrayContaining(expected.pieces));
});
