import Chess from '../../src/chess';

it('should move up to one square in any direction', () => {
    const chess = new Chess('');

    const piece = chess.place('k', 'e5');

    const possibleMoves = piece?.possibleMoves(chess);

    expect(possibleMoves).toHaveLength(8);
    expect(possibleMoves).toEqual(expect.arrayContaining([
        'e4', 'd4', 'f4', 'd5', 'f5', 'd6', 'e6', 'f6'
    ]));
});

it('should be able to castle kingside', () => {
    const chess = new Chess('4k2r/8/8/8/8/8/8/4K2R w Kk - 1 1');

    const whiteKing = chess.piece('e1');
    const blackKing = chess.piece('e8');

    const whiteMoves = whiteKing?.possibleMoves(chess);
    const blackMoves = blackKing?.possibleMoves(chess);

    expect(whiteMoves).toHaveLength(6);
    expect(blackMoves).toHaveLength(6);

    expect(whiteMoves).toEqual(expect.arrayContaining([
        'd1', 'd2', 'e2', 'f2', 'f1', 'g1'
    ]));
    expect(blackMoves).toEqual(expect.arrayContaining([
        'd8', 'd7', 'e7', 'f7', 'f8', 'g8'
    ]));
});

it('should be able to castle queenside', () => {
    const chess = new Chess('r3k3/8/8/8/8/8/8/R3K3 w Qq - 1 1');

    const whiteKing = chess.piece('e1');
    const blackKing = chess.piece('e8');

    const whiteMoves = whiteKing?.possibleMoves(chess);
    const blackMoves = blackKing?.possibleMoves(chess);

    expect(whiteMoves).toHaveLength(6);
    expect(blackMoves).toHaveLength(6);

    expect(whiteMoves).toEqual(expect.arrayContaining([
        'd1', 'f1', 'd2', 'e2', 'f2', 'c1'
    ]));
    expect(blackMoves).toEqual(expect.arrayContaining([
        'd8', 'f8', 'd7', 'e7', 'f7', 'c8'
    ]));
});

it('should not be able to castle if there are pieces between king and rook', () => {
    const chess = new Chess('r2qkb1r/8/8/8/8/8/8/R2QKB1R w KQkq - 1 1');

    const whiteKing = chess.piece('e1');
    const blackKing = chess.piece('e8');

    const whiteMoves = whiteKing?.possibleMoves(chess);
    const blackMoves = blackKing?.possibleMoves(chess);

    expect(whiteMoves).toHaveLength(3);
    expect(blackMoves).toHaveLength(3);

    expect(whiteMoves).toEqual(expect.arrayContaining([
        'd2', 'e2', 'f2'
    ]));
    expect(blackMoves).toEqual(expect.arrayContaining([
        'd7', 'e7', 'f7'
    ]));
});
