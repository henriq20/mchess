import Chess from './chess.js';
import { ChessPosition } from './position.js';
import ChessPiece, { ChessPieceName } from './pieces/piece.js';

export type ChessMove = {
    from:  ChessPosition,
    to:  ChessPosition
};

export type ChessMoveResult = {
    from: ChessPosition,
    to: ChessPosition,
    piece: ChessPiece,
    capturedPiece: ChessPiece | null,
    promotedTo?: ChessPieceName,
	undo: () => void
};

export default function makeMove(chess: Chess, move: ChessMove): ChessMoveResult | false {
	const from = chess.square(move.from);
	const to = chess.square(move.to);
	const piece = from?.piece;

	if (!from || !piece || !to) {
		return false;
	}

	const capturedPiece = chess.takeOut(to.name);
	chess.takeOut(from.name);
	chess.place(piece, to.position);

	piece.moves++;
	piece.square = to.name;

	const undo = () => {
		chess.takeOut(to.name);
		chess.place(piece, from.position);

		if (capturedPiece) {
			chess.place(capturedPiece, to.position);
		}

		piece.moves--;
		piece.square = from.name;
	};

	return {
		from: from.name,
		to: to.name,
		piece,
		capturedPiece,
		undo
	};
}
