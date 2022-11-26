import Chess from '../src/chess';
import { encode, decode } from '../src/fen';

describe('decode', () => {
    const cases = [
        {
            fen: '8/8/8/8/8/8/8/8 w - - 0 1',
            expected: {
                pieces: [],
                turn: 'white',
                flags: {
                    WHITE_KINGSIDE_CASTLING: false,
                    WHITE_QUEENSIDE_CASTLING: false,
                    BLACK_KINGSIDE_CASTLING: false,
                    BLACK_QUEENSIDE_CASTLING: false
                },
            }
        },
        {
            fen: '8/8/8/8/8/8/8/8 b - - 0 1',
            expected: {
                pieces: [],
                turn: 'black',
                flags: {
                    WHITE_KINGSIDE_CASTLING: false,
                    WHITE_QUEENSIDE_CASTLING: false,
                    BLACK_KINGSIDE_CASTLING: false,
                    BLACK_QUEENSIDE_CASTLING: false
                },
            }
        },
        {
            fen: '8/8/8/8/8/8/8/P7 w - - 0 1',
            expected: {
                turn: 'white',
                pieces: [
                    [ 'P', [ 0, 0 ] ]
                ],
                flags: {
                    WHITE_KINGSIDE_CASTLING: false,
                    WHITE_QUEENSIDE_CASTLING: false,
                    BLACK_KINGSIDE_CASTLING: false,
                    BLACK_QUEENSIDE_CASTLING: false
                },
            }
        },
        {
            fen: '7p/8/8/8/8/8/8/8 w - - 0 1',
            expected: {
                turn: 'white',
                pieces: [
                    [ 'p', [ 7, 7 ] ]
                ],
                flags: {
                    WHITE_KINGSIDE_CASTLING: false,
                    WHITE_QUEENSIDE_CASTLING: false,
                    BLACK_KINGSIDE_CASTLING: false,
                    BLACK_QUEENSIDE_CASTLING: false
                },
            }
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            expected: {
                turn: 'white',
                flags: {
                    WHITE_KINGSIDE_CASTLING: true,
                    WHITE_QUEENSIDE_CASTLING: true,
                    BLACK_KINGSIDE_CASTLING: true,
                    BLACK_QUEENSIDE_CASTLING: true
                },
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
                flags: {
                    WHITE_KINGSIDE_CASTLING: false,
                    WHITE_QUEENSIDE_CASTLING: false,
                    BLACK_KINGSIDE_CASTLING: false,
                    BLACK_QUEENSIDE_CASTLING: false
                },
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
                flags: {
                    WHITE_KINGSIDE_CASTLING: false,
                    WHITE_QUEENSIDE_CASTLING: false,
                    BLACK_KINGSIDE_CASTLING: false,
                    BLACK_QUEENSIDE_CASTLING: false
                },
                pieces: [
                    [ 'p', [ 7, 0 ] ],
                    [ 'P', [ 7, 1 ] ],
                ]
            }
        },
        {
            fen: 'r3k2r/8/8/8/8/8/8/R3K2R w kq - 1 1',
            expected: {
                turn: 'white',
                pieces: [
                    [ 'R', [ 0, 0 ] ],
                    [ 'K', [ 0, 4 ] ],
                    [ 'R', [ 0, 7 ] ],
                    [ 'r', [ 7, 0 ] ],
                    [ 'k', [ 7, 4 ] ],
                    [ 'r', [ 7, 7 ] ]
                ],
                flags: {
                    WHITE_KINGSIDE_CASTLING: false,
                    WHITE_QUEENSIDE_CASTLING: false,
                    BLACK_KINGSIDE_CASTLING: true,
                    BLACK_QUEENSIDE_CASTLING: true
                }
            }
        },
        {
            fen: 'r3k2r/8/8/8/8/8/8/R3K2R w KQ - 1 1',
            expected: {
                turn: 'white',
                pieces: [
                    [ 'R', [ 0, 0 ] ],
                    [ 'K', [ 0, 4 ] ],
                    [ 'R', [ 0, 7 ] ],
                    [ 'r', [ 7, 0 ] ],
                    [ 'k', [ 7, 4 ] ],
                    [ 'r', [ 7, 7 ] ]
                ],
                flags: {
                    WHITE_KINGSIDE_CASTLING: true,
                    WHITE_QUEENSIDE_CASTLING: true,
                    BLACK_KINGSIDE_CASTLING: false,
                    BLACK_QUEENSIDE_CASTLING: false
                }
            }
        },
        {
            fen: '',
            expected: {
                turn: 'white',
                pieces: [],
                flags: {
                    WHITE_KINGSIDE_CASTLING: false,
                    WHITE_QUEENSIDE_CASTLING: false,
                    BLACK_KINGSIDE_CASTLING: false,
                    BLACK_QUEENSIDE_CASTLING: false
                }
            }
        }
    ]

    it.each(cases)('should parse the FEN $fen', ({ fen, expected }) => {
        const result = decode(fen);

        expect(result.turn).toBe(expected.turn);
        expect(result.flags).toMatchObject(expected.flags);
        expect(result.pieces).toHaveLength(expected.pieces.length);
        expect(result.pieces).toEqual(expect.arrayContaining(expected.pieces));
    });
});

describe('encode', () => {
    const cases = [
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            expected: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        },
        {
            fen: 'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 w - - 0 1',
            expected: 'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 w - - 0 1'
        },
        {
            fen: 'pP6/8/8/8/8/8/8/8           b - - 0 1',
            expected: 'pP6/8/8/8/8/8/8/8 b - - 0 1'
        },
        {
            fen: '8/8/8/8/8/8/8/8 w - - 0 1',
            expected: '8/8/8/8/8/8/8/8 w - - 0 1'
        }
    ]

    it.each(cases)('should encode the current board state to the fen $fen', ({ fen, expected }) => {
        const chess = new Chess(fen);

        const [ placement, turn, castlingRights ] = encode(chess).split(' ');

        expect(placement).toBe(expected.split(' ')[0]);
        expect(turn).toBe(expected.split(' ')[1]);
        expect(castlingRights).toContain(expected.split(' ')[2]);
    });
});
