import Chess from '../../src/chess';
import Pawn from '../../src/pieces/pawn';
import Square from '../../src/square';

let chess = new Chess('');

afterEach(() => {
    chess = new Chess('');
});

it('should be able to move one square forward', () => {
    const whitePawn = chess.place('P', 'a1');
    const blackPawn = chess.place('p', 'a8');

    expect(whitePawn?.canMove('a2')).toBe(true);
    expect(blackPawn?.canMove('a7')).toBe(true);
});

it('should be able to move two squares forward', () => {
    const pawn = chess.place('P', 'a1');

    expect(pawn?.canMove(chess.square('a3') as Square)).toBe(true);
});

it('should not be able to move two squares forward when it has already moved once', () => {
    const pawn = chess.place('P', 'a1') as Pawn;

    pawn.moves++;

    expect(pawn.canMove('a3')).toBe(false);
});

it('should be able to capture a piece diagonally to the left', () => {
    const whitePawn = chess.place('P', 'd2');
    chess.place('p', 'c3');

    expect(whitePawn?.canMove('c3')).toBe(true);
});

it('should be able to capture a piece diagonally to the right', () => {
    const whitePawn = chess.place('P', 'd2');
    chess.place('p', 'e3');

    expect(whitePawn?.canMove('e3')).toBe(true);
});
