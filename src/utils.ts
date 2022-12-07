import { ChessPosition } from './pieces/piece';

export function rank(square: ChessPosition): string {
    return square[1];
}

export function file(square: ChessPosition): string {
    return square[0];
}
