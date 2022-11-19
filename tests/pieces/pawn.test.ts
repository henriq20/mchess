import Chess from '../../src/chess';
import Pawn from '../../src/pieces/pawn';
import Square from '../../src/square';

let chess = new Chess(() => {});

afterEach(() => {
    chess = new Chess(() => {});
});

it('should be able to move one square forward', () => {
    const whitePawn = chess.place('p', 'a1');
    const blackPawn = chess.place('P', 'a8');

    expect(whitePawn?.canMove(chess.square('a2') as Square)).toBe(true);
    expect(blackPawn?.canMove(chess.square('a7') as Square)).toBe(true);
});

it('should be able to move two squares forward', () => {
    const pawn = chess.place('p', 'a1');

    expect(pawn?.canMove(chess.square('a3') as Square)).toBe(true);
});

it('should not be able to move two squares forward when it has already moved once', () => {
    const pawn = chess.place('p', 'a1') as Pawn;

    pawn.moves++;

    expect(pawn.canMove(chess.square('a3') as Square)).toBe(false);
});

it('should be able to capture a piece diagonally to the left', () => {
    const whitePawn = chess.place('p', [ 1, 3 ]);
    chess.place('P', [ 2, 2 ]);

    expect(whitePawn?.canMove(chess.square([ 2, 2 ]) as Square)).toBe(true);
});

it('should be able to capture a piece diagonally to the right', () => {
    const whitePawn = chess.place('p', [ 1, 3 ]);
    chess.place('P', [ 2, 4 ]);

    expect(whitePawn?.canMove(chess.square([ 2, 4 ]) as Square)).toBe(true);
});
