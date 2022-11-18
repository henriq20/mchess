import Chess from '../src/chess';
import Bishop from '../src/pieces/bishop';
import King from '../src/pieces/king';
import Knight from '../src/pieces/knight';
import Pawn from '../src/pieces/pawn';
import Queen from '../src/pieces/queen';
import Rook from '../src/pieces/rook';
import { ChessPosition } from '../src/position';

describe('place', () => {
    it('should place a piece on the specified position', () => {
        const chess = new Chess(() => {});

        chess.place('p', 'a1');

        const square = chess.board.get(0, 0);

        expect(square?.hasPiece()).toBe(true);
        expect(square?.piece?.name).toBe('pawn');
    });

    it('should return the piece created', () => {
        const chess = new Chess(() => {});

        const piece = chess.place('p', 'a1');

        expect(piece).toBeInstanceOf(Pawn);
    });

    it('should return false when the piece was not added', () => {
        const chess = new Chess(() => {});

        const piece = chess.place('p', 'a9' as ChessPosition);

        expect(piece).toBe(false);
    });

    it('should add the piece to the pieces array', () => {
        const chess = new Chess(() => {});

        chess.place('p', 'a2');
        chess.place('P', 'a7');

        expect(chess.white.size).toBe(1);
        expect(chess.black.size).toBe(1);
        expect(chess.white.get('a2')?.color).toBe('white');
        expect(chess.black.get('a7')?.color).toBe('black');
    });

    it('should add a piece by passing row and column', () => {
        const chess = new Chess(() => {});

        chess.place('p', [ 0, 0 ]);

        expect(chess.white.size).toBe(1);
        expect(chess.board.get(0, 0)?.piece).toBeInstanceOf(Pawn);
    });

    it('should set the white or black king', () => {
        const chess = new Chess(() => {});

        chess.place('k', [ 0, 0 ]);
        chess.place('K', [ 1, 0 ]);

        expect(chess.whiteKing).toBeInstanceOf(King);
        expect(chess.blackKing).toBeInstanceOf(King);
    });
});

describe('setup', () => {
    it('should place the initial pieces on the board', () => {
        const chess = new Chess();

        expect(chess.white.size).toBe(16);
        expect(chess.black.size).toBe(16);

        for (let column = 0; column < chess.board.size; column++) {
            const white = chess.board.get(1, column);
            const black = chess.board.get(6, column);

            expect(white?.piece).toBeInstanceOf(Pawn);
            expect(black?.piece).toBeInstanceOf(Pawn);
            expect(white?.piece?.color).toBe('white');
            expect(black?.piece?.color).toBe('black');
        }

        expect(chess.board.get(0, 0)?.piece).toBeInstanceOf(Rook);
        expect(chess.board.get(0, 1)?.piece).toBeInstanceOf(Knight);
        expect(chess.board.get(0, 2)?.piece).toBeInstanceOf(Bishop);
        expect(chess.board.get(0, 3)?.piece).toBeInstanceOf(Queen);
        expect(chess.board.get(0, 4)?.piece).toBeInstanceOf(King);
        expect(chess.board.get(0, 5)?.piece).toBeInstanceOf(Bishop);
        expect(chess.board.get(0, 6)?.piece).toBeInstanceOf(Knight);
        expect(chess.board.get(0, 7)?.piece).toBeInstanceOf(Rook);

        expect(chess.board.get(7, 0)?.piece).toBeInstanceOf(Rook);
        expect(chess.board.get(7, 1)?.piece).toBeInstanceOf(Knight);
        expect(chess.board.get(7, 2)?.piece).toBeInstanceOf(Bishop);
        expect(chess.board.get(7, 3)?.piece).toBeInstanceOf(Queen);
        expect(chess.board.get(7, 4)?.piece).toBeInstanceOf(King);
        expect(chess.board.get(7, 5)?.piece).toBeInstanceOf(Bishop);
        expect(chess.board.get(7, 6)?.piece).toBeInstanceOf(Knight);
        expect(chess.board.get(7, 7)?.piece).toBeInstanceOf(Rook);
    });

    it('should work with a custom function', () => {
        const chess = new Chess(place => {
            place('p', 'a2');
            place('P', 'a7');
        });

        expect(chess.white.size).toBe(1);
        expect(chess.black.size).toBe(1);

        expect(chess.white.get('a2')?.color).toBe('white');
        expect(chess.black.get('a7')?.color).toBe('black');
    });
});

describe('takeOut', () => {
    it('should remove a piece from the board', () => {
        const chess = new Chess(() => {});

        chess.place('p', 'a1');

        const piece = chess.takeOut('a1');

        expect(chess.white.size).toBe(0);
        expect(piece).toBeInstanceOf(Pawn);
    });
});

describe('move', () => {
    it('should move a piece', () => {
        const chess = new Chess();

        chess.move({
            from: 'a2',
            to: 'a4'
        });

        expect(chess.piece('a4')?.moves).toBe(1);
        expect(chess.piece('a4')).toBeInstanceOf(Pawn);
        expect(chess.square('a2')?.hasPiece()).toBe(false);
    });

    it('should return false when piece cannot move', () => {
        const chess = new Chess();

        const result = chess.move({
            from: 'a2',
            to: 'a5'
        });

        expect(result).toBe(false);
        expect(chess.piece('a5')).toBe(null);
        expect(chess.piece('a2')?.moves).toBe(0);
    });
});
