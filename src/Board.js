import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = 0.7 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let i = 0; i < nrows; i++) {
      let row = [];
      for (let j = 0; j < ncols; j++) {
        row.push(Math.random() <= chanceLightStartsOn);
      }
      initialBoard.push(row);
    }

    return initialBoard;
  }
  //NOTE: there's an array.from()

  //NOTE: can create helper functions for generate board for row and cols

  /** Function that generates DOM elements for the boards */
  function generateBoard() {
    return board.map((row, rowIdx) => {
      return (
        <tr key={rowIdx}>
          {row.map((col, colIdx) => (
            <Cell
              key={`${rowIdx}-${colIdx}`}
              isLit={col}
              flipCellsAroundMe={(
                evt // No need to use this evt.
              ) => flipCellsAround(`${rowIdx}-${colIdx}`)}
            />
          ))}
        </tr>
      );
    });
  }

  /** Function that checks to see if player wins. */
  function hasWon() {
    // check if every cell is false
    for (let row of board) {
      if (row.some((col) => col === true)) {
        // NOTE: Don't need === for true
        return false;
      }
    }
    return true;
  }

  /** Flips cell and neighboring cells to the oposite boolean type
   * Copies the existing board and modifies the copy in place.
   * @param {String} coord --- string of the y and x coordinate of the cell
   *
   */

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Create a deep copy of the old board
      const newBoard = [...oldBoard];

      // Toggle cell, cell to the left, to the right, above and below to oposite state
      flipCell(y, x, newBoard);
      flipCell(y, x - 1, newBoard);
      flipCell(y, x + 1, newBoard);
      flipCell(y + 1, x, newBoard);
      flipCell(y - 1, x, newBoard);

      return newBoard;
    });
  }
  // if the game is won, just show a winning msg & render nothing else

  // board {array nxm};
  return (
    <table>
      <tbody>{hasWon() ? "Congrets" : generateBoard()}</tbody>
    </table>
  );
}

export default Board;
