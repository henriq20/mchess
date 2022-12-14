import Chess from '../src/chess';
import { encode, parse } from '../src/san';
import { ChessMove, MoveType } from '../src/move';

describe('parse', () => {
    const cases = [
        // Quiet moves
        {
            san: 'e3',
            expected: { from: 'e2', to: 'e3' }
        },
        {
            san: 'e4',
            expected: { from: 'e2', to: 'e4' }
        },
        {
            san: 'Nf3',
            expected: { from: 'g1', to: 'f3' }
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1',
            san: 'e5',
            expected: { from: 'e7', to: 'e5' }
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPPP1PP/RNBQKBNR w KQkq - 0 1',
            san: 'e5',
            expected: { from: 'e4', to: 'e5' }
        },

        // Captures
        {
            fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
            san: 'exd5',
            expected: { from: 'e4', to: 'd5' }
        },
        {
            fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
            san: 'dxe4',
            expected: { from: 'd5', to: 'e4' }
        },

        // Promotions
        {
            fen: '8/k3P3/8/8/8/8/K3p3/8 w - - 0 1',
            san: 'e8=Q',
            expected: { from: 'e7', to: 'e8', promoteTo: 'q' }
        },
        {
            fen: '8/k3P3/8/8/8/8/K3p3/8 w - - 0 1',
            san: 'e8R',
            expected: { from: 'e7', to: 'e8', promoteTo: 'r' }
        },
        {
            fen: '3k4/8/8/8/5K2/8/7p/6N1 b - - 0 68',
            san: 'hxg1=Q',
            expected: { from: 'h2', to: 'g1', promoteTo: 'q' }
        },
        {
            fen: '3k4/8/8/8/5K2/8/7p/6N1 b - - 0 68',
            san: 'hxg1N',
            expected: { from: 'h2', to: 'g1', promoteTo: 'n' }
        },

        // Castling
        {
            fen: '4k2r/8/8/8/8/8/8/4K2R w Kk - 1 1',
            san: 'O-O',
            expected: { from: 'e1', to: 'g1' }
        },
        {
            fen: 'r3k3/8/8/8/8/8/8/R3K3 w Qq - 1 1',
            san: 'O-O-O',
            expected: { from: 'e1', to: 'c1' }
        },

        // Ambiguious moves on the same rank
        {
            fen: '2k5/8/8/8/8/8/6K1/R6R w - - 0 1',
            san: 'Rad1',
            expected: { from: 'a1', to: 'd1' }
        },
        {
            fen: '2k5/8/8/8/8/8/6K1/R6R w - - 0 1',
            san: 'Rhd1',
            expected: { from: 'h1', to: 'd1' }
        },
        {
            fen: 'k7/8/8/8/8/8/8/K3N1N1 w - - 0 1',
            san: 'Ngf3',
            expected: { from: 'g1', to: 'f3' }
        },
        {
            fen: 'k7/8/8/8/8/8/8/K3N1N1 w - - 0 1',
            san: 'Nef3',
            expected: { from: 'e1', to: 'f3' }
        },
        {
            fen: 'k7/8/8/8/3N4/8/7N/K7 w - - 0 1',
            san: 'Nhf3',
            expected: { from: 'h2', to: 'f3' }
        },
        {
            fen: 'k7/8/8/8/3N4/8/7N/K7 w - - 0 1',
            san: 'Ndf3',
            expected: { from: 'd4', to: 'f3' }
        },

        // Ambiguious moves on the same rank with capture
        {
            fen: 'k7/8/8/8/3N4/5p2/7N/K7 w - - 0 1',
            san: 'Nhxf3',
            expected: { from: 'h2', to: 'f3' }
        },
        {
            fen: 'k7/8/8/8/3N4/5p2/7N/K7 w - - 0 1',
            san: 'Ndxf3',
            expected: { from: 'd4', to: 'f3' }
        },

        // Ambiguious moves on the same file
        {
            fen: 'k7/8/8/6N1/8/8/8/K5N1 w - - 0 1',
            san: 'N5f3',
            expected: { from: 'g5', to: 'f3' }
        },
        {
            fen: 'k7/8/8/6N1/8/8/8/K5N1 w - - 0 1',
            san: 'N1f3',
            expected: { from: 'g1', to: 'f3' }
        },

        // Ambiguious moves on the same file with capture
        {
            fen: 'k7/8/8/6N1/8/5p2/8/K5N1 w - - 0 1',
            san: 'N1xf3',
            expected: { from: 'g1', to: 'f3' }
        },
        {
            fen: 'k7/8/8/6N1/8/5p2/8/K5N1 w - - 0 1',
            san: 'N5xf3',
            expected: { from: 'g5', to: 'f3' }
        },

        // Rare cases where three or more pieces are able to reach the same square
        {
            fen: '1k1r3r/8/8/R7/4Q2Q/8/8/RK5Q w - - 0 1',
            san: 'Qh4e1',
            expected: { from: 'h4', to: 'e1' }
        },
        {
            fen: '1k1r3r/8/8/R7/4Q2Q/8/8/RK5Q w - - 0 1',
            san: 'Qe4e1',
            expected: { from: 'e4', to: 'e1' }
        },
        {
            fen: '1k1r3r/8/8/R7/4Q2Q/8/8/RK5Q w - - 0 1',
            san: 'Qh1e1',
            expected: { from: 'h1', to: 'e1' }
        },

        // Even rarer cases where a capture also happens
        {
            fen: '1k1r3r/8/8/R7/4Q2Q/8/8/RK2p2Q w - - 0 1',
            san: 'Qh4xe1',
            expected: { from: 'h4', to: 'e1' }
        },
        {
            fen: '1k1r3r/8/8/R7/4Q2Q/8/8/RK2p2Q w - - 0 1',
            san: 'Qe4xe1',
            expected: { from: 'e4', to: 'e1' }
        },
    ];

    it.each(cases)('should parse the SAN $san', ({ fen, san, expected }) => {
        const chess = new Chess(fen);

        expect(parse(chess, san)).toMatchObject(expected);
    });
});

describe('encode', () => {
    const cases: Array<{ fen: string, move: ChessMove & { type: MoveType }, expected: string }> = [
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            move: {
                from: 'e2',
                to: 'e4',
                type: MoveType.QUIET
            },
            expected: 'e4'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
            move: {
                from: 'f1',
                to: 'c4',
                type: MoveType.QUIET
            },
            expected: 'Bc4'
        },
        {
            fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
            move: {
                from: 'e4',
                to: 'd5',
                type: MoveType.CAPTURE
            },
            expected: 'exd5'
        },
        {
            fen: 'rnbqkbnr/pp1ppppp/8/8/2p1P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
            move: {
                from: 'f1',
                to: 'c4',
                type: MoveType.CAPTURE
            },
            expected: 'Bxc4'
        },
        {
            fen: 'rnbqkbnr/ppp1pppp/8/4p3/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 1',
            move: {
                from: 'e5',
                to: 'd4',
                type: MoveType.CAPTURE
            },
            expected: 'exd4'
        },
        {
            fen: 'rnbqkbnr/ppp1pppp/3p4/4P3/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
            move: {
                from: 'e5',
                to: 'd6',
                type: MoveType.EN_PASSANT
            },
            expected: 'exd6'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/3BPN2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
            move: {
                from: 'e1',
                to: 'g1',
                type: MoveType.KINGSIDE_CASTLE
            },
            expected: 'O-O'
        },
        {
            fen: 'rnbqkbnr/pppppppp/8/8/8/NBP5/PPQPPPPP/R3KBNR b KQkq - 0 1',
            move: {
                from: 'e1',
                to: 'c1',
                type: MoveType.QUEENSIDE_CASTLE
            },
            expected: 'O-O-O'
        },
        {
            fen: '8/k4P2/8/8/8/8/K3p3/8 w - - 0 1',
            move: {
                from: 'f7',
                to: 'f8',
                type: MoveType.PAWN_PROMOTION,
                promoteTo: 'q'
            },
            expected: 'f8Q'
        },
        {
            fen: '6n1/k4P2/8/8/8/8/K3p3/8 w - - 0 1',
            move: {
                from: 'f7',
                to: 'g8',
                promoteTo: 'q',
                type: MoveType.PAWN_PROMOTION,
            },
            expected: 'fxg8Q'
        },

        // Ambiguious moves
        {
            fen: '4k3/8/8/8/8/8/4K3/R6R w - - 0 1',
            move: {
                from: 'a1',
                to: 'd1',
                type: MoveType.QUIET
            },
            expected: 'Rad1'
        },
        {
            fen: '2k5/8/8/8/8/8/6K1/R6R w - - 0 1',
            move: {
                from: 'h1',
                to: 'd1',
                type: MoveType.QUIET
            },
            expected: 'Rhd1'
        },
        {
            fen: 'k7/8/8/6N1/8/8/8/K5N1 w - - 0 1',
            move: {
                from: 'g5',
                to: 'f3',
                type: MoveType.QUIET
            },
            expected: 'N5f3'
        },
        {
            fen: 'k7/8/8/6N1/8/8/8/K5N1 w - - 0 1',
            move: {
                from: 'g1',
                to: 'f3',
                type: MoveType.QUIET
            },
            expected: 'N1f3'
        },
        {
            fen: 'k7/8/8/8/3N4/5p2/7N/K7 w - - 0 1',
            move: {
                from: 'h2',
                to: 'f3',
                type: MoveType.CAPTURE
            },
            expected: 'Nhxf3'
        },
        {
            fen: 'k7/8/8/6N1/4p3/6N1/8/K7 w - - 0 1',
            move: {
                from: 'g3',
                to: 'e4',
                type: MoveType.CAPTURE
            },
            expected: 'N3xe4'
        },
        {
            fen: 'k7/8/8/6N1/4p3/6N1/8/K7 w - - 0 1',
            move: {
                from: 'g5',
                to: 'e4',
                type: MoveType.CAPTURE
            },
            expected: 'N5xe4'
        },
        {
            fen: '1k1r3r/8/8/R7/4Q2Q/8/8/RK5Q w - - 0 1',
            move: {
                from: 'h4',
                to: 'e1',
                type: MoveType.QUIET
            },
            expected: 'Qh4e1'
        },
        {
            fen: '1k1r3r/8/8/R7/4Q2Q/8/8/RK5Q w - - 0 1',
            move: {
                from: 'e4',
                to: 'e1',
                type: MoveType.QUIET
            },
            expected: 'Qe4e1'
        },
        {
            fen: '1k1r3r/8/8/R7/4Q2Q/8/8/RK5Q w - - 0 1',
            move: {
                from: 'h1',
                to: 'e1',
                type: MoveType.QUIET
            },
            expected: 'Qh1e1'
        },
        {
            fen: '1k1r3r/8/8/R7/4Q2Q/8/8/RK2p2Q w - - 0 1',
            move: {
                from: 'h4',
                to: 'e1',
                type: MoveType.CAPTURE
            },
            expected: 'Qh4xe1'
        },
        {
            fen: '1k1r3r/8/8/R7/4Q2Q/8/8/RK2p2Q w - - 0 1',
            move: {
                from: 'e4',
                to: 'e1',
                type: MoveType.CAPTURE
            },
            expected: 'Qe4xe1'
        },

        // Move decorations
        {
            fen: 'k7/4R3/8/8/8/8/4r3/K7 w - - 0 1',
            move: {
                from: 'e7',
                to: 'e8',
                type: MoveType.QUIET
            },
            expected: 'Re8+'
        },
        {
            fen: 'k7/4R3/8/8/8/8/4r3/K7 b - - 0 1',
            move: {
                from: 'e2',
                to: 'e1',
                type: MoveType.QUIET
            },
            expected: 'Re1+'
        },
        {
            fen: 'r2q1r1k/ppp5/3b1pQ1/3n2N1/8/N1PPPP2/PP2K2P/R1R5 w - - 1 21',
            move: {
                from: 'g6',
                to: 'h7',
                type: MoveType.QUIET
            },
            expected: 'Qh7#'
        },
        {
            fen: 'r1bqk2r/ppp2ppp/2n5/P3P2n/8/PQp4P/4PPPB/R3KBNR b KQkq - 1 12',
            move: {
                from: 'd8',
                to: 'd2',
                type: MoveType.QUIET
            },
            expected: 'Qd2#'
        }
    ];

    it.each(cases)('should convert the move $move.from-$move.to to $expected', ({ fen, move, expected }) => {
        expect(encode(move, new Chess(fen))).toBe(expected);
    });
});
