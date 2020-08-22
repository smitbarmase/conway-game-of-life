import React, { useState, useRef, useCallback } from 'react';
import produce from 'immer';

const numOfRows = 35;
const numOfCols = 35;
const size = 17;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const getEmptyGrid = () => {
  let grid = [];
  for (let i = 0; i < numOfCols; i++) {
    grid.push(Array.from(Array(numOfRows), () => 0));
  }
  return grid;
};

const App = () => {
  const [grid, setGrid] = useState(getEmptyGrid());
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((grid) => {
      return produce(grid, (draftGrid) => {
        for (let c = 0; c < numOfCols; c++) {
          for (let r = 0; r < numOfRows; r++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newC = c + x;
              const newR = r + y;
              if (
                newC >= 0 &&
                newC < numOfCols &&
                newR >= 0 &&
                newR < numOfRows
              ) {
                neighbors += draftGrid[newC][newR];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              draftGrid[c][r] = 0;
            } else if (grid[c][r] === 0 && neighbors === 3) {
              draftGrid[c][r] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <>
      <div
        style={{
          height: 50,
          width: numOfCols * (size + 1),
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 25,
        }}
      >
        Conway's Game of Life
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numOfCols}, ${size + 1}px)`,
        }}
      >
        {grid.map((cols, c) =>
          cols.map((cell, r) => (
            <div
              key={`${c}-${r}`}
              style={{
                width: size,
                height: size,
                border: 'solid 1px black',
                background: grid[c][r] ? 'black' : 'white',
              }}
              onClick={() => {
                setGrid(
                  produce(grid, (draftGrid) => {
                    draftGrid[c][r] = grid[c][r] ? 0 : 1;
                  })
                );
              }}
            ></div>
          ))
        )}
      </div>
      <div
        style={{
          height: 50,
          width: numOfCols * (size + 1),
          display: 'grid',
          gridTemplateColumns: `1fr 1fr 1fr`,
          gridGap: 20,
          padding: 10,
          boxSizing: 'border-box',
        }}
      >
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setGrid(
              produce(grid, (draftGrid) => {
                for (let c = 0; c < numOfCols; c++) {
                  for (let r = 0; r < numOfRows; r++) {
                    draftGrid[c][r] = Math.random() > 0.8 ? 1 : 0;
                  }
                }
              })
            );
          }}
        >
          Random
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setGrid(getEmptyGrid());
          }}
        >
          Clear
        </button>
      </div>
    </>
  );
};

export default App;
