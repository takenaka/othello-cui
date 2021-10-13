import inquirer from 'inquirer';
import { Coodinate, IBoard } from './board';

export interface IIO {
  message: (message: any) => void;
  selectBoardSize: () => Promise<number>;
  selectXYCoodinate: (board: IBoard) => Promise<Coodinate>;
  showBoard: (board: IBoard) => void;
}

export class IO implements IIO {
  private prompt: inquirer.PromptModule;

  public constructor(prompt: inquirer.PromptModule) {
    this.prompt = prompt;
  }
  public message = (message: any) => {
    console.log(message);
  };

  public selectBoardSize = async () => {
    const answer = await this.prompt({
      message: 'ボードのサイズを選択してください',
      name: 'boardSize',
      type: 'list',
      choices: [
        { name: '4 x 4', value: 4 },
        { name: '6 x 6', value: 6 },
        { name: '8 x 8', value: 8 },
      ],
    });

    return answer.boardSize as number;
  };

  public selectXYCoodinate = async (board: IBoard): Promise<Coodinate> => {
    const choicesNumber: { name: string; value: number }[] = [];
    const choicesAlphabet: { name: string; value: number }[] = [];
    const char = 'A'.charCodeAt(0);
    for (let i = 0; i < board.size; i++) {
      choicesNumber.push({ name: (i + 1).toString(), value: i });
      choicesAlphabet.push({ name: String.fromCharCode(char + i), value: i });
    }

    const y = await this.selectCoodinate('y', choicesNumber);
    const x = await this.selectCoodinate('x', choicesAlphabet);
    return { y, x };
  };

  private selectCoodinate = async (direction: 'y' | 'x', choices: { name: string; value: number }[]) => {
    const answer = await this.prompt({
      message: `${direction}座標を選んでください`,
      name: direction,
      type: 'list',
      choices,
    });

    return answer[direction] as number;
  };

  public showBoard = (board: IBoard) => {
    const message = [];

    let firstLine = [' '];
    const char = 'A'.charCodeAt(0);
    for (let i = 0; i < board.size; i++) {
      firstLine.push(String.fromCharCode(char + i));
    }
    message.push(firstLine);

    board.state.forEach((yDirection, y) => {
      const line = [(y + 1).toString()];
      yDirection.forEach((stone, x) => {
        if (!stone) {
          line.push('*');
          return;
        }
        const stoneString = stone.state === 'black' ? '○' : '●';
        line.push(stoneString);
      });
      message.push(line);
    });

    let messageString = '\n';
    message.forEach(line => {
      messageString += line.join(' ');
      messageString += '\n';
    });

    console.log(messageString);
  };
};
