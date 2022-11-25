import Chess from '../../src/chess';
import Pawn from '../../src/pieces/pawn';

let chess = new Chess('');

afterEach(() => {
    chess = new Chess('');
});

it('should be able to move one square forward', () => {
    const whitePawn = chess.place('P', 'a1');
    const blackPawn = chess.place('p', 'a8');

    expect(chess.canMove(whitePawn, 'a2')).toBe(true);
    expect(chess.canMove(blackPawn, 'a7')).toBe(true);
});

it('should be able to move two squares forward', () => {
    const whitePawn = chess.place('P', 'a2');
    const blackPawn = chess.place('p', 'a7');

    expect(chess.canMove(whitePawn, 'a4')).toBe(true);
    expect(chess.canMove(blackPawn, 'a5')).toBe(true);
});

it('should not be able to move two squares forward when it has already moved once', () => {
    const pawn = chess.place('P', 'a3') as Pawn;

    expect(chess.canMove(pawn, 'a5')).toBe(false);
});

it('should be able to capture a piece diagonally to the left', () => {
    const whitePawn = chess.place('P', 'd2');
    chess.place('p', 'c3');

    expect(chess.canMove(whitePawn, 'c3')).toBe(true);

});

it('should be able to capture a piece diagonally to the right', () => {
    const whitePawn = chess.place('P', 'd2');
    chess.place('p', 'e3');

    expect(chess.canMove(whitePawn, 'e3')).toBe(true);
});

it('should be able to en passant to the left', () => {
    chess = new Chess('k7/3p4/8/4P3/8/8/8/K7 b - - 0 2');

    chess.move({
        from: 'd7',
        to: 'd5'
    });

    const whitePawn = chess.piece('e5');

    if (!whitePawn) {
        return fail();
    }

    expect(chess.canMove(whitePawn, 'd6')).toBe(true);
});

it('should be able to en passant to the right', () => {
    chess = new Chess('k7/5p2/8/4P3/8/8/8/K7 b - - 0 2');

    chess.move({
        from: 'f7',
        to: 'f5'
    });

    const whitePawn = chess.piece('e5');

    if (!whitePawn) {
        return fail();
    }

    expect(chess.canMove(whitePawn, 'f6')).toBe(true);
});

it('should not be able to en passant if last move was not of a pawn', () => {
    chess = new Chess('k7/3p4/8/4P3/8/8/8/K7 b - - 0 2');

    chess.move({
        from: 'd7',
        to: 'd5'
    });

    chess.move({
        from: 'a1',
        to: 'a2'
    });

    chess.move({
        from: 'a8',
        to: 'a7'
    });

    const whitePawn = chess.piece('e5');

    if (!whitePawn) {
        return fail();
    }

    expect(chess.canMove(whitePawn, 'd6')).toBe(false);
});

it('should not be able to en passant if last move was of another pawn', () => {
    chess = new Chess('k7/3p4/8/4P3/8/8/8/K7 b - - 0 2');

    chess.move({
        from: 'c7',
        to: 'c5'
    });

    const whitePawn = chess.piece('e5');

    if (!whitePawn) {
        return fail();
    }

    expect(chess.canMove(whitePawn, 'd6')).toBe(false);
});
