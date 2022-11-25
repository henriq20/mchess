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

    const possibleMoves = whiteKing?.possibleMoves(chess);

    expect(possibleMoves).toHaveLength(6);
    expect(possibleMoves).toEqual(expect.arrayContaining([
        'd1', 'd2', 'e2', 'f2', 'f1', 'g1'
    ]));
});
