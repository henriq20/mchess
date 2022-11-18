import ChessBoard from './board';
import createPiece from './factory';
import ChessPiece from './pieces/piece';
import { toArrayPosition } from './position';
import { ChessPieceLetter } from './factory';
import { ArrayPosition, ChessPosition } from './position';

export type SetupFn = (place: (pieceName: ChessPieceLetter, position: ChessPosition | ArrayPosition) => ChessPiece | false) => void;

export default class Chess {
    board: ChessBoard;
    white: Map<ChessPosition, ChessPiece>;
    black: Map<ChessPosition, ChessPiece>;

    constructor(setupFn?: SetupFn) {
        this.board = new ChessBoard();
        this.white = new Map();
        this.black = new Map();
        this.setup(setupFn);
    }

    setup(fn?: SetupFn) {
        if (typeof fn === 'function') {
            return fn(this.place.bind(this));
        }

        // Place pawns
        for (let column = 0; column < this.board.size; column++) {
            this.place('p', [ 1, column ]);
            this.place('P', [ 6, column ]);
        }

        this.place('r', [ 0, 0 ]);
        this.place('n', [ 0, 1 ]);
        this.place('b', [ 0, 2 ]);
        this.place('q', [ 0, 3 ]);
        this.place('k', [ 0, 4 ]);
        this.place('b', [ 0, 5 ]);
        this.place('n', [ 0, 6 ]);
        this.place('r', [ 0, 7 ]);

        this.place('R', [ 7, 0 ]);
        this.place('N', [ 7, 1 ]);
        this.place('B', [ 7, 2 ]);
        this.place('Q', [ 7, 3 ]);
        this.place('K', [ 7, 4 ]);
        this.place('B', [ 7, 5 ]);
        this.place('N', [ 7, 6 ]);
        this.place('R', [ 7, 7 ]);
    }

    place(pieceName: ChessPieceLetter, position: ChessPosition | ArrayPosition): ChessPiece | false {
        const piece = createPiece(pieceName);
        const [ row, column ] = typeof position === 'string' ? toArrayPosition(position) : position;

        const result = this.board.place(row, column, piece);

        if (result) {
            this[piece.color].set(piece.square?.name || '--', piece);

            return piece;
        }

        return false;
    }

    takeOut(position: ChessPosition | ArrayPosition): ChessPiece | null {
        const [ row, column ] = typeof position === 'string' ? toArrayPosition(position) : position;

        const square = this.board.get(row, column);

        if (!square || !square.hasPiece()) {
            return null;
        }

        const piece = this.board.remove(row, column);

        if (!piece) {
            return null;
        }

        this[piece.color].delete(square.name);

        return piece;
    }
}
