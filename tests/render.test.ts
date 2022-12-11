import ChessBoard from '../src/board/board';
import ChessBoardRenderer from '../src/render';
import { createPiece } from '../src/pieces/piece';

beforeAll(() => {
    process.env.NO_COLOR = '1';
    delete process.env.FORCE_COLOR;
});

it('should draw an empty board', () => {
    const board = new ChessBoard();
    const renderer = new ChessBoardRenderer(board);

    const str = renderer.render();

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
    const renderer = new ChessBoardRenderer(board);

    board.place(createPiece('P'), 'a1');
    board.place(createPiece('N'), 'b2');
    board.place(createPiece('Q'), 'c3');
    board.place(createPiece('B'), 'd4');
    board.place(createPiece('k'), 'h8');
    board.place(createPiece('q'), 'g8');
    board.place(createPiece('p'), 'f8');

    const str = renderer.render();

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
    const renderer = new ChessBoardRenderer(board);

    board.place(createPiece('P'), 'a1');
    board.place(createPiece('N'), 'b2');
    board.place(createPiece('Q'), 'c3');
    board.place(createPiece('B'), 'd4');
    board.place(createPiece('k'), 'h8');
    board.place(createPiece('q'), 'g8');
    board.place(createPiece('p'), 'f8');

    const str = renderer.render({
        square: square => {
            if (!square.piece) {
                return '0';
            }

            return square.piece.symbol;
        }
    });

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
    );
});

it('should modify how each rank is displayed', () => {
    const board = new ChessBoard();
    const renderer = new ChessBoardRenderer(board);

    const str = renderer.render({
        rank: () => '0'
    });

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
