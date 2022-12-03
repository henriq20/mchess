import Chess from '../../src/chess';
import generateMoves from '../../src/pieces/moves';

it('should move horizontally and vertically', () => {
    const chess = new Chess('');

    const piece = chess.place('R', 'e5');

    const possibleMoves = generateMoves(chess, { square: piece.square }).map(m => m.to);

    expect(possibleMoves).toHaveLength(14);
    expect(possibleMoves).toEqual(expect.arrayContaining([
        'd5', 'c5', 'b5', 'a5', // left
        'e6', 'e7', 'e8', // top
        'f5', 'g5', 'h5', // right
        'e4', 'e3', 'e2', 'e1' // bottom
    ]));
});
