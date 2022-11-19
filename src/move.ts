import Chess from './chess';
import { ArrayPosition, ChessPosition } from './position';
import ChessPiece, { ChessPieceName } from './pieces/piece';

export type ChessMove = {
    from: ArrayPosition | ChessPosition,
    to: ArrayPosition | ChessPosition
};

export type ChessMoveResult = {
    from: ChessPosition,
    to: ChessPosition,
    piece: ChessPiece,
    capturedPiece?: ChessPieceName,
    promotedTo?: ChessPieceName,
	undo: () => void
};

export default function move(chess: Chess, move: ChessMove): ChessMoveResult | false {
	const from = chess.square(move.from);
	const to = chess.square(move.to);
	const piece = from?.piece;

	if (!from || !piece || !to || !piece.canMove(to)) {
		return false;
	}

	let capturedPiece;

	if (to.piece) {
		capturedPiece = to.piece.name;
	}

	const captured = chess.takeOut([ to.x, to.y ]);
	chess.takeOut([ from.x, from.y ]);
	chess.board.place(to.x, to.y, piece);

	piece.moves++;

	const undo = () => {
		chess.takeOut([ to.x, to.y ]);
		chess.board.place(from.x, from.y, piece);

		if (captured) {
			chess.board.place(to.x, to.y, captured);
		}

		piece.moves--;
	};

	return {
		from: from.name,
		to: to.name,
		piece,
		capturedPiece,
		undo
	};
}
