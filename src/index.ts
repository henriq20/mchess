import Chess from './chess';
import ChessBoardRenderer from './render';
import readline from 'readline';
import { ChessPosition } from './board/position';
import ChessPiece from './pieces/piece';

const c = new Chess();

const start = performance.now();
const m = c.piece('d1')?.possibleMoves();
const elapsed = performance.now() - start;

console.log(m, elapsed);


// const r = new ChessBoardRenderer(c.board);
// const i = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// async function ask(message: string) {
//     return new Promise(resolve => {
//         i.question(message, resolve);
//     });
// }

// async function main() {
//     while (!c.isCheckmate() || !c.isStalemate()) {
//         console.clear();
//         console.log(r.render() + '\n');

//         const from = (await ask('from: ')) as ChessPosition;
//         const to = (await ask('to: ')) as ChessPosition;

//         c.move({
//             from,
//             to
//         });
//     }
// }

// main();

// export default Chess;
