import ChessBoard from '../src/board/board';
import createPiece from '../src/factory';
import ChessBoardRenderer from '../src/render';

beforeAll(() => {
    process.env.NO_COLOR = '1';
    delete process.env.FORCE_COLOR;
});

it('should draw an empty board', () => {
    const board = new ChessBoard();
    const d = new ChessBoardRenderer(board);

    const str = d.render();

    expect(str).toEqual(
        '  ┌───┬───┬───┬───┬───┬───┬───┬───┐\n' +
        '8 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '7 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '6 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '5 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '4 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '3 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '2 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '1 │   │   │   │   │   │   │   │   │\n' +
        '  └───┴───┴───┴───┴───┴───┴───┴───┘\n' +
        '    a   b   c   d   e   f   g   h'
    )
});

it('should show where each piece is on the board', () => {
    const board = new ChessBoard();
    const d = new ChessBoardRenderer(board);

    board.place('a1', createPiece('P'));
    board.place('b2', createPiece('N'));
    board.place('c3', createPiece('Q'));
    board.place('d4', createPiece('B'));
    board.place('h8', createPiece('k'));
    board.place('g8', createPiece('q'));
    board.place('f8', createPiece('p'));

    const str = d.render();

    expect(str).toEqual(
        '  ┌───┬───┬───┬───┬───┬───┬───┬───┐\n' +
        '8 │   │   │   │   │   │ p │ q │ k │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '7 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '6 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '5 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '4 │   │   │   │ B │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '3 │   │   │ Q │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '2 │   │ N │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '1 │ P │   │   │   │   │   │   │   │\n' +
        '  └───┴───┴───┴───┴───┴───┴───┴───┘\n' +
        '    a   b   c   d   e   f   g   h'
    )
});

it('should modify how each piece is displayed', () => {
    const board = new ChessBoard();
    const d = new ChessBoardRenderer(board, {
        piece: piece => {
            if (!piece) {
                return '0';
            }

            return piece.color === 'white' ? piece.type.toUpperCase() : piece.type.toLowerCase();
        }
    });

    board.place('a1', createPiece('P'));
    board.place('b2', createPiece('N'));
    board.place('c3', createPiece('Q'));
    board.place('d4', createPiece('B'));
    board.place('h8', createPiece('k'));
    board.place('g8', createPiece('q'));
    board.place('f8', createPiece('p'));

    const str = d.render();

    expect(str).toEqual(
        '  ┌───┬───┬───┬───┬───┬───┬───┬───┐\n' +
        '8 │ 0 │ 0 │ 0 │ 0 │ 0 │ p │ q │ k │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '7 │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '6 │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '5 │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '4 │ 0 │ 0 │ 0 │ B │ 0 │ 0 │ 0 │ 0 │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '3 │ 0 │ 0 │ Q │ 0 │ 0 │ 0 │ 0 │ 0 │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '2 │ 0 │ N │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '1 │ P │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │\n' +
        '  └───┴───┴───┴───┴───┴───┴───┴───┘\n' +
        '    a   b   c   d   e   f   g   h'
    )
});

it('should modify how each rank is displayed', () => {
    const board = new ChessBoard();
    const d = new ChessBoardRenderer(board, {
        rank: () => '0'
    });

    const str = d.render();

    expect(str).toEqual(
        '  ┌───┬───┬───┬───┬───┬───┬───┬───┐\n' +
        '0 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '0 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '0 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '0 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '0 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '0 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '0 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '0 │   │   │   │   │   │   │   │   │\n' +
        '  └───┴───┴───┴───┴───┴───┴───┴───┘\n' +
        '    a   b   c   d   e   f   g   h'
    )
});
