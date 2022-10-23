import { ChessPiece, ChessPieceName } from './pieces/piece';
import { ChessPosition } from './position';

export type ChessMove = {
    from: ChessPosition,
    to: ChessPosition
};

export type ChessMoveResult = {
    from: ChessPosition,
    to: ChessPosition,
    piece: ChessPiece,
    type: MoveType,
    capturedPiece?: ChessPieceName,
    promotedTo?: ChessPieceName
};

export enum MoveType {
    QUIET = 1,
    CAPTURE = 2,
    PROMOTION = 3,
    EN_PASSANT = 4,
    CASTLING_KINGSIDE = 5,
    CASTLING_QUEENSIDE = 6
};
