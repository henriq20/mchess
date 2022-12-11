import Square from '../src/board/square';
import ChessBoard from '../src/board/board';
import { createPiece, ChessPosition } from '../src/pieces/piece';

describe('constructor', () => {
    it('should create an empty board', () => {
        const board = new ChessBoard();

        expect(board._board).toHaveLength(64);
    });

    it('should fill the board with squares', () => {
        const board = new ChessBoard();

        expect(board._board.every(s => s instanceof Square)).toBe(true);
    });

    it('should name each square based on its position', () => {
        const board = new ChessBoard();

        const squares = [
            'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
            'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
            'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
            'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
            'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
            'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
            'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
            'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
        ];

        expect(board._board.map(s => s.name)).toStrictEqual(squares);
    });
});

describe('place', () => {
    it('should place a piece on the board', () => {
        const board = new ChessBoard();

        const pawn = createPiece('p');

        const square = board.place(pawn, 'a1') as Square;

        expect(square).toBeTruthy();
        expect(square.piece?.type).toBe('p');
        expect(square.piece?.square).toBe('a1');
    });

    it('should return false when the piece was not added', () => {
        const board = new ChessBoard();

        const pawn = createPiece('p');

        expect(board.place(pawn, 'a0' as ChessPosition)).toBe(false);
        expect(board.place(pawn, 'h9' as ChessPosition)).toBe(false);

        expect(board._board.every(s => !s.piece)).toBe(true);
    });
});

describe('get', () => {
    it('should get a piece', () => {
        const board = new ChessBoard();

        const whitePawn = createPiece('P');
        const blackPawn = createPiece('p');

        board.place( whitePawn, 'a1');
        board.place(blackPawn, 'e5');

        expect(board.get('a1')?.piece?.color).toBe('white');
        expect(board.get('e5')?.piece?.color).toBe('black');
    });

    it('should return null if the specified index is off bounds', () => {
        const board = new ChessBoard();

        expect(board.get('a0' as ChessPosition)).toBe(null);
        expect(board.get('h9' as ChessPosition)).toBe(null);
    });

    it('should return null when position is `-`', () => {
        const board = new ChessBoard();

        expect(board.get('-')).toBe(null);
    });
});

describe('remove', () => {
    it('should remove a piece from the board', () => {
        const board = new ChessBoard();

        const pawn = createPiece('p');

        board.place(pawn, 'a1');
        board.place(pawn, 'b1');
        board.place(pawn, 'a2');

        const removedPiece = board.remove('b1');

        expect(removedPiece?.type).toBe('p');
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

        board.place(whitePawn, 'a1');
        board.place(blackPawn, 'h5');

        board.clear();

        expect(board._board.every(s => !s.piece)).toBe(true);
    });
});
