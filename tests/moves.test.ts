import Chess from '../src/chess';
import { MoveType } from '../src/move';
import generateMoves from '../src/pieces/moves';
import { ChessPosition } from '../src/pieces/piece';

let chess = new Chess();

afterEach(() => {
    chess.reset();
});

describe('quiet', () => {
    it('should get all pseudo-legal moves', () => {
        const moves = generateMoves(chess);

        expect(moves).toHaveLength(20);
        expect(moves).toEqual(expect.arrayContaining([
            { from: 'a2', to: 'a4', type: MoveType.QUIET },
            { from: 'a2', to: 'a3', type: MoveType.QUIET },
            { from: 'b2', to: 'b3', type: MoveType.QUIET },
            { from: 'b2', to: 'b4', type: MoveType.QUIET },
            { from: 'c2', to: 'c3', type: MoveType.QUIET },
            { from: 'c2', to: 'c4', type: MoveType.QUIET },
            { from: 'd2', to: 'd3', type: MoveType.QUIET },
            { from: 'd2', to: 'd4', type: MoveType.QUIET },
            { from: 'e2', to: 'e3', type: MoveType.QUIET },
            { from: 'e2', to: 'e4', type: MoveType.QUIET },
            { from: 'f2', to: 'f3', type: MoveType.QUIET },
            { from: 'f2', to: 'f4', type: MoveType.QUIET },
            { from: 'g2', to: 'g3', type: MoveType.QUIET },
            { from: 'g2', to: 'g4', type: MoveType.QUIET },
            { from: 'h2', to: 'h3', type: MoveType.QUIET },
            { from: 'h2', to: 'h4', type: MoveType.QUIET },
            { from: 'b1', to: 'a3', type: MoveType.QUIET },
            { from: 'b1', to: 'c3', type: MoveType.QUIET },
            { from: 'g1', to: 'f3', type: MoveType.QUIET },
            { from: 'g1', to: 'h3', type: MoveType.QUIET }
        ]));
    });

    it('should get all pseudo-legal moves for the specified color', () => {
        const moves = generateMoves(chess, { color: 'black' });

        expect(moves).toHaveLength(20);
        expect(moves).toEqual(expect.arrayContaining([
            { from: 'b8', to: 'a6', type: MoveType.QUIET },
            { from: 'b8', to: 'c6', type: MoveType.QUIET },
            { from: 'g8', to: 'f6', type: MoveType.QUIET },
            { from: 'g8', to: 'h6', type: MoveType.QUIET },
            { from: 'a7', to: 'a6', type: MoveType.QUIET },
            { from: 'a7', to: 'a5', type: MoveType.QUIET },
            { from: 'b7', to: 'b6', type: MoveType.QUIET },
            { from: 'b7', to: 'b5', type: MoveType.QUIET },
            { from: 'c7', to: 'c6', type: MoveType.QUIET },
            { from: 'c7', to: 'c5', type: MoveType.QUIET },
            { from: 'd7', to: 'd6', type: MoveType.QUIET },
            { from: 'd7', to: 'd5', type: MoveType.QUIET },
            { from: 'e7', to: 'e6', type: MoveType.QUIET },
            { from: 'e7', to: 'e5', type: MoveType.QUIET },
            { from: 'f7', to: 'f6', type: MoveType.QUIET },
            { from: 'f7', to: 'f5', type: MoveType.QUIET },
            { from: 'g7', to: 'g6', type: MoveType.QUIET },
            { from: 'g7', to: 'g5', type: MoveType.QUIET },
            { from: 'h7', to: 'h6', type: MoveType.QUIET },
            { from: 'h7', to: 'h5', type: MoveType.QUIET }
        ]));
    });
});

describe('capture', () => {
    it('should set the move type to CAPTURE when piece can capture', () => {
        chess = new Chess('k7/8/5p2/B2N4/1p5R/P1P1n3/8/1Q5K w - - 0 1');

        const moves = generateMoves(chess).filter(m => m.type === MoveType.CAPTURE);

        expect(moves).toHaveLength(8);
        expect(moves).toEqual(expect.arrayContaining([
            { from: 'a5', to: 'b4', type: MoveType.CAPTURE },
            { from: 'd5', to: 'f6', type: MoveType.CAPTURE },
            { from: 'd5', to: 'b4', type: MoveType.CAPTURE },
            { from: 'd5', to: 'e3', type: MoveType.CAPTURE },
            { from: 'h4', to: 'b4', type: MoveType.CAPTURE },
            { from: 'a3', to: 'b4', type: MoveType.CAPTURE },
            { from: 'c3', to: 'b4', type: MoveType.CAPTURE },
            { from: 'b1', to: 'b4', type: MoveType.CAPTURE }
        ]));
    });
});

describe('en passant', () => {
    const cases: Array<{ fen: string, move: { from: ChessPosition, to: ChessPosition } }> = [
        // White En passant to the left
        { fen: 'k7/3p4/8/4P3/8/8/8/K7 b - - 0 2', move: { from: 'd7', to: 'd5' } },

        // White En passant to the right
        { fen: 'k7/5p2/8/4P3/8/8/8/K7 b - - 0 2', move: { from: 'f7', to: 'f5' } },

        // Black En passant to the left
        { fen: 'k7/8/8/8/3p4/8/2P5/K7 w - - 0 2', move: { from: 'c2', to: 'c4' } },

        // Black En passant to the right
        { fen: 'k7/8/8/8/3p4/8/4P3/K7 w - - 0 2', move: { from: 'e2', to: 'e4' } }
    ];

    it.each(cases)('should set the move type to EN_PASSANT', ({ fen, move }) => {
        chess = new Chess(fen);

        chess.move(move);

        const moves = generateMoves(chess).filter(m => m.type === MoveType.EN_PASSANT);

        expect(moves).toHaveLength(1);
    });
});

describe('castling', () => {
    it('should set the move type to KINGSIDE_CASTLE', () => {
        chess = new Chess('4k2r/8/8/8/8/8/8/4K2R w Kk - 1 1');

        const whiteMoves = generateMoves(chess, { color: 'white' }).filter(m => m.type === MoveType.KINGSIDE_CASTLE);
        const blackMoves = generateMoves(chess, { color: 'black' }).filter(m => m.type === MoveType.KINGSIDE_CASTLE);

        expect(whiteMoves).toHaveLength(1);
        expect(blackMoves).toHaveLength(1);

        expect(whiteMoves).toStrictEqual([
            { from: 'e1', to: 'g1', type: MoveType.KINGSIDE_CASTLE }
        ]);
        expect(blackMoves).toStrictEqual([
            { from: 'e8', to: 'g8', type: MoveType.KINGSIDE_CASTLE }
        ]);
    });

    it('should set the move type to QUEENSIDE_CASTLE', () => {
        chess = new Chess('r3k3/8/8/8/8/8/8/R3K3 w Qq - 1 1');

        const whiteMoves = generateMoves(chess, { color: 'white' }).filter(m => m.type === MoveType.QUEENSIDE_CASTLE);
        const blackMoves = generateMoves(chess, { color: 'black' }).filter(m => m.type === MoveType.QUEENSIDE_CASTLE);

        expect(whiteMoves).toHaveLength(1);
        expect(blackMoves).toHaveLength(1);

        expect(whiteMoves).toStrictEqual([
            { from: 'e1', to: 'c1', type: MoveType.QUEENSIDE_CASTLE }
        ]);
        expect(blackMoves).toStrictEqual([
            { from: 'e8', to: 'c8', type: MoveType.QUEENSIDE_CASTLE }
        ]);
    });

    it('should not be able to castle if king has moved', () => {
        chess = new Chess('r2k3r/8/8/8/8/8/8/R2K3R w KkQq - 1 1');

        const whiteMoves = generateMoves(chess, { color: 'white' });
        const blackMoves = generateMoves(chess, { color: 'black' });
        const moves = [ ...whiteMoves, ...blackMoves ];

        expect(moves.filter(m => m.type === MoveType.KINGSIDE_CASTLE || m.type === MoveType.QUEENSIDE_CASTLE)).toHaveLength(0);
    });

    it('should not be able to castle if there is no rook', () => {
        chess = new Chess('3k4/8/8/8/8/8/8/3K4 w KkQq - 1 1');

        const whiteMoves = generateMoves(chess, { color: 'white' });
        const blackMoves = generateMoves(chess, { color: 'black' });
        const moves = [ ...whiteMoves, ...blackMoves ];

        expect(moves.filter(m => m.type === MoveType.KINGSIDE_CASTLE || m.type === MoveType.QUEENSIDE_CASTLE)).toHaveLength(0);
    });

    it('should not be able to castle if there are pieces between', () => {
        chess = new Chess('r1qk1b1r/8/8/8/8/8/8/R1QK1B1R w KkQq - 1 1');

        const whiteMoves = generateMoves(chess, { color: 'white' });
        const blackMoves = generateMoves(chess, { color: 'black' });
        const moves = [ ...whiteMoves, ...blackMoves ];

        expect(moves.filter(m => m.type === MoveType.KINGSIDE_CASTLE || m.type === MoveType.QUEENSIDE_CASTLE)).toHaveLength(0);
    });
});

describe('promotion', () => {
    it('should set the move type to PAWN_PROMOTION', () => {
        chess = new Chess('k7/4P3/8/8/8/8/3p4/K7 w - - 0 2');

        const moves = generateMoves(chess).filter(m => m.type === MoveType.PAWN_PROMOTION);

        expect(moves).toHaveLength(1);
        expect(moves).toStrictEqual([
            { from: 'e7', to: 'e8', type: MoveType.PAWN_PROMOTION }
        ]);
    });

    it('should set the move type to PAWN_PROMOTION when capturing on the first/last rank', () => {
        chess = new Chess('k4p2/4P3/8/8/8/8/3p4/K3P3 w - - 0 2');

        const moves = generateMoves(chess).filter(m => m.type === MoveType.PAWN_PROMOTION);

        expect(moves).toHaveLength(2);
        expect(moves).toStrictEqual([
            { from: 'e7', to: 'e8', type: MoveType.PAWN_PROMOTION },
            { from: 'e7', to: 'f8', type: MoveType.PAWN_PROMOTION }
        ]);
    });
});
