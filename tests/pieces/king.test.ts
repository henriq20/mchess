import Chess from '../../src/chess';
import generateMoves from '../../src/pieces/moves';

it('should move up to one square in any direction', () => {
    const chess = new Chess('');

    const piece = chess.place('K', 'e5');

    const possibleMoves = generateMoves(chess, { square: piece.square }).map(m => m.to);

    expect(possibleMoves).toHaveLength(8);
    expect(possibleMoves).toEqual(expect.arrayContaining([
        'e4', 'd4', 'f4', 'd5', 'f5', 'd6', 'e6', 'f6'
    ]));
});

it('should be able to castle kingside with white king', () => {
    const chess = new Chess('4k2r/8/8/8/8/8/8/4K2R w Kk - 1 1');

    const king = chess.piece('e1');

    const moves = generateMoves(chess, { square: king?.square }).map(m => m.to);

    expect(moves).toHaveLength(6);
    expect(moves).toEqual(expect.arrayContaining([
        'd1', 'd2', 'e2', 'f2', 'f1', 'g1'
    ]));
});

it('should be able to castle kingside with black king', () => {
    const chess = new Chess('4k2r/8/8/8/8/8/8/4K2R b Kk - 1 1');

    const king = chess.piece('e8');

    const moves = generateMoves(chess, { square: king?.square }).map(m => m.to);

    expect(moves).toHaveLength(6);
    expect(moves).toEqual(expect.arrayContaining([
        'd8', 'd7', 'e7', 'f7', 'f8', 'g8'
    ]));
});

it('should be able to castle queenside with white king', () => {
    const chess = new Chess('r3k3/8/8/8/8/8/8/R3K3 w Qq - 1 1');

    const king = chess.piece('e1');

    const moves = generateMoves(chess, { square: king?.square }).map(m => m.to);

    expect(moves).toHaveLength(6);

    expect(moves).toEqual(expect.arrayContaining([
        'd1', 'f1', 'd2', 'e2', 'f2', 'c1'
    ]));
});

it('should be able to castle queenside with black king', () => {
    const chess = new Chess('r3k3/8/8/8/8/8/8/R3K3 b Qq - 1 1');

    const king = chess.piece('e8');

    const moves = generateMoves(chess, { square: king?.square }).map(m => m.to);

    expect(moves).toHaveLength(6);
    expect(moves).toEqual(expect.arrayContaining([
        'd8', 'f8', 'd7', 'e7', 'f7', 'c8'
    ]));
});

it('should not be able to castle if there are pieces between white king and white rook', () => {
    const chess = new Chess('r2qkb1r/8/8/8/8/8/8/R2QKB1R w KQkq - 1 1');

    const king = chess.piece('e1');

    const moves = generateMoves(chess, { square: king?.square }).map(m => m.to);

    expect(moves).toHaveLength(3);

    expect(moves).toEqual(expect.arrayContaining([
        'd2', 'e2', 'f2'
    ]));
});

it('should not be able to castle if there are pieces between black king and black rook', () => {
    const chess = new Chess('r2qkb1r/8/8/8/8/8/8/R2QKB1R b KQkq - 1 1');

    const king = chess.piece('e8');

    const moves = generateMoves(chess, { square: king?.square }).map(m => m.to);

    expect(moves).toHaveLength(3);

    expect(moves).toEqual(expect.arrayContaining([
        'd7', 'e7', 'f7'
    ]));
});
