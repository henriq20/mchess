import Chess from '../../src/chess';

it('should move in L shape', () => {
    const chess = new Chess('');

    const piece = chess.place('n', 'e5');

    const possibleMoves = piece?.possibleMoves();

    expect(possibleMoves).toHaveLength(8);
    expect(possibleMoves).toEqual(expect.arrayContaining([
        'd3', 'c4', 'c6', 'd7', 'f3', 'g4', 'f7', 'g6'
    ]));
});
