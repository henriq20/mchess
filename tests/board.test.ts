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

describe('get', () => {
    it('should get a piece', () => {
        const board = new ChessBoard();

        const whitePawn: ChessPiece = {
            name: 'pawn',
            color: 'white',
            letter: 'p'
        };

        const blackPawn: ChessPiece = {
            name: 'pawn',
            color: 'black',
            letter: 'p'
        };

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

        const piece: ChessPiece = {
            name: 'pawn',
            color: 'white',
            letter: 'p'
        };

        board.place(0, 0, piece);
        board.place(0, 1, piece);
        board.place(1, 0, piece);

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

        const whitePawn: ChessPiece = {
            name: 'pawn',
            color: 'white',
            letter: 'p'
        };

        const blackPawn: ChessPiece = {
            name: 'pawn',
            color: 'black',
            letter: 'p'
        };

        board.place(0, 0, whitePawn);
        board.place(0, 5, blackPawn);

        const removedPieces = board.clear();

        expect(board._board.every(row => row.every(s => !s.piece))).toBe(true);
        expect(removedPieces).toStrictEqual([ whitePawn, blackPawn ]);
    });
});
