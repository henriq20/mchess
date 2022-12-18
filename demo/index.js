import chalk from 'chalk';
import Chess from 'mchess';
import inquirer from 'inquirer';

const chess = new Chess();
let possibleMoves = [];

while (!chess.isGameOver()) {
    render(possibleMoves);
    possibleMoves = [];

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'move',
            message: 'Enter a move:',
            prefix: ''
        }
    ]);

    if (answers.move[0] === 'm') {
        const args = answers.move.split(' ').slice(1);

        possibleMoves = chess.moves({ square: args[0], san: false }).map(m => m.to);
        continue;
    }

    chess.move(answers.move);
}

function render(possibleMoves = []) {
    const board = chess.render({
        square: (square) => {
            if (possibleMoves.includes(square.name)) {
                return chalk.gray('▪');
            }

            if (!square.piece) {
                return ' ';
            }

            return square.piece.color === 'black' ? chalk.yellowBright(square.piece.symbol) : square.piece.symbol;
        }
    });

    console.clear();
    console.log(board + '\n');

    if (possibleMoves.length) {
        console.log(chalk.yellow(possibleMoves.join(' ')));
    }

    console.log();
}
