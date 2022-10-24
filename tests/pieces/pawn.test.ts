import ChessBoard from '../../src/board';
import Pawn from '../../src/pieces/pawn';
import Square from '../../src/square';

const board = new ChessBoard();

afterEach(() => {
    board.clear();
});

it('should be able to move one square forward', () => {
    const whitePawn = new Pawn('white');
    const blackPawn = new Pawn('black');

    board.place(0, 0, whitePawn);
    board.place(7, 7, blackPawn);

    expect(whitePawn.canMove(board.get(1, 0) as Square)).toBe(true);
    expect(blackPawn.canMove(board.get(6, 7) as Square)).toBe(true);
});

it('should be able to move two squares forward', () => {
    const pawn = new Pawn('white');
    board.place(0, 0, pawn);

    expect(pawn.canMove(board.get(2, 0) as Square)).toBe(true);
});

it('should not be able to move two squares forward when it has already moved once', () => {
    const pawn = new Pawn('white');
    board.place(0, 0, pawn);

    pawn.moves++;

    expect(pawn.canMove(board.get(2, 0) as Square)).toBe(false);
});

it('should be able to capture a piece diagonally to the left', () => {
    const whitePawn = new Pawn('white');
    const blackPawn = new Pawn('black');

    board.place(1, 3, whitePawn);
    board.place(2, 2, blackPawn);

    expect(whitePawn.canMove(board.get(2, 2) as Square)).toBe(true);
});

it('should be able to capture a piece diagonally to the right', () => {
    const whitePawn = new Pawn('white');
    const blackPawn = new Pawn('black');

    board.place(1, 3, whitePawn);
    board.place(2, 4, blackPawn);

    expect(whitePawn.canMove(board.get(2, 4) as Square)).toBe(true);
});
