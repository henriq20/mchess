import ChessBoard from './board';
import ChessPiece, { ChessPieceName } from './pieces/piece';
import { ArrayPosition, ChessPosition, toChessPosition } from './position';

export type ChessMove = {
    from: ArrayPosition,
    to: ArrayPosition
};

export type ChessMoveResult = {
    from: ChessPosition,
    to: ChessPosition,
    piece: ChessPiece,
    capturedPiece?: ChessPieceName,
    promotedTo?: ChessPieceName
};

export default function move(board: ChessBoard, move: ChessMove): ChessMoveResult | false {
	const from = board.get(...move.from);
	const to = board.get(...move.to);
	const piece = from?.piece;

	if (!from || !piece || !to) {
		return false;
	}
	if (!piece.canMove(to)) {
		return false;
	}

	let capturedPiece;

	if (to.piece) {
		capturedPiece = to.piece.name;
	}

	board.remove(to.x, to.y);
	board.remove(from.x, from.y);
	board.place(to.x, to.y, piece);

	return {
		from: toChessPosition(from.x, from.y),
		to: toChessPosition(to.x, to.y),
		piece,
		capturedPiece
	};
}
