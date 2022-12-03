import Chess from '../src/chess';
import makeMove, { MoveType } from '../src/move';
import { ChessPosition } from '../src/pieces/piece';

describe('quiet', () => {
    it('should move a piece', () => {
        const chess = new Chess();

        makeMove(chess, {
            from: 'e2',
            to: 'e4',
            type: MoveType.QUIET
        });

        expect(chess.piece('e2')).toBe(null);
        expect(chess.piece('e4')?.type).toBe('p');
    });

    it('should return the correct result', () => {
        const chess = new Chess();

        const move = makeMove(chess, {
            from: 'e2',
            to: 'e4',
            type: MoveType.QUIET
        });

        expect(move).toBeTruthy();
        expect(move.result).toMatchObject({
            type: MoveType.QUIET,
            from: 'e2',
            to: 'e4'
        });
    });

    it('should add the move to the history', () => {
        const chess = new Chess();

        const move = makeMove(chess, {
            from: 'e2',
            to: 'e4',
            type: MoveType.QUIET
        });

        expect(chess.history).toHaveLength(1);
        expect(chess.history[0]).toBe(move);
    });
});

describe('capture', () => {
    it('should capture a piece', () => {
        const chess = new Chess();

        chess.place('p', 'e3');

        makeMove(chess, {
            from: 'd2',
            to: 'e3',
            type: MoveType.CAPTURE
        });

        expect(chess.piece('d2')).toBe(null);
        expect(chess.piece('e3')?.color).toBe('white');
    });

    it('should return the correct result after a capture', () => {
        const chess = new Chess();

        const capturedPiece = chess.place('p', 'e3');

        const move = makeMove(chess, {
            from: 'd2',
            to: 'e3',
            type: MoveType.CAPTURE
        });

        expect(move).toBeTruthy();
        expect(move.result).toMatchObject({
            type: MoveType.CAPTURE,
            from: 'd2',
            to: 'e3',
            capturedPiece
        });
    });
});

describe('promotion', () => {
    it('should promote a white pawn', () => {
        const chess = new Chess('k7/4P3/8/8/8/8/5p2/K7 w - - 0 2');

        const move = makeMove(chess, {
            from: 'e7',
            to: 'e8',
            promoteTo: 'q',
            type: MoveType.PAWN_PROMOTION
        });

        expect(move.result.promotedTo).toBe('q');
        expect(move.result.type).toBe(MoveType.PAWN_PROMOTION);
        expect(chess.piece('e8')?.type).toBe('q');
        expect(chess.piece('e8')?.color).toBe('white');
        expect(chess.piece('e8')?.square).toBe('e8');
    });

    it('should promote a black pawn', () => {
        const chess = new Chess('k7/4P3/8/8/8/8/5p2/K7 b - - 0 2');

        const move = makeMove(chess, {
            from: 'f2',
            to: 'f1',
            promoteTo: 'q',
            type: MoveType.PAWN_PROMOTION
        });

        expect(move.result.promotedTo).toBe('q');
        expect(move.result.type).toBe(MoveType.PAWN_PROMOTION);
        expect(chess.piece('f1')?.type).toBe('q');
        expect(chess.piece('f1')?.color).toBe('black');
        expect(chess.piece('f1')?.square).toBe('f1');
    });

    it('should promote to queen by default', () => {
        const chess = new Chess('k7/4P3/8/8/8/8/5p2/K7 w - - 0 2');

        const move = makeMove(chess, {
            from: 'e7',
            to: 'e8',
            type: MoveType.PAWN_PROMOTION
        });

        expect(move.result.promotedTo).toBe('q');
        expect(chess.piece('e8')?.type).toBe('q');
    });

    it('should promote to another piece', () => {
        const chess = new Chess('k7/4P3/8/8/8/8/5p2/K7 w - - 0 2');

        const move = makeMove(chess, {
            from: 'e7',
            to: 'e8',
            promoteTo: 'r',
            type: MoveType.PAWN_PROMOTION
        });

        expect(move.result.promotedTo).toBe('r');
        expect(chess.piece('e8')?.type).toBe('r');
    });

    it('should capture and promote', () => {
        const chess = new Chess('k4n2/4P3/8/8/8/8/5p2/K7 w - - 0 2');

        const move = makeMove(chess, {
            from: 'e7',
            to: 'f8',
            promoteTo: 'r',
            type: MoveType.PAWN_PROMOTION
        });

        expect(move.result.capturedPiece).toBeTruthy();
        expect(move.result.capturedPiece?.type).toBe('n');
        expect(move.result.promotedTo).toBe('r');
        expect(chess.piece('f8')?.type).toBe('r');
    });
});

describe('enPassant', () => {
    it('should be able to en passant', () => {
        const chess = new Chess('k7/3p4/8/4P3/8/8/8/K7 b - - 0 2');

        makeMove(chess, {
            from: 'd7',
            to: 'd5',
            type: MoveType.QUIET
        });

        const enPassantMove = makeMove(chess, {
            from: 'e5',
            to: 'd6',
            type: MoveType.EN_PASSANT
        });

        expect(enPassantMove.result.type).toBe(MoveType.EN_PASSANT);
        expect(enPassantMove.result.capturedPiece?.type).toBe('p');
        expect(enPassantMove.result.capturedPiece?.color).toBe('black');
        expect(chess.piece('d5')).toBe(null);
        expect(chess.piece('d6')?.type).toBe('p');
        expect(chess.piece('d6')?.color).toBe('white');
    });
});

describe('castling', () => {
    it('should be able to castle kingside', () => {
        const chess = new Chess('4k2r/8/8/8/8/8/8/4K2R w - - 0 1');

        const move = makeMove(chess, {
            from: 'e1',
            to: 'g1',
            type: MoveType.KINGSIDE_CASTLE
        });

        expect(move.result.type).toBe(MoveType.KINGSIDE_CASTLE);
        expect(move.result.piece?.type).toBe('k');
        expect(chess.piece('f1')?.type).toBe('r');
        expect(chess.piece('g1')?.type).toBe('k');
    });

    it('should be able to castle queenside', () => {
        const chess = new Chess('r3k3/8/8/8/8/8/8/R3K3 w Qq - 0 1');

        const move = makeMove(chess, {
            from: 'e1',
            to: 'c1',
            type: MoveType.QUEENSIDE_CASTLE
        });

        expect(move.result.type).toBe(MoveType.QUEENSIDE_CASTLE);
        expect(move.result.piece?.type).toBe('k');
        expect(chess.piece('d1')?.type).toBe('r');
        expect(chess.piece('c1')?.type).toBe('k');
    });
});

describe('invalid', () => {
    it('should return an invalid move when the `from` square does not have a piece', () => {
        const chess = new Chess();

        const move = makeMove(chess, {
            from: 'e3',
            to: 'e4',
            type: MoveType.QUIET
        });

        expect(move.result.type).toBe(MoveType.INVALID);
    });

    it('should an invalid move when the `from` square does not exist', () => {
        const chess = new Chess();

        const move = makeMove(chess, {
            from: 'e0' as ChessPosition,
            to: 'e4',
            type: MoveType.QUIET
        });

        expect(move.result.type).toBe(MoveType.INVALID);
    });

    it('should return an invalid move when the `to` square does not exist', () => {
        const chess = new Chess();

        const move = makeMove(chess, {
            from: 'e2',
            to: 'e0' as ChessPosition,
            type: MoveType.QUIET
        });

        expect(move.result.type).toBe(MoveType.INVALID);
    });
});

describe('undo', () => {
    it('should undo a move', () => {
        const chess = new Chess();

        const move = makeMove(chess, {
            from: 'e2',
            to: 'e4',
            type: MoveType.QUIET
        });

        move.undo();

        expect(chess.piece('e4')).toBe(null);
        expect(chess.piece('e2')?.type).toBe('p');
    });

    it('should undo a capture', () => {
        const chess = new Chess();

        chess.place('p', 'f3');

        const move = makeMove(chess, {
            from: 'e2',
            to: 'f3',
            type: MoveType.CAPTURE
        });

        move.undo();

        expect(chess.piece('f3')?.color).toBe('black');
        expect(chess.piece('e2')?.color).toBe('white');
    });

    it('should undo a pawn promotion', () => {
        const chess = new Chess('k7/4P3/8/8/8/8/5p2/K7 w - - 0 2');

        const move = makeMove(chess, {
            from: 'e7',
            to: 'e8',
            promoteTo: 'q',
            type: MoveType.PAWN_PROMOTION
        });

        move.undo();

        expect(chess.piece('e8')).toBe(null);
        expect(chess.piece('e7')?.type).toBe('p');
        expect(chess.piece('e7')?.square).toBe('e7');
        expect(chess.piece('e7')?.color).toBe('white');
    });

    it('should undo an en passant', () => {
        const chess = new Chess('k7/3p4/8/4P3/8/8/8/K7 b - - 0 2');

        makeMove(chess, {
            from: 'd7',
            to: 'd5',
            type: MoveType.QUIET
        });

        const enPassantMove = makeMove(chess, {
            from: 'e5',
            to: 'd6',
            type: MoveType.EN_PASSANT
        });

        enPassantMove.undo();

        expect(chess.piece('d5')?.type).toBe('p');
        expect(chess.piece('d5')?.color).toBe('black');
        expect(chess.piece('e5')?.type).toBe('p');
        expect(chess.piece('e5')?.color).toBe('white');
    });

    it('should undo kingside castle', () => {
        const chess = new Chess('4k2r/8/8/8/8/8/8/4K2R w - - 0 1');

        const move = makeMove(chess, {
            from: 'e1',
            to: 'g1',
            type: MoveType.KINGSIDE_CASTLE
        });

        move.undo();

        expect(chess.piece('e1')?.type).toBe('k');
        expect(chess.piece('h1')?.type).toBe('r');
        expect(chess.piece('f1')).toBe(null);
        expect(chess.piece('g1')).toBe(null);
    });

    it('should undo queenside castle', () => {
        const chess = new Chess('r3k3/8/8/8/8/8/8/R3K3 w Qq - 0 1');

        const move = makeMove(chess, {
            from: 'e1',
            to: 'c1',
            type: MoveType.QUEENSIDE_CASTLE
        });

        move.undo();

        expect(chess.piece('e1')?.type).toBe('k');
        expect(chess.piece('a1')?.type).toBe('r');
        expect(chess.piece('d1')).toBe(null);
        expect(chess.piece('c1')).toBe(null);
    });
});
