import King from '../../src/pieces/king';
import ChessBoard from '../../src/board';

it('should move up to one square in any direction', () => {
    const board = new ChessBoard();
    const king = new King('white');

    board.place(4, 4, king); // e5

    const possibleMoves = king.possibleMoves();

    expect(possibleMoves).toHaveLength(8);
    expect(possibleMoves.map(s => s.name)).toEqual(expect.arrayContaining([
        'e4', 'd4', 'f4', 'd5', 'f5', 'd6', 'e6', 'f6'
    ]));
});
