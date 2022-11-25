import Chess from '../src/chess';
import makeMove, { MoveType } from '../src/move';
import { ChessPosition } from '../src/board/position';

describe('quiet', () => {
    it('should move a piece', () => {
        const chess = new Chess();

        makeMove(chess, {
            from: 'e2',
            to: 'e4'
        });

        expect(chess.piece('e2')).toBe(null);
        expect(chess.piece('e4')?.type).toBe('p');
    });

    it('should return the correct result', () => {
        const chess = new Chess();

        const move = makeMove(chess, {
            from: 'e2',
            to: 'e4'
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
            to: 'e4'
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
            to: 'e3'
        });

        expect(chess.black.size).toBe(16);
        expect(chess.piece('d2')).toBe(null);
        expect(chess.piece('e3')?.color).toBe('white');
    });

    it('should return the correct result after a capture', () => {
        const chess = new Chess();

        const capturedPiece = chess.place('p', 'e3');

        const move = makeMove(chess, {
            from: 'd2',
            to: 'e3'
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
            promoteTo: 'q'
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
            promoteTo: 'q'
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
            to: 'e8'
        });

        expect(move.result.promotedTo).toBe('q');
        expect(chess.piece('e8')?.type).toBe('q');
    });

    it('should promote to another piece', () => {
        const chess = new Chess('k7/4P3/8/8/8/8/5p2/K7 w - - 0 2');

        const move = makeMove(chess, {
            from: 'e7',
            to: 'e8',
            promoteTo: 'r'
        });

        expect(move.result.promotedTo).toBe('r');
        expect(chess.piece('e8')?.type).toBe('r');
    });

    it('should capture and promote', () => {
        const chess = new Chess('k4n2/4P3/8/8/8/8/5p2/K7 w - - 0 2');

        const move = makeMove(chess, {
            from: 'e7',
            to: 'f8',
            promoteTo: 'r'
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
            to: 'd5'
        });

        const enPassantMove = makeMove(chess, {
            from: 'e5',
            to: 'd6'
        });

        expect(enPassantMove.result.type).toBe(MoveType.EN_PASSANT);
        expect(enPassantMove.result.capturedPiece?.type).toBe('p');
        expect(enPassantMove.result.capturedPiece?.color).toBe('black');
        expect(chess.piece('d5')).toBe(null);
        expect(chess.piece('d6')?.type).toBe('p');
        expect(chess.piece('d6')?.color).toBe('white');
    });
});

describe('invalid', () => {
    it('should return an invalid move when the `from` square does not have a piece', () => {
        const chess = new Chess();

        const move = makeMove(chess, {
            from: 'e3',
            to: 'e4'
        });

        expect(move.result.type).toBe(MoveType.INVALID);
    });

    it('should an invalid move when the `from` square does not exist', () => {
        const chess = new Chess();

        const move = makeMove(chess, {
            from: 'e0' as ChessPosition,
            to: 'e4'
        });

        expect(move.result.type).toBe(MoveType.INVALID);
    });

    it('should return an invalid move when the `to` square does not exist', () => {
        const chess = new Chess();

        const move = makeMove(chess, {
            from: 'e2',
            to: 'e0' as ChessPosition
        });

        expect(move.result.type).toBe(MoveType.INVALID);
    });
});

describe('undo', () => {
    it('should undo a move', () => {
        const chess = new Chess();

        const move = makeMove(chess, {
            from: 'e2',
            to: 'e4'
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
            to: 'f3'
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
            promoteTo: 'q'
        });

        move.undo();

        expect(chess.piece('e8')).toBe(null);
        expect(chess.piece('e7')?.type).toBe('p');
        expect(chess.piece('e7')?.square).toBe('e7');
        expect(chess.piece('e7')?.color).toBe('white');
    });

    it('should undo an en passant', () => {
        const chess = new Chess('k7/3p4/8/4P3/8/8/8/K7 b - - 0 2');

        const move = makeMove(chess, {
            from: 'd7',
            to: 'd5'
        });

        move.undo();

        expect(chess.piece('d7')?.type).toBe('p');
        expect(chess.piece('d7')?.color).toBe('black');
        expect(chess.piece('e5')?.type).toBe('p');
        expect(chess.piece('e5')?.color).toBe('white');
    });
});

