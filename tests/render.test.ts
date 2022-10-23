import ChessBoard from '../src/board';
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

    board.place(0, 0, createPiece('p'));
    board.place(1, 1, createPiece('n'));
    board.place(2, 2, createPiece('q'));
    board.place(3, 3, createPiece('b'));
    board.place(7, 7, createPiece('K'));
    board.place(7, 6, createPiece('Q'));
    board.place(7, 5, createPiece('P'));

    const str = d.render();

    expect(str).toEqual(
        '  ┌───┬───┬───┬───┬───┬───┬───┬───┐\n' +
        '8 │   │   │   │   │   │ P │ Q │ K │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '7 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '6 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '5 │   │   │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '4 │   │   │   │ b │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '3 │   │   │ q │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '2 │   │ n │   │   │   │   │   │   │\n' +
        '  ├───┼───┼───┼───┼───┼───┼───┼───┤\n' +
        '1 │ p │   │   │   │   │   │   │   │\n' +
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

            return piece.color === 'white' ? piece.letter.toUpperCase() : piece.letter.toLowerCase();
        }
    });

    board.place(0, 0, createPiece('p'));
    board.place(1, 1, createPiece('n'));
    board.place(2, 2, createPiece('q'));
    board.place(3, 3, createPiece('b'));
    board.place(7, 7, createPiece('K'));
    board.place(7, 6, createPiece('Q'));
    board.place(7, 5, createPiece('P'));

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
        rank: rank => '0'
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