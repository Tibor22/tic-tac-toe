const ticTacToeContainer = document.querySelector(".tic-tac-toe-container");
const startBtn = document.querySelector(".start-btn");
const welcomeMessage = document.querySelector(".welcome");
const form = document.querySelector("form");
const overlay = document.querySelector(".overlay");
const wrapper = document.querySelector(".wrapper");
const instruction = document.querySelector(".instruction");

let boardSize = 3;
let squareToWin = 0;
let squaresArr = [];
let takeTurns = 0;

// Choose size of the board

form.addEventListener("submit", function (e) {
  // Read number from the select input
  e.preventDefault();
  let select = document.getElementById("board");

  // Decide the board size
  boardSize = +select.value.slice(-1);

  // Set up how many square you need to win
  squareToWin = boardSize === 3 ? boardSize : boardSize - 1;
  // Render board
  createSquares(boardSize * boardSize);
  // remove Overlay and Welcome message
  welcomeMessage.classList.add("hidden");
  overlay.classList.add("hidden");

  // Set up size of X and O
  const boardSquare = document.querySelectorAll(".square");
  boardSquare.forEach(
    (square) => (square.style.fontSize = `${24 / boardSize}rem`)
  );

  // Create instruction

  let html = `<div class="instruction">
  RULES <img src="flag.png" alt=""> <br>
  You Need ${boardSize} Square in Diagonal to WIN or <br>
  You Need ${squareToWin} Square in row to WIN or <br>
  You Need ${squareToWin} Square in column to WIN 
  </div>`;

  wrapper.insertAdjacentHTML("afterbegin", html);

  // Hover over squares
  boardSquare.forEach((square) => {
    square.addEventListener("mouseover", (e) => {
      if (e.target.innerText === "") {
        e.target.style.backgroundColor = "rgb(189, 189, 136)";
      }
    });
    square.addEventListener("mouseleave", (e) => {
      e.target.style.backgroundColor = "rgb(211, 211, 127)";
    });
  });
});

function createSquares(numOfSquares) {
  // Change square size in grid
  ticTacToeContainer.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
  ticTacToeContainer.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

  // Create squares
  for (var i = 0; i < numOfSquares; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.classList.add(`square-${i + 1}`);
    square.dataset.number = i + 1;
    ticTacToeContainer.appendChild(square);
    squaresArr.push(square);
  }

  // Loop trough squares
  squaresArr.forEach((square) => {
    square.addEventListener("click", placeXOrYOnBoard);
  });
}

// Place X or Y on to the square by click

function placeXOrYOnBoard(e) {
  if (takeTurns % 2 === 0) {
    // Place X on the board
    if (e.target.innerText !== "O" && e.target.innerText !== "X") takeTurns++;
    e.target.innerText === "O"
      ? (e.target.innerText = "O")
      : (e.target.innerText = "X");

    // Check For rows
    checkForRows(squaresArr, "X");
    // check for columns
    checkForColumn(squaresArr, "X");
    //check for diagonal
    checkForDiagonal(squaresArr, "X");

    //If board is  full reset
    if (takeTurns === boardSize * boardSize) {
      reset();
    }
  } else {
    // Place O on the board
    if (e.target.innerText !== "O" && e.target.innerText !== "X") takeTurns++;
    e.target.innerText === "X"
      ? (e.target.innerText = "X")
      : (e.target.innerText = "O");

    // check for rows
    checkForRows(squaresArr, "O");
    // check for columns
    checkForColumn(squaresArr, "O");
    //check for diagonal
    checkForDiagonal(squaresArr, "O");

    //If board is  full reset
    if (takeTurns === boardSize * boardSize) {
      reset();
    }
  }
}

// Row check for winner
function checkForRows(squaresArr, testFor) {
  // Cut boards into rows
  let chunks = createArrayChunks(squaresArr);

  let sumUp = Array(boardSize).fill("");

  for (let row = 0; row < boardSize; row++) {
    for (let column = 0; column < boardSize; column++) {
      if (chunks[row][column].innerText === testFor) {
        sumUp[row] += `${column}`;
        if (
          sumUp[row].length === squareToWin &&
          checkIfSequential(sumUp[row])
        ) {
          alert(testFor + " WON ROWS");
          reset();
        }
      }
    }
  }
}

// Check for columns
function checkForColumn(squaresArr, testFor) {
  // Cut boards into column
  let chunks = createArrayChunks(squaresArr);
  // Checking the columns
  let sumUp = Array(boardSize).fill("");

  for (let row = 0; row < boardSize; row++) {
    for (let column = 0; column < boardSize; column++) {
      if (chunks[row][column].innerText === testFor) {
        sumUp[column] += `${row}`;

        if (
          sumUp[column].length === squareToWin &&
          checkIfSequential(sumUp[column])
        ) {
          alert(testFor + " WON COLUMNS");
          reset();
        }
      }
    }
  }
}

// Check for diagonals
function checkForDiagonal(squaresArr, testFor) {
  // Cut boards into rows
  let chunks = createArrayChunks(squaresArr);

  let southEastDiagonal = 0;
  let southWestDiagonal = 0;
  for (let row = 0; row < boardSize; row++) {
    // Check for SouthEastDiagonal
    for (let column = 0; column < boardSize; column++) {
      if (row === column && chunks[row][column].innerText === testFor) {
        southEastDiagonal++;
        if (southEastDiagonal === boardSize) {
          alert(testFor + " WON");
          reset();
        }
      }
    }
    // Check for SouthWestDiagonal
    for (let column = boardSize - 1 - row; column >= 0; column--) {
      if (chunks[row][column].innerText === testFor) {
        southWestDiagonal++;
        if (southWestDiagonal === boardSize) {
          alert(testFor + " WON");
          reset();
        }
      }
      break;
    }
  }
}

// Check for sequence in rows or columns
function checkIfSequential(num) {
  let newNum = num + "";
  newNum = newNum.split("");

  let lengthOfArr = newNum.filter((num, i) => {
    console.log(num);
    let currNum = +newNum[i];
    let nextNum = +newNum[i + 1];
    let prevNum = +newNum[i - 1];

    if (currNum + 1 === nextNum || prevNum === currNum - 1) {
      console.log("true");
      return true;
    }
  });
  console.log(lengthOfArr);
  if (lengthOfArr.length < squareToWin) return false;
  if (lengthOfArr.length >= squareToWin) return true;
}

// Cut boards into rows
function createArrayChunks(squaresArr) {
  let chunks = [],
    i = 0,
    n = squaresArr.length;
  while (i < n) {
    chunks.push(squaresArr.slice(i, (i += boardSize)));
  }
  return chunks;
}

// Reset the game
function reset() {
  squaresArr.forEach((square) => {
    square.innerText = "";
  });
  takeTurns = 0;
  console.log(squaresArr);
}

// for (let i = 0; i < 4; i++) {
//   //   console.log(chunks[row + i][column + i]);
//   if (
//     row === column &&
//     chunks[row + i][column + i]?.innerText === testFor
//   ) {

//     console.log(southEastDiagonal);
//   }
// }
//   for (let row = 0; row < boardSize; row++) {
//     for (let column = 0; column < boardSize; column++) {
//       let sumUp = 0;
//       //   console.log(squaresArr[row + column].innerText, testFor);
//       if (squaresArr[row * boardSize + column].innerText === testFor) {
//         for (
//           let i = row * boardSize + column;
//           i < row * boardSize + column + squareToWin;
//           i++
//         ) {
//           if (squaresArr[i]?.innerText === testFor) {
//             sumUp++;
//             console.log(sumUp);
//           }
//         }
//       }
//       //   console.log(sumUp);
//       if (sumUp >= squareToWin) {
//         alert(`Congratulations ${testFor} you WON!!!! ROWS`);
//         reset();
//       }
//     }
//   }
