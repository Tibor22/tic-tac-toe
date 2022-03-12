// Need to create a map for both players

class Player {
  constructor(name, type, board, shadowBoard) {
    this.name = name;
    this.type = type;
    this.board = board;
    this.shadowBoard = shadowBoard;
    this.isAttack = false;
    this.hitShip = [];
    this.carrier = [];
    this.battleship = [];
    this.cruiser = [];
    this.submarine = [];
    this.destroyer = [];
    this.direction = "vertical";
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
    this._changeDirection();
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

  _changeDirection() {
    let directionBtn = document.querySelectorAll(".turn");
    let count = 0;

    directionBtn.forEach((btn) => {
      addEventListener("click", (e) => {
        // Get current player
        //Player1
        console.log(e.target);
        console.log(count);
        count++;
        if (count % 2 === 1) return;
        if (
          e.target.classList.contains("turn-1") &&
          this.player1.direction === "vertical"
        ) {
          console.log("PLAYER1");
          e.target.innerText = "TURN SHIP VERTICALLY";
          this.player1.direction = "horizontal";
        } else if (
          e.target.classList.contains("turn-1") &&
          this.player1.direction === "horizontal"
        ) {
          console.log("PLAYER1");
          e.target.innerText = "TURN SHIP HORIZONTALLY";
          this.player1.direction = "vertical";
        }
        if (
          e.target.classList.contains("turn-2") &&
          this.player2.direction === "vertical"
        ) {
          console.log("PLAYER2 HORIZOZNTAL");
          e.target.innerText = "TURN SHIP VERTICALLY";
          this.player2.direction = "horizontal";
        } else if (
          e.target.classList.contains("turn-2") &&
          this.player2.direction === "horizontal"
        ) {
          console.log("PLAYER2 VERTICAL");
          e.target.innerText = "TURN SHIP HORIZONTALLY";
          this.player2.direction = "vertical";
        }
      });
    });
  }

  _checkIfOutOfMap(row, column, player, num) {
    if (row >= 11 || column >= 11) {
      alert("YOUR OUT OF THE MAP");
      // this._placeShip(player, num);
      return true;
    }
  }

  _placeShip(player1, num = 1) {
    let maxNumOfShip = 0;
    const shipPositions = [];
    console.log(maxNumOfShip);
    player1.board.querySelectorAll(".board-col").forEach((col) => {
      col.addEventListener("click", (e) => {
        if (this.gameState !== "placeShip") return;
        if (maxNumOfShip < 5) {
          e.stopPropagation();
          // e.target.classList.add(`ship-${num}`);

          console.log(player1.direction);
          // Decide wether ship placed vertically or horizontally
          if (player1.direction === "vertical") {
            // Place ships vertically
            for (let j = 0; j < 5 - maxNumOfShip; j++) {
              let row = e.target.parentNode.dataset.number;
              let currRow = +row + j;
              if (this._checkIfOutOfMap(currRow, e.target.dataset.number))
                continue;
              shipPositions.push([currRow, e.target.dataset.number]);
              if (maxNumOfShip === 0)
                player1.carrier.push([currRow, e.target.dataset.number]);
              if (maxNumOfShip === 1)
                player1.battleship.push([currRow, e.target.dataset.number]);
              if (maxNumOfShip === 2)
                player1.cruiser.push([currRow, e.target.dataset.number]);
              if (maxNumOfShip === 3)
                player1.submarine.push([currRow, e.target.dataset.number]);
              if (maxNumOfShip === 4)
                player1.destroyer.push([currRow, e.target.dataset.number]);

              console.log(player1.carrier);
            }
          } else if (player1.direction === "horizontal") {
            // Place ships horizontally
            for (let j = 0; j < 5 - maxNumOfShip; j++) {
              let row = e.target.parentNode.dataset.number;
              let column = e.target.dataset.number;
              let currColumn = +column + j;
              if (this._checkIfOutOfMap(row, currColumn)) continue;
              shipPositions.push([row, currColumn]);
              if (maxNumOfShip === 1) player1.carrier.push([row, currColumn]);
              if (maxNumOfShip === 2)
                player1.battleship.push([row, currColumn]);
              if (maxNumOfShip === 3) player1.cruiser.push([row, currColumn]);
              if (maxNumOfShip === 4) player1.submarine.push([row, currColumn]);
              if (maxNumOfShip === 5) player1.destroyer.push([row, currColumn]);
            }
          }

          player1.shipPositions = shipPositions;
          player1.shipPositions.forEach((ship, i) => {
            let row = +ship[0];
            let column = +ship[1];
            let shipSquare = player1.board
              .querySelectorAll(".board-row")
              [row].querySelectorAll(".board-col")[column];
            shipSquare.classList.add(`ship-${num}`);
            if (i === player1.shipPositions.length - 1)
              shipSquare.style.borderRadius = "0px 0px 20px 20px";
            if (i === 0) {
              console.log(i);
              shipSquare.style.borderRadius = "20px 20px 0px 0px";
            }
          });
          maxNumOfShip += 1;
          console.log(shipPositions);
        }
        if (maxNumOfShip === 5) {
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
            // document.querySelectorAll(`.ship-${calcNum}`).forEach((ship) => {
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
            // });
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
      console.log("HIT!!!!!");
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
    console.log(this.player1, this.player2);
    if (this.player1.hitShip.length == 9) {
      console.log(`Congrat ${this.player2.name} you WON!`);
    } else if (this.player2.hitShip.length == 9) {
      console.log(`Congrat ${this.player1.name} you WON!`);
    }
  }
}

const app = new App();
