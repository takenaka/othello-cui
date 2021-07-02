import inquirer from 'inquirer';
import { Board } from './model/Board';

(async () => {
  const prompt = inquirer.createPromptModule();
  try {
    const answer = await prompt({
      message: 'ボードのサイズを選択してください',
      name: 'boardSize',
      type: 'list',
      choices: [
        { name: '4 x 4', value: 4 },
        { name: '6 x 6', value: 6 },
        { name: '8 x 8', value: 8 },
      ],
    });

    const board = new Board(answer.boardSize);
    console.log(board.state);
  } catch (e) {
    console.log(e.message);
  }
})();
