import Square from '../square';
import ChessPiece, { ChessPieceColor } from './piece';

export default class Queen extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('queen', color === 'white' ? 'q' : 'Q', color);
	}

	possibleMoves(): Square[] {
		return [];
	}
}
