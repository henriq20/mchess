import Chess from '../src/chess';
import Pawn from '../src/pieces/pawn';

describe('place', () => {
    it('should place a piece on the specified position', () => {
        const chess = new Chess();

        chess.place('p', 'a1');

        const square = chess.board.get(0, 0);

        expect(square?.hasPiece()).toBe(true);
        expect(square?.piece?.name).toBe('pawn');
    });

    it('should return the piece created', () => {
        const chess = new Chess();

        const piece = chess.place('p', 'a1');

        expect(piece).toBeInstanceOf(Pawn);
    });

    it('should return false when the piece was not added', () => {
        const chess = new Chess();

        const piece = chess.place('p', 'a9');

        expect(piece).toBe(false);
    });
});