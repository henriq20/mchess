import Chess from '../../src/chess';

it('should move diagonally', () => {
    const chess = new Chess('');

    const piece = chess.place('b', 'e5');

    const possibleMoves = piece?.possibleMoves();

    expect(possibleMoves).toHaveLength(13);
    expect(possibleMoves).toEqual(expect.arrayContaining([
        'd6', 'c7', 'b8',
        'f4', 'g3', 'h2',
        'd4', 'c3', 'b2', 'a1',
        'f6', 'g7', 'h8'
    ]));
});
