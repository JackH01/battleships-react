import { useState } from 'react';

// Any comment that has 'NOTE:' at the start is a note I made while following
// the tutorial at https://react.dev/learn/tutorial-tic-tac-toe.

// NOTE: Convention to use onSomething names for props which represent events.
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  // NOTE: Convention to use handleSomething for function definitions which
  // handle events.
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    // NOTE: Get a copy rather than mutating the array directly, as useful
    // for doing things like undo and redo in apps, it also means
    // that you only need to rerender a part of the array (i.e. one 
    // square in this case), rather than the entire array if you
    // mutated directly.
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O")
  }

  // Generating the 3x3 table to play on.
  let numRows = 3;
  let numCols = 3;
  const rows = []
  for (let rowNum=0; rowNum<numRows; rowNum++) {
    const cells = []
    for (let colNum=0; colNum<numCols; colNum++) {
      // Collapsing 2d index to 1d index.
      let i = (rowNum * numCols) + colNum;
      // NOTE: () => are arrow functions, similar to lambda in Python.
      cells.push(<Square value={squares[i]} onSquareClick={() => handleClick(i)} key={colNum}/>);

    }
    rows.push(<div className="board-row" key={rowNum}>{cells}</div>)
  }

  return (
    // NOTE: Use fragments to return several lines of html. I.e. can only
    // return one element, so all html must either be in something
    // like a div, or a fragment.
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}


export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortMovesDescending, setSortMovesDescending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleSortClick() {
    setSortMovesDescending(!sortMovesDescending);
  }
  

  // Generating each list element for the moves history section,
  // each one can be clicked to jump back to before that move was made.
  const moves = history.map((squares, move) => {
    let description;
    let elem;
    // Showing text rarther than a button for the current move.
    if (move === currentMove) {
      description = "You are at move #" + move;
      elem = <p>{description}</p>;
    } else {
      if (move > 0) {
        description = "Go to move #" + move;
      } else {
        description = "Go to game start";
      }
      elem = <button onClick={() => jumpTo(move)}>{description}</button>;
    }
    return (
      <li key={move}>
        {elem}
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <button 
          className="sort" 
          onClick={handleSortClick}>{"Sort: " + (sortMovesDescending ? "Descending" : "Ascending")}
        </button>
        <ol>{(sortMovesDescending ? moves : moves.reverse())}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i=0; i<lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
      return squares[a]
    }
  }

  return null;
}
