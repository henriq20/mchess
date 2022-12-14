import Chess from '../../src/chess';
import generateMoves from '../../src/pieces/moves';

it('should move in all directions', () => {
    const chess = new Chess('');

    const piece = chess.place('Q', 'e5');

    const possibleMoves = generateMoves(chess, { square: piece.square }).map(m => m.to);

    expect(possibleMoves).toHaveLength(27);
    expect(possibleMoves).toEqual(expect.arrayContaining([
        'a1', 'b2', 'c3', 'd4',
        'f4', 'g3', 'h2',
        'd6', 'c7', 'b8',
        'f6', 'g7', 'h8',
        'd5', 'c5', 'b5', 'a5',
        'f5', 'g5', 'h5',
        'e4', 'e3', 'e2', 'e1',
        'e6', 'e7', 'e8'
    ]));
});
