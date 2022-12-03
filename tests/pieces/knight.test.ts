import Chess from '../../src/chess';
import generateMoves from '../../src/pieces/moves';

it('should move in L shape', () => {
    const chess = new Chess('');

    const piece = chess.place('N', 'e5');

    const possibleMoves = generateMoves(chess, { square: piece.square }).map(m => m.to);

    expect(possibleMoves).toHaveLength(8);
    expect(possibleMoves).toEqual(expect.arrayContaining([
        'd3', 'c4', 'c6', 'd7', 'f3', 'g4', 'f7', 'g6'
    ]));
});
