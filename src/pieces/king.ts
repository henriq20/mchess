import Square from '../square';
import ChessPiece, { ChessPieceColor } from './piece';

export default class King extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('king', color === 'white' ? 'k' : 'K', color);
	}

	possibleMoves(): Square[] {
		return [];
	}
}
