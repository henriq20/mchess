import Chess from '../../src/chess';

it('should move up to one square in any direction', () => {
    const chess = new Chess(() => {});

    const piece = chess.place('k', 'e5');

    const possibleMoves = piece?.possibleMoves();

    expect(possibleMoves).toHaveLength(8);
    expect(possibleMoves?.map(s => s.name)).toEqual(expect.arrayContaining([
        'e4', 'd4', 'f4', 'd5', 'f5', 'd6', 'e6', 'f6'
    ]));
});
