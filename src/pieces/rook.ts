import Square from '../square';
import ChessPiece, { ChessPieceColor } from './piece';

export default class Rook extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('rook', color === 'white' ? 'r' : 'R', color);
	}

	possibleMoves(): Square[] {
		return [];
	}
}
