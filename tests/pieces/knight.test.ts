import Knight from '../../src/pieces/knight';
import ChessBoard from '../../src/board';

it('should move in L shape', () => {
    const board = new ChessBoard();
    const knight = new Knight('white');

    board.place(4, 4, knight); // e5

    const possibleMoves = knight.possibleMoves();

    expect(possibleMoves).toHaveLength(8);
    expect(possibleMoves.map(s => s.name)).toEqual(expect.arrayContaining([
        'd3', 'c4', 'c6', 'd7', 'f3', 'g4', 'f7', 'g6'
    ]));
});
