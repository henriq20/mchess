import Chess from '../src/chess';
import Bishop from '../src/pieces/bishop';
import King from '../src/pieces/king';
import Knight from '../src/pieces/knight';
import Pawn from '../src/pieces/pawn';
import ChessPiece from '../src/pieces/piece';
import Queen from '../src/pieces/queen';
import Rook from '../src/pieces/rook';
import { ChessPosition } from '../src/position';

describe('place', () => {
    it('should place a piece on the specified position', () => {
        const chess = new Chess();

        chess.place('p', 'a3');

        const square = chess.board.get(2, 0);

        expect(square?.empty).toBe(false);
        expect(square?.piece?.name).toBe('pawn');
    });

    it('should return the piece created', () => {
        const chess = new Chess();

        const piece = chess.place('p', 'a3');

        expect(piece).toBeInstanceOf(Pawn);
    });

    it('should set the piece square', () => {
        const chess = new Chess();

        const piece = chess.place('p', 'a3');

        expect((piece as ChessPiece).square).toBe('a3');
    });

    it('should return null when the piece was not added', () => {
        const chess = new Chess();

        const piece = chess.place('p', 'a9' as ChessPosition);

        expect(piece).toBe(null);
    });

    it('should add the piece to the pieces array', () => {
        const chess = new Chess();

        chess.place('p', 'a3');
        chess.place('P', 'a4');

        expect(chess.white.size).toBe(17);
        expect(chess.black.size).toBe(17);
        expect(chess.black.get('a3')?.color).toBe('black');
        expect(chess.white.get('a4')?.color).toBe('white');
    });

    it('should add a piece by passing row and column', () => {
        const chess = new Chess();

        chess.place('P', [ 2, 0 ]);

        expect(chess.white.size).toBe(17);
        expect(chess.board.get(2, 0)?.piece).toBeInstanceOf(Pawn);
    });

    it('should set the white or black king', () => {
        const chess = new Chess();

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
});

describe('takeOut', () => {
    it('should remove a piece from the board', () => {
        const chess = new Chess();

        const piece = chess.takeOut('e2');

        expect(chess.white.size).toBe(15);
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
        expect(chess.square('a2')?.empty).toBe(true);
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

    it('should add the move to the history', () => {
        const chess = new Chess();

        const result = chess.move({
            from: 'a2',
            to: 'a4'
        });

        expect(chess.history).toHaveLength(1);
        expect(chess.history[0]).toBe(result);
    });

    it('should not add the move to the history when the move is invalid', () => {
        const chess = new Chess();

        chess.move({
            from: 'a3',
            to: 'a4'
        });

        expect(chess.history).toHaveLength(0);
    });
});

describe('isCheck', () => {
    it('should return false when none of the kings are in check', () => {
        const chess = new Chess();

        expect(chess.isCheck()).toBe(false);
    });

    it('should return true when the black king is in check', () => {
        const chess = new Chess('k7/8/8/1B6/8/8/8/K7 w - - 0 1');

        chess.move({
            from: 'b5',
            to: 'c6'
        });

        expect(chess.isCheck()).toBe(true);
    });

    it('should return true when the white king is in check', () => {
        const chess = new Chess('K7/8/2b5/8/8/8/8/k7 w - - 0 1');

        expect(chess.isCheck()).toBe(true);
    });
});

describe('undo', () => {
    it('should remove the move from the history', () => {
        const chess = new Chess();

        chess.move({
            from: 'e2',
            to: 'e4'
        });

        chess.undo();

        expect(chess.history).toHaveLength(0);
    });

    it('should move the moving piece back', () => {
        const chess = new Chess();

        chess.move({
            from: 'e2',
            to: 'e4'
        });

        chess.undo();

        expect(chess.piece('e4')).toBe(null);
        expect(chess.piece('e2')).toBeInstanceOf(Pawn);
    });
});

describe('enemies', () => {
    it('should get the white pieces when it is the black pieces\' turn', () => {
        const chess = new Chess();

        chess.move({
            from: 'e2',
            to: 'e4'
        });

        const enemies = chess.enemies();

        for (const [ _, enemy ] of enemies) {
            expect(enemy.color).toBe('white');
        }
    });

    it('should get the black pieces when it is the white pieces\' turn', () => {
        const chess = new Chess();

        const enemies = chess.enemies();

        for (const [ _, enemy ] of enemies) {
            expect(enemy.color).toBe('black');
        }
    });
});

describe('moves', () => {
    it('should get the possible moves of a piece', () => {
        const chess = new Chess();

        expect(chess.moves('e2')).toStrictEqual([ 'e3', 'e4' ]);
        expect(chess.moves('e7')).toStrictEqual([ 'e6', 'e5' ]);
    });

    it('should return an empty array when the square does not have a piece', () => {
        const chess = new Chess();

        expect(chess.moves('e3')).toHaveLength(0);
    });

    it('should return an empty array when the square does not exist', () => {
        const chess = new Chess();

        expect(chess.moves('e0' as ChessPosition)).toHaveLength(0);
    });

    it('should return all the possible moves if square is not provided', () => {
        const chess = new Chess();

        const moves = chess.moves();

        expect(moves).toHaveLength(20);
        expect(moves).toEqual(expect.arrayContaining([
            'a3', 'a4',
            'b3', 'b4',
            'c3', 'c4',
            'd3', 'd4',
            'f3', 'f4',
            'g3', 'g4',
            'h3', 'h4'
        ]));
    });

    it('should not be a possible move if it would put the king in check', () => {
        const chess = new Chess('3q3k/8/8/8/8/8/3R4/3K4 w - - 0 1');

        const moves = chess.moves('d2');

        expect(moves).toHaveLength(6);
        expect(moves).toEqual(expect.arrayContaining([
            'd3', 'd4', 'd5', 'd6', 'd7', 'd8'
        ]));
    });
});
