// Need to create a map for both players

class Player {
  constructor(name, type, board, shadowBoard) {
    this.name = name;
    this.type = type;
    this.board = board;
    this.shadowBoard = shadowBoard;
    this.isAttack = false;
    this.hitShip = [];
  }

  _attack(enemy) {}
}

class App {
  _takeTurns = 0;
  _parentContainer = document.querySelector(".boards-container");
  _player1Board = document.querySelector(".player-1-board");
  _player2Board = document.querySelector(".player-2-board");
  player1;
  player2;
  gameState = "placeShip";

  constructor() {
    this._createBoard();
  }

  // Create board for each player
  _createBoard() {
    let board2D = [];
    for (let k = 0; k < 2; k++) {
      for (let i = 0; i < 11; i++) {
        let rows = document.createElement("div");
        rows.classList.add("board-row");
        let shadowRows = [];

        for (let j = 0; j < 11; j++) {
          let columns = document.createElement("div");
          let shadowColumns = [];
          columns.classList.add("board-col");
          columns.dataset.number = `${j}`;
          if (i === 0 && j > 0) {
            columns.innerText = `${(j + 9).toString(36)}`;
          }
          shadowColumns = (j + 9).toString(36);
          shadowRows.push(shadowColumns);
          rows.appendChild(columns);
        }
        rows.firstChild.innerText = `${i}`;
        rows.dataset.number = `${i}`;
        //   playerBoard.appendChild(rows);
        if (k === 0) {
          board2D.push(shadowRows);
          this._player2Board.appendChild(rows);
        }
        if (k === 1) this._player1Board.appendChild(rows);
      }
    }
    this.player1 = new Player("Tibor", "player", this._player1Board, board2D);
    this.player2 = new Player(
      "Jenefer",
      "opponent",
      this._player2Board,
      board2D
    );
    this._placeShip(this.player1);
  }

  // Decide who starts the game

  _changePosition() {
    if (this._takeTurns % 2 === 0) {
      this._attackBoard(this.player1);
    } else if (this._takeTurns % 2 === 1) {
      this._attackBoard(this.player2);
    }
  }

  _placeShip(player1, num = 1) {
    let maxNumOfShip = 0;
    const shipPositions = [];
    console.log(maxNumOfShip);
    player1.board.querySelectorAll(".board-col").forEach((col) => {
      col.addEventListener("click", (e) => {
        if (this.gameState !== "placeShip") return;
        if (maxNumOfShip < 3) {
          console.log(e.target);
          e.stopPropagation();
          e.target.classList.add(`ship-${num}`);
          maxNumOfShip += 1;

          shipPositions.push([
            e.target.parentNode.dataset.number,
            e.target.dataset.number,
          ]);
          console.log(shipPositions);
        }
        if (maxNumOfShip === 3) {
          maxNumOfShip = 0;
          player1.shipPositions = shipPositions;
          console.log("turn");
          this._takeTurns++;
          if (
            this.player1.shipPositions?.length > 0 &&
            this.player2.shipPositions?.length > 0
          ) {
            console.log("true");
            this.player2.board.classList.add("blur");
            this.player1.board.classList.remove("blur");

            this._attackBoard(this.player1, this.player2);
          } else {
            this._placeShip(this.player2, 2);
            this.player1.board.classList.add("blur");
            this.player2.board.classList.remove("blur");
          }
        }
      });
    });
  }

  _attackBoard(attacker, defender, num = 1) {
    // Abort Event Listener
    // Not able to touch its own map
    const controller = new AbortController();

    // Change attack state
    attacker.isAttack = true;
    this.gameState = "attackShips";
    let numOfAttack = 0;
    // call first time
    defender.board.classList.remove("blur");
    let calcNum = num % 2 === 0 ? 1 : 2;

    // console.log("CalcNUm", calcNum);
    // Attacker
    // Has it grids shown with the ships and the destroyed ships included

    //Attacker shows as green
    attacker.board.style.border = "10px solid green";
    defender.board.style.border = "10px solid red";

    // Defender
    // grids are hidden except the red ones (ships has been found)
    // Defender shows as red

    // Only Can see the red squares on the defender(hide ships)
    document.querySelectorAll(`.ship-${calcNum}`).forEach((ship) => {
      ship.style.backgroundColor = "whitesmoke";
    });

    defender.board.querySelectorAll(".board-col").forEach((col) => {
      col.addEventListener(
        "click",
        (e) => {
          if (col.classList.contains("clicked")) return;
          col.style.backgroundColor = "red";
          col.classList.add("clicked");
          numOfAttack++;
          if (numOfAttack === 1) {
            document.querySelectorAll(`.ship-${calcNum}`).forEach((ship) => {
              defender.shipPositions.forEach((ship) => {
                let row = +ship[0];
                let column = +ship[1];
                defender.board
                  .querySelectorAll(".board-row")
                  [row].querySelectorAll(".board-col")[
                  column
                ].style.backgroundColor = "blue";
              });

              this._checkIfShipHit(e.target, defender, calcNum);

              defender.hitShip.forEach((ship) => {
                let row = +ship[0];
                let column = +ship[1];
                defender.board
                  .querySelectorAll(".board-row")
                  [row].querySelectorAll(".board-col")[
                  column
                ].style.backgroundColor = "green";
              });
            });
            this._takeTurns++;
            // SWAP
            if (this.player1.isAttack) {
              this.player1.isAttack = false;
              controller.abort();
              this._attackBoard(this.player2, this.player1, num + 1);
            } else if (this.player2.isAttack) {
              this.player2.isAttack = false;
              controller.abort();
              this._attackBoard(this.player1, this.player2, num + 1);
            }
          }
        },
        { signal: controller.signal }
      );
    });
  }

  _checkIfShipHit(hitGrid, defender, num) {
    let column = hitGrid.dataset.number;
    let row = hitGrid.closest(".board-row").dataset.number;

    if (hitGrid.style.backgroundColor === "blue") {
      alert("HIT!!!!!");
      let shipSquare = defender.board
        .querySelectorAll(".board-row")
        [row].querySelectorAll(".board-col")[column];
      defender.hitShip.push([row, column]);
      console.log(shipSquare);
      shipSquare.style.backgroundColor = "red";
      shipSquare.classList.remove(`ship-${num}`);
      shipSquare.classList.add("clicked");
    }
    // Remove it from the shipsArr
    defender.shipPositions.forEach((position, i) => {
      if (position[0] === row && position[1] === column) {
        defender.shipPositions.splice(i, 1);
      }
    });
    this._checkForWinner();
  }

  _checkForWinner() {
    if (this.player1.hitShip.length == 3) {
      alert(`Congrat ${this.player2.name} you WON!`);
    } else if (this.player2.hitShip.length == 3) {
      alert(`Congrat ${this.player1.name} you WON!`);
    }
  }
}

const app = new App();
