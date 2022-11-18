import Queen from '../../src/pieces/queen';
import ChessBoard from '../../src/board';

it('should move in all directions', () => {
    const board = new ChessBoard();
    const queen = new Queen('white');

    board.place(4, 4, queen); // e5

    const possibleMoves = queen.possibleMoves();

    expect(possibleMoves).toHaveLength(27);
    expect(possibleMoves.map(s => s.name)).toEqual(expect.arrayContaining([
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
