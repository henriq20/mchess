import ChessBoard from './board';
import { ChessPieceLetter } from './factory';
import ChessPiece from './pieces/piece';
import { ChessPosition } from './position';
import createPiece from './factory';
import { toArrayPosition } from './position';

export default class Chess {
    board: ChessBoard;
    white: ChessPiece[];
    black: ChessPiece[];

    constructor() {
        this.board = new ChessBoard();
        this.white = this.black = [];
    }

    place(pieceName: ChessPieceLetter, position: ChessPosition): ChessPiece | false {
        const piece = createPiece(pieceName);
        const [ row, column ] = toArrayPosition(position);

        const result = this.board.place(row, column, piece);

        return result ? piece : false;
    }
}
