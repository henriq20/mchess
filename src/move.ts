import Chess from './chess.js';
import { ArrayPosition, ChessPosition } from './position.js';
import ChessPiece, { ChessPieceName } from './pieces/piece.js';

export type ChessMove = {
    from: ArrayPosition | ChessPosition,
    to: ArrayPosition | ChessPosition
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

	const capturedPiece = chess.takeOut([ to.x, to.y ]);
	chess.takeOut([ from.x, from.y ]);
	chess.place(piece, [ to.x, to.y ]);

	piece.moves++;
	piece.square = to.name;

	const undo = () => {
		chess.takeOut([ to.x, to.y ]);
		chess.place(piece, [ from.x, from.y ]);

		if (capturedPiece) {
			chess.place(capturedPiece, [ to.x, to.y ]);
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
