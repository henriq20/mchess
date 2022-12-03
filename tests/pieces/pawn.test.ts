import Chess from '../../src/chess';
import ChessPiece from '../../src/pieces/piece';

describe('white', () => {
    it('should be able to move one square forward', () => {
        const chess = new Chess('');

        const pawn = chess.place('P', 'a1');

        expect(chess.canMove(pawn, 'a2')).toBe(true);
    });

    it('should be able to move two squares forward', () => {
        const chess = new Chess('');

        const pawn = chess.place('P', 'a2');

        expect(chess.canMove(pawn, 'a4')).toBe(true);
    });

    it('should not be able to move two squares forward when it has already moved once', () => {
        const chess = new Chess('');

        const pawn = chess.place('P', 'a3');

        expect(chess.canMove(pawn, 'a5')).toBe(false);
    });

    it('should be able to capture a piece diagonally to the left', () => {
        const chess = new Chess('');

        const pawn = chess.place('P', 'd2');
        chess.place('p', 'c3');

        expect(chess.canMove(pawn, 'c3')).toBe(true);

    });

    it('should be able to capture a piece diagonally to the right', () => {
        const chess = new Chess('');

        const pawn = chess.place('P', 'd2');
        chess.place('p', 'e3');

        expect(chess.canMove(pawn, 'e3')).toBe(true);
    });

    it('should be able to en passant to the left', () => {
        const chess = new Chess('k7/3p4/8/4P3/8/8/8/K7 b - - 0 2');

        chess.move({
            from: 'd7',
            to: 'd5'
        });

        const pawn = chess.piece('e5');

        if (!pawn) {
            return fail();
        }

        expect(chess.canMove(pawn, 'd6')).toBe(true);
    });

    it('should be able to en passant to the right', () => {
        const chess = new Chess('k7/5p2/8/4P3/8/8/8/K7 b - - 0 2');

        chess.move({
            from: 'f7',
            to: 'f5'
        });

        const pawn = chess.piece('e5');

        if (!pawn) {
            return fail();
        }

        expect(chess.canMove(pawn, 'f6')).toBe(true);
    });

    it('should not be able to en passant if last move was not of a pawn', () => {
        const chess = new Chess('k7/3p4/8/4P3/8/8/8/K7 b - - 0 2');

        chess.move({
            from: 'd7',
            to: 'd5'
        });

        chess.move({
            from: 'a1',
            to: 'a2'
        });

        chess.move({
            from: 'a8',
            to: 'a7'
        });

        const pawn = chess.piece('e5');

        if (!pawn) {
            return fail();
        }

        expect(chess.canMove(pawn, 'd6')).toBe(false);
    });

    it('should not be able to en passant if last move was of another pawn', () => {
        const chess = new Chess('k7/2pp4/8/4P3/8/8/8/K7 b - - 0 2');

        chess.move({
            from: 'c7',
            to: 'c5'
        });

        const pawn = chess.piece('e5');

        if (!pawn) {
            return fail();
        }

        expect(chess.canMove(pawn, 'd6')).toBe(false);
    });
});

describe('black', () => {
    it('should be able to move one square forward', () => {
        const chess = new Chess('8/8/8/8/8/8/8/8 b - - 0 1');

        const pawn = chess.place('p', 'a8');

        expect(chess.canMove(pawn, 'a7')).toBe(true);
    });

    it('should be able to move two squares forward', () => {
        const chess = new Chess('8/8/8/8/8/8/8/8 b - - 0 1');

        const pawn = chess.place('p', 'a7');

        expect(chess.canMove(pawn, 'a5')).toBe(true);
    });

    it('should not be able to move two squares forward when it has already moved once', () => {
        const chess = new Chess('8/8/8/8/8/8/8/8 b - - 0 1');

        const pawn = chess.place('p', 'a6');

        expect(chess.canMove(pawn, 'a4')).toBe(false);
    });

    it('should be able to capture a piece diagonally to the left', () => {
        const chess = new Chess('8/3p4/2P5/8/8/8/8/8 b - - 0 1');

        const pawn = chess.piece('d7') as ChessPiece;

        expect(chess.canMove(pawn, 'c6')).toBe(true);

    });

    it('should be able to capture a piece diagonally to the right', () => {
        const chess = new Chess('8/3p4/4P3/8/8/8/8/8 b - - 0 1');

        const pawn = chess.piece('d7') as ChessPiece;

        expect(chess.canMove(pawn, 'e6')).toBe(true);
    });

    it('should be able to en passant to the left', () => {
        const chess = new Chess('k7/8/8/8/3p4/8/2P5/K7 w - - 0 2');

        chess.move({
            from: 'c2',
            to: 'c4'
        });

        const pawn = chess.piece('d4');

        if (!pawn) {
            return fail();
        }

        expect(chess.canMove(pawn, 'c3')).toBe(true);
    });

    it('should be able to en passant to the right', () => {
        const chess = new Chess('k7/8/8/8/3p4/8/4P3/K7 w - - 0 2');

        chess.move({
            from: 'e2',
            to: 'e4'
        });

        const pawn = chess.piece('d4');

        if (!pawn) {
            return fail();
        }

        expect(chess.canMove(pawn, 'e3')).toBe(true);
    });

    it('should not be able to en passant if last move was not of a pawn', () => {
        const chess = new Chess('k7/8/8/8/3p4/8/4P3/K7 w - - 0 2');

        chess.move({
            from: 'e2',
            to: 'e4'
        });

        chess.move({
            from: 'a8',
            to: 'a7'
        });

        chess.move({
            from: 'a1',
            to: 'a2'
        });

        const pawn = chess.piece('d4');

        if (!pawn) {
            return fail();
        }

        expect(chess.canMove(pawn, 'e3')).toBe(false);
    });

    it('should not be able to en passant if last move was of another pawn', () => {
        const chess = new Chess('k7/8/8/8/3p4/8/4PP2/K7 w - - 0 2');

        chess.move({
            from: 'f2',
            to: 'f4'
        });

        const pawn = chess.piece('d4');

        if (!pawn) {
            return fail();
        }

        expect(chess.canMove(pawn, 'e3')).toBe(false);
    });
});
