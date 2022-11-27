import Square from '../src/board/square';
import ChessBoard, { Direction } from '../src/board/board';
import createPiece from '../src/factory';
import { ChessPosition } from '../src/board/position';
import Pawn from '../src/pieces/pawn';

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
});

describe('place', () => {
    it('should place a piece on the board', () => {
        const board = new ChessBoard();

        const pawn = createPiece('p');

        const square = board.place('a1', pawn) as Square;

        expect(square).toBeTruthy();
        expect(square.empty).toBe(false);
        expect(square.piece).toBeInstanceOf(Pawn);
    });

    it('should return false when the piece was not added', () => {
        const board = new ChessBoard();

        const pawn = createPiece('p');

        expect(board.place('a0' as ChessPosition, pawn)).toBe(false);
        expect(board.place('h9' as ChessPosition, pawn)).toBe(false);

        expect(board._board.every(row => row.every(s => !s.piece))).toBe(true);
    });
});

describe('get', () => {
    it('should get a piece', () => {
        const board = new ChessBoard();

        const whitePawn = createPiece('P');
        const blackPawn = createPiece('p');

        board.place('a1', whitePawn);
        board.place('e5', blackPawn);

        expect(board.get('a1')?.piece?.color).toBe('white');
        expect(board.get('e5')?.piece?.color).toBe('black');
    });

    it('should return null if the specified index is off bounds', () => {
        const board = new ChessBoard();

        expect(board.get('a0' as ChessPosition)).toBe(null);
        expect(board.get('h9' as ChessPosition)).toBe(null);
    });
});

describe('remove', () => {
    it('should remove a piece from the board', () => {
        const board = new ChessBoard();

        const pawn = createPiece('p');

        board.place('a1', pawn);
        board.place('b1', pawn);
        board.place('a2', pawn);

        const removedPiece = board.remove('b1');

        expect(removedPiece).toBeInstanceOf(Pawn);
        expect(board.get('b1')?.piece).toBe(null);
        expect(board.get('a1')).toBeTruthy();
        expect(board.get('a2')).toBeTruthy();
    });

    it('should return null if the index was off bounds', () => {
        const board = new ChessBoard();

        expect(board.remove('a0' as ChessPosition)).toBe(null);
        expect(board.remove('h9' as ChessPosition)).toBe(null);
    });

    it('should return null if the piece does not exist', () => {
        const board = new ChessBoard();

        expect(board.remove('a1')).toBe(null);
        expect(board.remove('h7')).toBe(null);
    });
});

describe('clear', () => {
    it('should remove all pieces from the board', () => {
        const board = new ChessBoard();

        const whitePawn = createPiece('P');
        const blackPawn = createPiece('p');

        board.place('a1', whitePawn);
        board.place('h5', blackPawn);

        board.clear();

        expect(board._board.every(row => row.every(s => !s.piece))).toBe(true);
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

        [ 'e5', 'bottomLeft', [ 'd4', 'c3', 'b2', 'a1' ] ],
        [ 'e5', 'bottomRight', [ 'f4', 'g3', 'h2' ] ],
        [ 'e5', 'topLeft', [ 'd6', 'c7', 'b8' ] ],
        [ 'e5', 'topRight', [ 'f6', 'g7', 'h8' ] ],

        [ 'a1', 'topRight', [ 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8' ] ],
        [ 'h1', 'topLeft', [ 'g2', 'f3', 'e4', 'd5', 'c6', 'b7', 'a8' ] ],
        [ 'h8', 'bottomLeft', [ 'g7', 'f6', 'e5', 'd4', 'c3', 'b2', 'a1' ] ],
        [ 'a8', 'bottomRight', [ 'b7', 'c6', 'd5', 'e4', 'f3', 'g2', 'h1'] ],

        [ 'a1', 'topLeft', [] ],
        [ 'a1', 'bottomLeft', [] ],
        [ 'h1', 'topRight', [] ],
        [ 'h1', 'bottomRight', [] ],
    ];

    it.each(cases)('should traverse the board in the specified direction', (from, direction, expected) => {
        const board = new ChessBoard();
        const squares: Square[] = [];

        const fromSquare = board.get(from);

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
