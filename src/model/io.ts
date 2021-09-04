import { prompt } from '../utils/prompt';
import { IBoard } from './board';

export interface IIO {
  message: (message: any) => void;
  selectBoardSize: () => Promise<number>;
  selectCoodinate: (direction: 'y' | 'x', choices: { name: string; value: number }[]) => Promise<number>;
  showBoard: (board: IBoard) => void;
}

export class IO {
  public static message = (message: any) => {
    console.log(message);
  };

  public static selectBoardSize = async () => {
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

    return answer.boardSize as number;
  };

  public static selectCoodinate = async (direction: 'y' | 'x', choices: { name: string; value: number }[]) => {
    const answer = await prompt({
      message: `${direction}座標を選んでください`,
      name: direction,
      type: 'list',
      choices,
    });

    return answer[direction] as number;
  };

  public static showBoard = (board: IBoard) => {
    const message = [];

    let firstLine = [' '];
    for (let i = 0; i < board.size; i++) {
      firstLine.push((i + 1).toString());
    }
    message.push(firstLine);

    board.state.forEach((yDirection, y) => {
      const line = [(y + 1).toString()];
      yDirection.forEach((stone, x) => {
        if (!stone.state) {
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
      messageString += '\n'
    });

    console.log(messageString);
  };
}
