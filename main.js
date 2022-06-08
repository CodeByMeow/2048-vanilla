import './style.css'
import Grid from './Grid';
import Tile from './Tile';

const gameBoard = document.querySelector("#game-board");
const grid = new Grid(gameBoard);

grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
setupInput()

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      /* if (!canMoveUp()) {
        setupInput();
        return;
      } */
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      setupInput();
      break;
  }

  grid.cells.forEach(cell => {
    cell.mergeTiles();
  });

  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  setupInput()
}

function moveUp() {
  slideTiles(grid.cellsByColumn);
}

function moveDown() {
  slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));
}

function moveLeft() {
  slideTiles(grid.cellsByRow);
}

function moveRight() {
  slideTiles(grid.cellsByRow.map(row => [...row].reverse()));
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap(group => {
      const promise = [];
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;
        let lastVilidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break;
          lastVilidCell = moveToCell;
        }

        if (lastVilidCell != null) {
          promise.push(cell.tile.waitForTransition());
          if (lastVilidCell.tile != null) {
            lastVilidCell.mergeTile = cell.tile;
          } else {
            lastVilidCell.tile = cell.tile
          }
          cell.tile = null;
        }
      }

      return promise;
    })
  )
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map(colum => [...colum].reverse()));
}
function canMoveLeft() {
  return canMove(grid.cellsByRow);
}
function canMoveRight() {
  return canMove(grid.cellsByRow.map(row => [...row].reverse()));
}

function canMove(cells) {
  return cells.some(group => {
    group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    })
  })
}
