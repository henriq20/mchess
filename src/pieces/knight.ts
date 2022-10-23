import Square from '../square';
import ChessPiece, { ChessPieceColor } from './piece';

export default class Knight extends ChessPiece {
	constructor(color: ChessPieceColor) {
		super('knight', color === 'white' ? 'n' : 'N', color);
	}

	possibleMoves(): Square[] {
		return [];
	}
}
