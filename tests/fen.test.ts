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
                    white: {
                        kingsideCastling: false,
                        queensideCastling: false
                    },
                    black: {
                        kingsideCastling: false,
                        queensideCastling: false
                    }
                },
            }
        },
        {
            fen: '8/8/8/8/8/8/8/8 b - - 0 1',
            expected: {
                pieces: [],
                turn: 'black',
                flags: {
                    white: {
                        kingsideCastling: false,
                        queensideCastling: false
                    },
                    black: {
                        kingsideCastling: false,
                        queensideCastling: false
                    }
                },
            }
        },
        {
            fen: '8/8/8/8/8/8/8/P7 w - - 0 1',
            expected: {
                turn: 'white',
                pieces: [
                    [ 'P', 'a1' ]
                ],
                flags: {
                    white: {
                        kingsideCastling: false,
                        queensideCastling: false
                    },
                    black: {
                        kingsideCastling: false,
                        queensideCastling: false
                    }
                },
            }
        },
        {
            fen: '7p/8/8/8/8/8/8/8 w - - 0 1',
            expected: {
                turn: 'white',
                pieces: [
                    [ 'p', 'h8' ]
                ],
                flags: {
                    white: {
                        kingsideCastling: false,
                        queensideCastling: false
                    },
                    black: {
                        kingsideCastling: false,
                        queensideCastling: false
                    }
                },
            }
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            expected: {
                turn: 'white',
                flags: {
                    white: {
                        kingsideCastling: true,
                        queensideCastling: true
                    },
                    black: {
                        kingsideCastling: true,
                        queensideCastling: true
                    }
                },
                pieces: [
                    [ 'r', 'a8' ],
                    [ 'n', 'b8' ],
                    [ 'b', 'c8' ],
                    [ 'q', 'd8' ],
                    [ 'k', 'e8' ],
                    [ 'b', 'f8' ],
                    [ 'n', 'g8' ],
                    [ 'r', 'h8' ],
                    [ 'p', 'a7' ],
                    [ 'p', 'b7' ],
                    [ 'p', 'c7' ],
                    [ 'p', 'd7' ],
                    [ 'p', 'e7' ],
                    [ 'p', 'f7' ],
                    [ 'p', 'g7' ],
                    [ 'p', 'h7' ],

                    // White pieces
                    [ 'R', 'a1' ],
                    [ 'N', 'b1' ],
                    [ 'B', 'c1' ],
                    [ 'Q', 'd1' ],
                    [ 'K', 'e1' ],
                    [ 'B', 'f1' ],
                    [ 'N', 'g1' ],
                    [ 'R', 'h1' ],
                    [ 'P', 'a2' ],
                    [ 'P', 'b2' ],
                    [ 'P', 'c2' ],
                    [ 'P', 'd2' ],
                    [ 'P', 'e2' ],
                    [ 'P', 'f2' ],
                    [ 'P', 'g2' ],
                    [ 'P', 'h2' ],
                ]
            }
        },
        {
            fen: 'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 w - - 0 1',
            expected: {
                turn: 'white',
                flags: {
                    white: {
                        kingsideCastling: false,
                        queensideCastling: false
                    },
                    black: {
                        kingsideCastling: false,
                        queensideCastling: false
                    }
                },
                pieces: [
                    // Black pieces
                    [ 'r', 'a8' ],
                    [ 'b', 'c8' ],
                    [ 'k', 'd8' ],
                    [ 'r', 'h8' ],
                    [ 'p', 'a7' ],
                    [ 'p', 'd7' ],
                    [ 'p', 'f7' ],
                    [ 'p', 'h7' ],
                    [ 'n', 'a6' ],
                    [ 'n', 'f6' ],
                    [ 'p', 'b5' ],
                    [ 'q', 'a1' ],
                    [ 'b', 'g1' ],

                    // White pieces
                    [ 'B', 'e7' ],
                    [ 'N', 'g7' ],
                    [ 'N', 'd5' ],
                    [ 'P', 'e5' ],
                    [ 'P', 'h5' ],
                    [ 'P', 'g4' ],
                    [ 'P', 'd3' ],
                    [ 'P', 'a2' ],
                    [ 'P', 'c2' ],
                    [ 'K', 'e2' ],
                ]
            }
        },
        {
            fen: 'pP6/8/8/8/8/8/8/8           b - - 0 1',
            expected: {
                turn: 'black',
                flags: {
                    white: {
                        kingsideCastling: false,
                        queensideCastling: false
                    },
                    black: {
                        kingsideCastling: false,
                        queensideCastling: false
                    }
                },
                pieces: [
                    [ 'p', 'a8' ],
                    [ 'P', 'b8' ],
                ]
            }
        },
        {
            fen: 'r3k2r/8/8/8/8/8/8/R3K2R w kq - 1 1',
            expected: {
                turn: 'white',
                pieces: [
                    [ 'R', 'a1' ],
                    [ 'K', 'e1' ],
                    [ 'R', 'h1' ],
                    [ 'r', 'a8' ],
                    [ 'k', 'e8' ],
                    [ 'r', 'h8' ]
                ],
                flags: {
                    white: {
                        kingsideCastling: false,
                        queensideCastling: false
                    },
                    black: {
                        kingsideCastling: true,
                        queensideCastling: true
                    }
                }
            }
        },
        {
            fen: 'r3k2r/8/8/8/8/8/8/R3K2R w KQ - 1 1',
            expected: {
                turn: 'white',
                pieces: [
                    [ 'R', 'a1' ],
                    [ 'K', 'e1' ],
                    [ 'R', 'h1' ],
                    [ 'r', 'a8' ],
                    [ 'k', 'e8' ],
                    [ 'r', 'h8' ]
                ],
                flags: {
                    white: {
                        kingsideCastling: true,
                        queensideCastling: true
                    },
                    black: {
                        kingsideCastling: false,
                        queensideCastling: false
                    }
                }
            }
        },
        {
            fen: '',
            expected: {
                turn: 'white',
                pieces: [],
                flags: {
                    white: {
                        kingsideCastling: false,
                        queensideCastling: false
                    },
                    black: {
                        kingsideCastling: false,
                        queensideCastling: false
                    }
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
