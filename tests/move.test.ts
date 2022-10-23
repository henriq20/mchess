import move from '../src/move';
import ChessBoard from '../src/board';
import createPiece from '../src/factory';

it('should move a piece', () => {
    const board = new ChessBoard();
    const pawn = createPiece('p');

    board.place(1, 3, pawn);

    move(board, {
        from: [ 1, 3 ],
        to: [ 2, 3 ]
    });

    expect(board.get(1, 3)?.piece).toBe(null);
    expect(board.get(2, 3)?.piece?.name).toBe('pawn');
});

it('should capture a piece', () => {
    const board = new ChessBoard();

    const whitePawn = createPiece('p');
    const blackPawn = createPiece('P');

    board.place(1, 3, whitePawn);
    board.place(2, 2, blackPawn);

    move(board, {
        from: [ 1, 3 ],
        to: [ 2, 2 ]
    });

    expect(board.get(1, 3)?.piece).toBe(null);
    expect(board.get(2, 2)?.piece?.color).toBe('white');
});

it('should return the result of a move', () => {
    const board = new ChessBoard();
    const pawn = createPiece('p');

    board.place(1, 3, pawn);

    const result = move(board, {
        from: [ 1, 3 ],
        to: [ 2, 3 ]
    });

    if (!result) {
        fail();
    }

    expect(result.from).toBe('d2');
    expect(result.to).toBe('d3');
    expect(result.piece.name).toBe('pawn');
    expect(result.capturedPiece).toBeFalsy();
});

it('should return the result of a capture', () => {
    const board = new ChessBoard();

    const whitePawn = createPiece('p');
    const blackPawn = createPiece('P');

    board.place(1, 3, whitePawn);
    board.place(2, 2, blackPawn);

    const result = move(board, {
        from: [ 1, 3 ],
        to: [ 2, 2 ]
    });

    if (!result) {
        fail();
    }

    expect(result.from).toBe('d2');
    expect(result.to).toBe('c3');
    expect(result.piece.name).toBe('pawn');
    expect(result.capturedPiece).toBe('pawn');
});

it('should return false when the `from` square does not have a piece', () => {
    const board = new ChessBoard();

    expect(move(board, { from: [ 0, 0 ], to: [ 1, 0 ] })).toBe(false);
});

it('should return false when the `from` square does not exist', () => {
    const board = new ChessBoard();

    expect(move(board, { from: [ -1, -1 ], to: [ 1, 0 ] })).toBe(false);
});

it('should return false when the `to` square does not exist', () => {
    const board = new ChessBoard();

    expect(move(board, { from: [ 0, 0 ], to: [ -1, -1 ] })).toBe(false);
});

it('should return false when a piece cannot move to the target square', () => {
    const board = new ChessBoard();
    const pawn = createPiece('p');

    board.place(1, 3, pawn);

    expect(move(board, { from: [ 1, 3 ], to: [ 4, 3 ] })).toBe(false);
});
