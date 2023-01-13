const Player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  };

  return { getSign };
};

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""]; // board squares array

  const setSquare = (i, sign) => {
    // fix for clicking on a square again before the bot moves
    if (sign == "X" && i > 8) return;

    if (sign == "O") {
      i = Math.floor(Math.random() * 9);
    }
    if (board[i] != "" && sign == "O") {
      i = Math.floor(Math.random() * 9);
      return setSquare(i, sign);
    }

    if (board[i] != "") return;

    board[i] = sign;
    gameController.addRound();
  };

  const getSquare = (i) => {
    return board[i];
  };

  const getBoard = () => {
    return board;
  };

  // clean the board
  const resetBoard = () => {
    for (let i = 0; i < 9; i++) {
      board[i] = "";
    }
    gameDisplay.updateBoard();
  };

  return { setSquare, getSquare, getBoard, resetBoard };
})();

const gameDisplay = (() => {
  const gameSquares = document.querySelectorAll(".box"); // squares id array

  // add event listeners to squares
  for (let i = 0; i < 9; i++) {
    gameSquares[i].addEventListener("click", (e) => {
      gameController.playRound(i);
    });
  }
  // add event listener to reset button
  let restartButton = document.getElementById("restartButton");
  restartButton.addEventListener("click", (e) => {
    gameController.fullReset();
  });

  // board display update
  const updateBoard = () => {
    for (i = 0; i < 9; i++) {
      gameSquares[i].textContent = gameBoard.getSquare(i);
    }
  };

  return { updateBoard };
})();

const gameController = (() => {
  const playerX = Player("X");
  const playerO = Player("O");

  const XScore = document.getElementById("score1");
  const OScore = document.getElementById("score2");

  console.log(XScore);
  let XScoreCounter = 0;
  let OScoreCounter = 0;

  let currentRound = 1;
  let isOver = 0;

  let titleText = document.getElementById("titleText");
  let p1Name = document.getElementById("player1Name");
  let p2Name = document.getElementById("player2Name");
  p1Name.style.fontWeight = "bold";

  const playRound = (i) => {
    // check if game has been won
    if (isOver == 1) {
      startNextRound();
      return;
    }

    gameBoard.setSquare(i, getCurrentPlayerSign()); // mark square
    gameDisplay.updateBoard();
    if (gameController.getWinner()) {
      startNextRound();
    }
    if (currentRound == 10) {
      console.log("TIE");
      startNextRound();
    }
  };

  const getWinner = () => {
    const board = gameBoard.getBoard();
    if (
      (board[0] == "X" && board[1] == "X" && board[2] == "X") ||
      (board[3] == "X" && board[4] == "X" && board[5] == "X") ||
      (board[6] == "X" && board[7] == "X" && board[8] == "X") ||
      (board[0] == "X" && board[3] == "X" && board[6] == "X") ||
      (board[1] == "X" && board[4] == "X" && board[7] == "X") ||
      (board[2] == "X" && board[5] == "X" && board[8] == "X") ||
      (board[0] == "X" && board[4] == "X" && board[8] == "X") ||
      (board[2] == "X" && board[4] == "X" && board[6] == "X")
    ) {
      addScore("X");
      isOver = 1;
      return "X";
    }

    if (
      (board[0] == "O" && board[1] == "O" && board[2] == "O") ||
      (board[3] == "O" && board[4] == "O" && board[5] == "O") ||
      (board[6] == "O" && board[7] == "O" && board[8] == "O") ||
      (board[0] == "O" && board[3] == "O" && board[6] == "O") ||
      (board[1] == "O" && board[4] == "O" && board[7] == "O") ||
      (board[2] == "O" && board[5] == "O" && board[8] == "O") ||
      (board[0] == "O" && board[4] == "O" && board[8] == "O") ||
      (board[2] == "O" && board[4] == "O" && board[6] == "O")
    ) {
      addScore("O");
      isOver = 1;
      return "O";
    }

    // make AI play
    console.log(currentRound);
    if (currentRound % 2 == 0) {
      setTimeout(function () {
        playRound(12);
      }, 500);
    }
  };

  const getCurrentPlayerSign = () => {
    if (currentRound % 2 == 0) {
      p1Name.style.fontWeight = "bold";
      p2Name.style.fontWeight = "normal";
      return "O";
    } else {
      p1Name.style.fontWeight = "normal";
      p2Name.style.fontWeight = "bold";
      return "X";
    }
  };

  const addRound = () => {
    currentRound++;
  };

  // update score on leaderboard
  const addScore = (sign) => {
    if (sign == "X") {
      XScoreCounter++;
      XScore.innerText = XScoreCounter;
    } else if (sign == "O") {
      OScoreCounter++;
      OScore.innerText = OScoreCounter;
    } else if (sign == "R") {
      // reset button onclick
      XScoreCounter = 0;
      XScore.innerText = XScoreCounter;
      OScoreCounter = 0;
      OScore.innerText = OScoreCounter;
    }
  };

  const getIsOver = () => {
    return isOver;
  };

  const startNextRound = () => {
    if (currentRound == 1) {
      return;
    }

    currentRound = 1;

    // game ends if someone has won 3 rounds
    if (XScoreCounter == 3) {
      titleText.innerHTML = "YOU HAVE WON!";
      titleText.style.color = "red";
      return;
    } else if (OScoreCounter == 3) {
      titleText.innerHTML = "AI HAS CONQUERED US!";
      titleText.style.fontSize = "5rem";
      titleText.style.color = "red";
      return;
    }

    setTimeout(function () {
      isOver = 0;
      gameBoard.resetBoard();
      p1Name.style.fontWeight = "bold";
      p2Name.style.fontWeight = "normal";
    }, 1500);
  };

  const fullReset = () => {
    currentRound = 1;
    isOver = 0;
    addScore("R");
    p1Name.style.fontWeight = "bold";
    p2Name.style.fontWeight = "normal";
    titleText.innerHTML = "Tic-Tac-Toe";
    titleText.style.color = "White";
    titleText.style.fontSize = "7rem";
    gameBoard.resetBoard();
  };

  return {
    playRound,
    getCurrentPlayerSign,
    addRound,
    getWinner,
    addScore,
    getIsOver,
    startNextRound,
    fullReset,
  };
})();
