import Square from '../src/square';
import ChessBoard from '../src/board';
import { ChessPiece } from '../src/pieces/piece';

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
            [ 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8' ],
            [ 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8' ],
            [ 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8' ],
            [ 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8' ],
            [ 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8' ],
            [ 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8' ],
            [ 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8' ],
            [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8' ]
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

        const piece: ChessPiece = {
            name: 'pawn',
            color: 'white',
            letter: 'p'
        };

        const result = board.place(0, 0, piece);

        expect(result).toBe(true);
        expect(piece.board).toEqual(board);
        expect(piece.square).toBeTruthy();
        expect(piece.square?.name).toBe('a1');
    });

    it('should return false when the piece was not added', () => {
        const board = new ChessBoard();

        const piece: ChessPiece = {
            name: 'pawn',
            color: 'white',
            letter: 'p'
        };

        expect(board.place(8, 0, piece)).toBe(false);
        expect(board.place(0, 8, piece)).toBe(false);
        expect(board.place(-1, 0, piece)).toBe(false);
        expect(board.place(0, -1, piece)).toBe(false);

        expect(board._board.every(row => row.every(s => !s.piece))).toBe(true);
    });
});