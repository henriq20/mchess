import Chess, { DEFAULT_POSITION } from '../src/chess';
import ChessPiece, { ChessPosition } from '../src/pieces/piece';

describe('place', () => {
    it('should place a piece on the specified position', () => {
        const chess = new Chess();

        chess.place('p', 'a3');

        const square = chess.board.get('a3');

        expect(square?.empty).toBe(false);
        expect(square?.piece?.type).toBe('p');
    });

    it('should return the piece created', () => {
        const chess = new Chess();

        const piece = chess.place('p', 'a3');

        expect(piece.type).toBe('p');
    });

    it('should set the piece square', () => {
        const chess = new Chess();

        const piece = chess.place('p', 'a3');

        expect((piece as ChessPiece).square).toBe('a3');
    });

    it('should set the white and black king', () => {
        const chess = new Chess();

        expect(chess.kings.white?.type).toBe('k');
        expect(chess.kings.black?.type).toBe('k');
    });
});

describe('setup', () => {
    it('should place the initial pieces on the board', () => {
        const chess = new Chess();

        expect(chess.board.get('a1')?.piece?.type).toBe('r');
        expect(chess.board.get('b1')?.piece?.type).toBe('n');
        expect(chess.board.get('c1')?.piece?.type).toBe('b');
        expect(chess.board.get('d1')?.piece?.type).toBe('q');
        expect(chess.board.get('e1')?.piece?.type).toBe('k');
        expect(chess.board.get('f1')?.piece?.type).toBe('b');
        expect(chess.board.get('g1')?.piece?.type).toBe('n');
        expect(chess.board.get('h1')?.piece?.type).toBe('r');

        expect(chess.board.get('a8')?.piece?.type).toBe('r');
        expect(chess.board.get('b8')?.piece?.type).toBe('n');
        expect(chess.board.get('c8')?.piece?.type).toBe('b');
        expect(chess.board.get('d8')?.piece?.type).toBe('q');
        expect(chess.board.get('e8')?.piece?.type).toBe('k');
        expect(chess.board.get('f8')?.piece?.type).toBe('b');
        expect(chess.board.get('g8')?.piece?.type).toBe('n');
        expect(chess.board.get('h8')?.piece?.type).toBe('r');
    });
});

describe('takeOut', () => {
    it('should remove a piece from the board', () => {
        const chess = new Chess();

        const piece = chess.takeOut('e2');

        expect(piece?.type).toBe('p');
    });
});

describe('move', () => {
    it('should move a piece', () => {
        const chess = new Chess();

        chess.move({
            from: 'a2',
            to: 'a4'
        });

        expect(chess.piece('a4')?.type).toBe('p');
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

    it('should not change the turn if move is invalid', () => {
        const chess = new Chess();

        chess.move({
            from: 'a3',
            to: 'a4'
        });

        expect(chess.turn).toBe('white');
    });

    it('should not move a piece if it is not its turn', () => {
        const chess = new Chess();

        chess.move({
            from: 'e7',
            to: 'e5'
        });

        expect(chess.history).toHaveLength(0);
        expect(chess.piece('e5')).toBe(null);
        expect(chess.piece('e7')?.type).toBe('p');
    });

    it('should update the flags after kingside castling', () => {
        const chess = new Chess('4k2r/8/8/8/8/8/8/4K2R w KkQq - 1 1');

        chess.move({
            from: 'e1',
            to: 'g1'
        });

        chess.move({
            from: 'e8',
            to: 'g8'
        });

        expect(chess.flags.white.kingsideCastling).toBe(false);
        expect(chess.flags.black.kingsideCastling).toBe(false);

        expect(chess.flags.white.queensideCastling).toBe(true);
        expect(chess.flags.black.queensideCastling).toBe(true);
    });

    it('should update the flags after queenside castling', () => {
        const chess = new Chess('r3k3/8/8/8/8/8/8/R3K3 w KkQq - 1 1');

        chess.move({
            from: 'e1',
            to: 'c1'
        });

        chess.move({
            from: 'e8',
            to: 'c8'
        });

        expect(chess.flags.white.queensideCastling).toBe(false);
        expect(chess.flags.black.queensideCastling).toBe(false);

        expect(chess.flags.white.kingsideCastling).toBe(true);
        expect(chess.flags.black.kingsideCastling).toBe(true);
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

describe('isCheckmate', () => {
    it.each([
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        'k7/8/8/1B6/8/8/8/K7 w - - 0 1',
        'K7/8/2b5/8/8/8/8/k7 w - - 0 1'
    ])('should return false when it is not checkmate', (fen) => {
        const chess = new Chess(fen);

        expect(chess.isCheckmate()).toBe(false);
    });

    it.each([
        'rnbqkbnr/ppppp2p/8/5ppQ/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 0 2',
        'r4bkr/ppp3pp/2n1B3/4p3/8/8/PPPP1PPP/RNB1K2R b KQ - 0 10',
        '8/4kp2/4p3/1Q1p4/8/2b1P3/r1q2PPP/3K1B1R w - - 12 26',
        '8/3R3p/Q5k1/6p1/6P1/4Q2P/5PK1/8 b - - 0 41',
        '1NR1kbr1/4n3/1p2Q2p/p2p1p2/3P4/4P3/PP3PPP/4K2R b K - 4 19'
    ])('should return true when it is checkmate', (fen) => {
        const chess = new Chess(fen);

        expect(chess.isCheckmate()).toBe(true);
    });
});

describe('isStalemate', () => {
    it.each([
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        'k7/8/8/1B6/8/8/8/K7 w - - 0 1',
        'K7/8/2b5/8/8/8/8/k7 w - - 0 1'
    ])('should return false when it is not checkmate', (fen) => {
        const chess = new Chess(fen);

        expect(chess.isStalemate()).toBe(false);
    });

    it.each([
        'K7/8/8/8/8/8/5Q2/7k b - - 0 1',
        '8/p7/4k3/1p6/2p5/2bn4/3r4/1K6 w - - 6 39',
        '4QQ2/R7/8/6k1/8/6K1/7P/8 b - - 6 66',
        '3Q4/1k6/5RN1/3p4/3P4/Q1K5/8/8 b - - 4 64',
        '1Q6/8/5Q2/7k/2P5/1P2N3/5K2/8 b - - 2 56'
    ])('should return true when it is stalemate', (fen) => {
        const chess = new Chess(fen);

        expect(chess.isStalemate()).toBe(true);
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
        expect(chess.piece('e2')?.type).toBe('p');
    });
});

describe('moves', () => {
    it('should get the possible moves of a piece', () => {
        const chess = new Chess();

        expect(chess.moves('e2').map(m => m.to)).toStrictEqual(['e3', 'e4']);
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

        const moves = chess.moves().map(m => m.to);

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

        const moves = chess.moves('d2').map(m => m.to);

        expect(moves).toHaveLength(6);
        expect(moves).toEqual(expect.arrayContaining([
            'd3', 'd4', 'd5', 'd6', 'd7', 'd8'
        ]));
    });
});

describe('clear', () => {
    it('should clear the board', () => {
        const chess = new Chess();

        chess.clear();

        expect(chess.kings.white).toBe(null);
        expect(chess.kings.black).toBe(null);
        expect(chess.history).toHaveLength(0);
        expect(chess.turn).toBe('white');
    });
});

describe('reset', () => {
    it('should reset the board to its default position', () => {
        const chess = new Chess('rnbqkbnr/ppp1pppp/8/3p4/5P2/8/PPPPP1PP/RNBQKBNR w KQkq d6 0 2');

        chess.move({
            from: 'c2',
            to: 'c4'
        });

        chess.reset();

        const fen = chess.fen();

        expect(fen).toMatch(DEFAULT_POSITION);
    });
});
