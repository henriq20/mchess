import Square from '../src/square';
import ChessBoard, { Direction } from '../src/board';
import createPiece from '../src/factory';
import { ChessPosition, toArrayPosition } from '../src/position';

describe('constructor', () => {
    it('should create an empty board', () => {
        const board = new ChessBoard();

        expect(board.size).toBe(8);
        expect(board._board).toHaveLength(8);
        expect(board._board.every(row => row.length === 8)).toBe(true);
    });

    it('should fill the board with squares', () => {
        const board = new ChessBoard();

        expect(board._board.every(row => row.every(s => s instanceof Square))).toBe(true);
    });

    it('should name each square based on its position', () => {
        const board = new ChessBoard();

        const squares = [
            [ 'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1' ],
            [ 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2' ],
            [ 'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3' ],
            [ 'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4' ],
            [ 'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5' ],
            [ 'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6' ],
            [ 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7' ],
            [ 'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8' ]
        ];

        for (let i = 0; i < squares.length; i++) {
            const row = squares[i];

            expect(board._board[i].map(s => s.name)).toStrictEqual(row);
        }
    });

    it('should set each square row and column based on its position', () => {
        const board = new ChessBoard();

        const squares = [
            [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7] ],
            [ [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7] ],
            [ [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7] ],
            [ [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7] ],
            [ [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7] ],
            [ [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7] ],
            [ [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7] ],
            [ [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7] ]
        ];

        for (let i = 0; i < squares.length; i++) {
            const row = squares[i];

            expect(board._board[i].map(s => [ s.x, s.y ])).toStrictEqual(row);
        }
    });
});

describe('place', () => {
    it('should place a piece on the board', () => {
        const board = new ChessBoard();

        const pawn = createPiece('p');

        const result = board.place(0, 0, pawn);

        expect(result).toBe(true);
        expect(pawn.board).toEqual(board);
        expect(pawn.square).toBeTruthy();
        expect(pawn.square?.name).toBe('a1');
    });

    it('should return false when the piece was not added', () => {
        const board = new ChessBoard();

        const pawn = createPiece('p');

        expect(board.place(8, 0, pawn)).toBe(false);
        expect(board.place(0, 8, pawn)).toBe(false);
        expect(board.place(-1, 0, pawn)).toBe(false);
        expect(board.place(0, -1, pawn)).toBe(false);

        expect(board._board.every(row => row.every(s => !s.piece))).toBe(true);
    });
});

describe('get', () => {
    it('should get a piece', () => {
        const board = new ChessBoard();

        const whitePawn = createPiece('p');
        const blackPawn = createPiece('P');

        board.place(0, 0, whitePawn);
        board.place(5, 5, blackPawn);

        expect(board.get(0, 0)?.piece?.color).toBe('white');
        expect(board.get(5, 5)?.piece?.color).toBe('black');
    });

    it('should return null if the specified index is off bounds', () => {
        const board = new ChessBoard();

        expect(board.get(-1, 0)).toBe(null);
        expect(board.get(0, -1)).toBe(null);
        expect(board.get(8, 0)).toBe(null);
        expect(board.get(0, 8)).toBe(null);
    });
});

describe('remove', () => {
    it('should remove a piece from the board', () => {
        const board = new ChessBoard();

        const pawn = createPiece('p');

        board.place(0, 0, pawn);
        board.place(0, 1, pawn);
        board.place(1, 0, pawn);

        const removedPiece = board.remove(0, 1);

        expect(removedPiece?.square).toBe(null);
        expect(removedPiece?.board).toBe(null);

        expect(board.get(0, 0)).toBeTruthy();
        expect(board.get(1, 0)).toBeTruthy();
    });

    it('should return null if the index was off bounds', () => {
        const board = new ChessBoard();

        expect(board.remove(-1, 0)).toBe(null);
        expect(board.remove(0, -1)).toBe(null);
        expect(board.remove(8, 0)).toBe(null);
        expect(board.remove(0, 8)).toBe(null);
    });

    it('should return null if the piece does not exist', () => {
        const board = new ChessBoard();

        expect(board.remove(0, 0)).toBe(null);
        expect(board.remove(0, 7)).toBe(null);
    });
});

describe('clear', () => {
    it('should remove all pieces from the board', () => {
        const board = new ChessBoard();

        const whitePawn = createPiece('p');
        const blackPawn = createPiece('P');

        board.place(0, 0, whitePawn);
        board.place(0, 5, blackPawn);

        const removedPieces = board.clear();

        expect(board._board.every(row => row.every(s => !s.piece))).toBe(true);
        expect(removedPieces).toStrictEqual([ whitePawn, blackPawn ]);
    });
});

describe('traverse', () => {
    const cases: [ from: ChessPosition, direction: Direction, expected: ChessPosition[] ][] = [
        [ 'e5', 'top', [ 'e6', 'e7', 'e8' ] ],
        [ 'e5', 'bottom', [ 'e4', 'e3', 'e2', 'e1' ] ],
        [ 'e5', 'left', [ 'd5', 'c5', 'b5', 'a5' ] ],
        [ 'e5', 'right', [ 'f5', 'g5', 'h5' ] ],

        [ 'a8', 'top', [] ],
        [ 'a1', 'bottom', [] ],
        [ 'a1', 'left', [] ],
        [ 'h8', 'right', [] ],

        [ 'e5', 'diagonalBottomLeft', [ 'd4', 'c3', 'b2', 'a1' ] ],
        [ 'e5', 'diagonalBottomRight', [ 'f4', 'g3', 'h2' ] ],
        [ 'e5', 'diagonalTopLeft', [ 'd6', 'c7', 'b8' ] ],
        [ 'e5', 'diagonalTopRight', [ 'f6', 'g7', 'h8' ] ],

        [ 'a1', 'diagonalTopRight', [ 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8' ] ],
        [ 'h1', 'diagonalTopLeft', [ 'g2', 'f3', 'e4', 'd5', 'c6', 'b7', 'a8' ] ],
        [ 'h8', 'diagonalBottomLeft', [ 'g7', 'f6', 'e5', 'd4', 'c3', 'b2', 'a1' ] ],
        [ 'a8', 'diagonalBottomRight', [ 'b7', 'c6', 'd5', 'e4', 'f3', 'g2', 'h1'] ],

        [ 'a1', 'diagonalTopLeft', [] ],
        [ 'a1', 'diagonalBottomLeft', [] ],
        [ 'h1', 'diagonalTopRight', [] ],
        [ 'h1', 'diagonalBottomRight', [] ],
    ]
    it.each(cases)('should traverse the board in the specified direction', (from, direction, expected) => {
        const board = new ChessBoard();
        const squares: Square[] = [];

        const fromSquare = board.get(...toArrayPosition(from));

        if (!fromSquare) {
            return fail();
        }

        board.traverse(fromSquare, [ direction ], (square) => {
            squares.push(square);
            return false;
        });

        expect(squares.map(s => s.name)).toStrictEqual(expected);
    });
});
