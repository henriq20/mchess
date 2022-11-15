import Bishop from '../../src/pieces/bishop';
import ChessBoard from '../../src/board';

it('should move diagonally', () => {
    const board = new ChessBoard();
    const bishop = new Bishop('white');

    board.place(4, 4, bishop); // e5

    const possibleMoves = bishop.possibleMoves();

    expect(possibleMoves).toHaveLength(13);
    expect(possibleMoves.map(s => s.name)).toEqual(expect.arrayContaining([
        'd6', 'c7', 'b8',
        'f4', 'g3', 'h2',
        'd4', 'c3', 'b2', 'a1',
        'f6', 'g7', 'h8'
    ]));
});
