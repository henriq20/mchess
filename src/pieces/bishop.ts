import Square from '../square';
import ChessPiece, { ChessPieceColor } from './piece';

export default class Bishop extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('bishop', color === 'white' ? 'b' : 'B', color);
	}

	possibleMoves(): Square[] {
		return [];
	}
}
