const GRID_SIZE = 4
const CELL_SIZE = 20
const CELL_GAP = 1

export default class Gird {
  #cells
  constructor(gridElement) {
    const { style } = gridElement;
    style.setProperty("--grid-size", GRID_SIZE);
    style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
    this.#cells = createCellElement(gridElement).map(
      (cell, index) => {
        return new Cell(
          cell,
          index % GRID_SIZE,
          Math.floor(index / GRID_SIZE),
        )
      }
    );
  }

  get cells() {
    return this.#cells;
  }

  get #emptyCells() {
    return this.cells.filter(cell => cell.tile == null);
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, [])
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, [])
  }

  randomEmptyCell() {
    const indexRandom = Math.floor(Math.random() * this.#emptyCells.length);
    return this.#emptyCells[indexRandom];
  }


}

class Cell {
  #x
  #y
  #cellElement
  #tile
  #mergeTile
  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get tile() {
    return this.#tile;
  }

  set tile(value) {
    this.#tile = value;
    if (value == null) return;
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value == null) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  canAccept(tile) {
    return (
      this.tile == null ||
      this.mergeTile == null && this.tile.value === tile.value
    )
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return;
    this.tile.value = this.tile.value + this.mergeTile.value;
    this.mergeTile.remove();
    this.mergeTile = null;
  }
}

const createCellElement = (gridElement) => {
  const cells = [];
  for (let i = 0; i < (GRID_SIZE * GRID_SIZE); i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gridElement.append(cell);
    cells.push(cell);
  }

  return cells;
}
