import move from '../src/move';
import Chess from '../src/chess';
import { ChessPosition } from '../src/position';

it('should move a piece', () => {
    const chess = new Chess();

    move(chess, {
        from: 'e2',
        to: 'e4'
    });

    expect(chess.piece('e2')).toBe(null);
    expect(chess.piece('e4')?.name).toBe('pawn');
});

it('should return the correct result', () => {
    const chess = new Chess();

    const result = move(chess, {
        from: 'e2',
        to: 'e4'
    });

    expect(result).toBeTruthy();
    expect(result).toMatchObject({
        from: 'e2',
        to: 'e4',
        piece: chess.piece('e4')
    });
});

it('should increase the number of movements', () => {
    const chess = new Chess();

    move(chess, {
        from: 'e2',
        to: 'e4'
    });

    expect(chess.piece('e4')?.moves).toBe(1);
});

it('should capture a piece', () => {
    const chess = new Chess();

    chess.place('P', 'e3');

    move(chess, {
        from: 'd2',
        to: 'e3'
    });

    expect(chess.black.size).toBe(16);
    expect(chess.piece('d2')).toBe(null);
    expect(chess.piece('e3')?.color).toBe('white');
});

it('should return the correct result after a capture', () => {
    const chess = new Chess();

    chess.place('P', 'e3');

    const result = move(chess, {
        from: 'd2',
        to: 'e3'
    });

    expect(result).toBeTruthy();
    expect(result).toMatchObject({
        from: 'd2',
        to: 'e3',
        piece: chess.piece('e3'),
        capturedPiece: 'pawn'
    });
});

it('should return false when the `from` square does not have a piece', () => {
    const chess = new Chess();

    const result = move(chess, {
        from: 'e3',
        to: 'e4'
    });

    expect(result).toBe(false);
});

it('should return false when the `from` square does not exist', () => {
    const chess = new Chess();

    const result = move(chess, {
        from: 'e0' as ChessPosition,
        to: 'e4'
    });

    expect(result).toBe(false);
});

it('should return false when the `to` square does not exist', () => {
    const chess = new Chess();

    const result = move(chess, {
        from: 'e2',
        to: 'e0' as ChessPosition
    });

    expect(result).toBe(false);
});

it('should return false when a piece cannot move to the target square', () => {
    const chess = new Chess();

    const result = move(chess, {
        from: 'e2',
        to: 'e5'
    });

    expect(result).toBe(false);
});
