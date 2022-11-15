import Rook from '../../src/pieces/rook';
import ChessBoard from '../../src/board';

it('should move horizontally and vertically', () => {
    const board = new ChessBoard();
    const rook = new Rook('white');

    board.place(4, 4, rook); // e5

    const possibleMoves = rook.possibleMoves();

    expect(possibleMoves).toHaveLength(14);
    expect(possibleMoves.map(s => s.name)).toEqual(expect.arrayContaining([
        'd5', 'c5', 'b5', 'a5', // left
        'e6', 'e7', 'e8', // top
        'f5', 'g5', 'h5', // right
        'e4', 'e3', 'e2', 'e1' // bottom
    ]));
});
