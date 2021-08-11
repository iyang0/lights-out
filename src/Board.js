import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";
import "bootstrap"

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

  function generateBoard() {
    return board.map((row, rowIdx) => {
      return (
        <tr>
        {row.map((col, colIdx) => {
          return (<Cell
            key={colIdx}
            isLit={col} 
            flipCellsAroundMe={evt =>flipCellsAround(`${rowIdx}-${colIdx}`)} 
            />
          );
        })}
        </tr>
      )
    });
  }

  function hasWon() {
    for (let row of board) {
      if (row.some((col) => col === true)) {
        return false;
      }
    }
    return true;
  }

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

      // TODO: return the copy
      return newBoard;
    });
  }
  // if the game is won, just show a winning msg & render nothing else

  // board {array nxm};
  return (<div>
      {hasWon() ? "Congrets" : generateBoard()}
  </div>);
}

export default Board;
