const cgl = document.getElementsByClassName("changelog")[0];
let UI = document.querySelector(".responsive");
const Pawns = {
  "Pawn 2A": "2A",
  "Pawn 2B": "2B",
  "Pawn 2C": "2C",
  "Pawn 2D": "2D",
  "Pawn 2E": "2E",
  "Pawn 2F": "2F",
  "Pawn 7A": "7A",
  "Pawn 7B": "7B",
  "Pawn 7C": "7C",
  "Pawn 7D": "7D",
  "Pawn 7E": "7E",
  "Pawn 7F": "7F",
};
const rows = ["1", "2", "3", "4", "5", "6", "7", "8"];
const columns = ["A", "B", "C", "D", "E", "F"];
let round = 0;
let WhoMovedLast = "";
let MoveForPassant = "";
let PassantDouble = "";
let ments = [];
let specialsituation = false;
let array1 = [];
let cannotRochade = false;
let array2 = [];
let isInCheck = false;
let timerInterval;
let timeWhite = 300;
let BlackKingMoved = 0;
let WhiteKingMoved = 0;
let LeftBlackRookMoved = 0;
let LeftWhiteRookMoved = 0;
let RightBlackRookMoved = 0;
let RightWhiteRookMoved = 0;
let timerInterval2;
let timeBlack = 300;
let deletePawn = false;

rows.forEach((row) => {
  columns.forEach((column) => ments.push(`${row}${column}`));
});

const log = function (to, pawn, from) {
  const WhatPawn = {
    "2A": "Pawn 2A",
    "2B": "Pawn 2B",
    "2C": "Pawn 2C",
    "2D": "Pawn 2D",
    "2E": "Pawn 2E",
    "2F": "Pawn 2F",
    "7A": "Pawn 7A",
    "7B": "Pawn 7B",
    "7C": "Pawn 7C",
    "7D": "Pawn 7D",
    "7E": "Pawn 7E",
    "7F": "Pawn 7F",
    "1A": "Rook 1A",
    "1F": "Rook 1F",
    "1C": "White King",
    "8A": "Rook 8A",
    "8C": "Black King",
    "8F": "Rook 8F",
    "8B": "Black Knight 8B",
    "8E": "Black Knight 8E",
    "1B": "White Knight 1B",
    "1E": "White Knight 1E",
    "8D": "Black Queen 8D",
    "1D": "White Queen 1D",
    "3D": "White Special Queen",
  };
  const pawnDescription = WhatPawn[pawn] || `Unknown Piece (${pawn})`;
  round += 1;
  cgl.insertAdjacentHTML(
    "beforeend",
    `<p>${round}: ${pawnDescription} moved from ${from} to ${to}</p>`
  );
  WhoMovedLast = pawnDescription;
  MoveForPassant = from;
  PassantDouble = to;
};

let currentPlayer = "white";
function switchPlayer() {
  currentPlayer = currentPlayer === "white" ? "black" : "white";
}

function identifyPieceType(pieceId) {
  if (pieceId.startsWith("2") || pieceId.startsWith("7")) return "Pawn";
  if (
    pieceId == "1A" ||
    pieceId == "1F" ||
    pieceId == "8A" ||
    pieceId == "8F" ||
    pieceId == "1AD" ||
    pieceId == "1FD" ||
    pieceId == "8AD" ||
    pieceId == "8FD" ||
    pieceId == "1AX" ||
    pieceId == "1FX" ||
    pieceId == "8AX" ||
    pieceId == "8FX"
  ) {
    return "Rook";
  }
  if (
    pieceId == "1C" ||
    pieceId == "8C" ||
    pieceId == "1CD" ||
    pieceId == "8CD" ||
    pieceId == "8CX" ||
    pieceId == "1CX"
  ) {
    return "King";
  }
  if (
    pieceId == "1B" ||
    pieceId == "8B" ||
    pieceId == "1E" ||
    pieceId == "8E" ||
    pieceId == "1BD" ||
    pieceId == "8BD" ||
    pieceId == "1ED" ||
    pieceId == "8ED" ||
    pieceId == "1BX" ||
    pieceId == "8BX" ||
    pieceId == "1EX" ||
    pieceId == "8EX"
  ) {
    return "Knight";
  }
  if (
    pieceId == "1D" ||
    pieceId == "8D" ||
    pieceId == "1DD" ||
    pieceId == "8DD" ||
    pieceId == "1DX" ||
    pieceId == "8DX" ||
    pieceId == "3D" ||
    pieceId == "3DD" ||
    pieceId == "3DX"
  ) {
    return "Queen";
  }

  return "Unknown";
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! UI
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! UI

function drop(event) {
  event.preventDefault();

  const originalPositionId = event.dataTransfer.getData("text/plain");
  const draggedPiece = document
    .getElementById(originalPositionId)
    .querySelector("img");
  let targetCell = event.target;
  if (targetCell.tagName === "IMG") {
    targetCell = targetCell.parentNode;
  }
  if (targetCell.classList.contains("place")) {
    const toPosition = targetCell.id.replace("P", "");
    const fromPosition = originalPositionId.replace("P", "");
    let isValidMove = validateMoveByPieceType(
      draggedPiece.id,
      fromPosition,
      toPosition
    );

    if (targetCell.firstChild) {
      if (
        targetCell.firstChild.id === "8C" ||
        targetCell.firstChild.id === "1C"
      ) {
        return false;
      }
    }

    const zmienna =
      currentPlayer === "black"
        ? CheckPawnType(CheckWhitePlace3())
        : CheckPawnType(CheckBlackPlace3());

    if (
      uncover(zmienna, toPosition, draggedPiece.id) &&
      draggedPiece.id !== "8C" &&
      draggedPiece.id !== "1C"
    ) {
      isValidMove = false;
    }

    if (specialsituation) {
      isValidMove = false;
      let checkme = [draggedPiece.id, fromPosition, toPosition];
      if (existo(checkme)) {
        specialsituation = false;
        isValidMove = true;
        array1.length = 0;
        cannotRochade = true;
      }
    }

    if (draggedPiece.id === "8C" || draggedPiece.id === "1C") {
      let KingCannotMoveThere = simulatore(
        zmienna,
        toPosition,
        draggedPiece.id
      );
      if (KingCannotMoveThere) {
        isValidMove = false;
      }
    }

    if (
      (draggedPiece.id === "8C" || draggedPiece.id === "1C") &&
      isValidMove &&
      !cannotRochade
    ) {
      MoveRookwhenking(toPosition, fromPosition);
    }

    if (isValidMove) {
      while (targetCell.firstChild) {
        targetCell.removeChild(targetCell.firstChild);
      }
      targetCell.appendChild(draggedPiece);
      switchPlayer();
      updateTurnDisplay();
      cannotRochade = false;
      log(
        targetCell.id.replace("P", ""),
        draggedPiece.id,
        originalPositionId.replace("P", "")
      );
      rearrangePieces(
        kageBunshin(
          CheckPawnType(CheckWhitePlace()),
          CheckPawnType(CheckBlackPlace())
        )
      );
      rearrangePieces(
        kageBunshin2(
          CheckPawnType(CheckWhitePlace()),
          CheckPawnType(CheckBlackPlace())
        )
      );
      DeletePawnPassage(toPosition);
      testit(), console.log("the simulation board should look like this");
      testit2(), console.log("second board should look like this");
      if (draggedPiece.id === `1C`) {
        WhiteKingMoved += 1;
      }
      if (draggedPiece.id === `8C`) {
        BlackKingMoved += 1;
      }
    }
  }

  CheckWhitePlace2();
  CheckBlackPlace2();
  MyKinginCheck(CheckPawnType(CheckWhitePlace()));
  MyKinginCheck(CheckPawnType(CheckBlackPlace()));

  if (isInCheck) {
    if (currentPlayer === `black`) {
      console.log("murzyn");
      simulation(CheckPawnType(CheckBlackPlace2()));
      console.log(array1);
    }
    if (currentPlayer === "white") {
      console.log("białas");
      simulation(CheckPawnType(CheckWhitePlace2()));
      console.log(array1);
    }
  }
}

function validateMoveByPieceType(pieceId, fromPosition, toPosition) {
  let isValidMove = false;
  const pieceType = identifyPieceType(pieceId);

  switch (pieceType) {
    case "Pawn":
      isValidMove = validatePawnMove(pieceId, fromPosition, toPosition);
      break;
    case "Rook":
      isValidMove = validateRookMove(pieceId, fromPosition, toPosition);
      break;
    case "King":
      isValidMove = validateKingMove(pieceId, fromPosition, toPosition);
      break;
    case "Knight":
      isValidMove = validateKnightMove(pieceId, fromPosition, toPosition);
      break;
    case "Queen":
      isValidMove = validateQueenMove(pieceId, fromPosition, toPosition);
      break;
    default:
      console.log("Unknown piece type");
  }

  return isValidMove;
}

function updateTurnDisplay() {
  UI.textContent =
    currentPlayer === "black" ? "Black To Move" : "White To Move";
  document.querySelector(".round").textContent = `Round ${CountRounds()}`;
}

const startWhiteTimer = function () {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  updateTimerDisplay(timeWhite, "white");
  timerInterval = setInterval(function () {
    timeWhite--;
    if (timeWhite < 0) {
      clearInterval(timerInterval);
    } else {
      updateTimerDisplay(timeWhite, "white");
    }
  }, 1000);
};

const pauseWhiteTimer = function () {
  clearInterval(timerInterval);
};

const startBlackTimer = function () {
  if (timerInterval2) {
    clearInterval(timerInterval2);
  }
  updateTimerDisplay(timeBlack, "black");
  timerInterval2 = setInterval(function () {
    timeBlack--;
    if (timeBlack < 0) {
      clearInterval(timerInterval2);
    } else {
      updateTimerDisplay(timeBlack, "black");
    }
  }, 1000);
};

function updateTimerDisplay(time, color) {
  let min = String(Math.trunc(time / 60)).padStart(2, "0");
  let sec = String(time % 60).padStart(2, "0");
  if (color === "white") {
    document.querySelector(".timerwhite").textContent = `White: ${min}:${sec}`;
  } else if (color === "black") {
    document.querySelector(".timerblack").textContent = `Black: ${min}:${sec}`;
  }
}

const pauseBlackTimer = function () {
  clearInterval(timerInterval2);
};

let roundNumber = 0;
const CountRounds = function () {
  roundNumber += 1;
  if (currentPlayer === "white") {
    startWhiteTimer();
    pauseBlackTimer();
  } else {
    startBlackTimer();
    pauseWhiteTimer();
  }
  return roundNumber;
};

//? EVENTS ??????????????????????????????????????????????????????????????????????????????????????????????????????????
//* *****************************************************************************************************************
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//* *****************************************************************************************************************
//* *****************************************************************************************************************

function dragStart(event) {
  const piece = event.target;
  if (!piece.classList.contains(currentPlayer)) {
    event.preventDefault();
    return;
  }
  const currentPiecePositionId = event.target.parentNode.id;
  event.dataTransfer.setData("text/plain", currentPiecePositionId);
}

function dragOver(event) {
  event.preventDefault();
}

const CheckBlackPlace = function () {
  let elements = [];
  const rows = ["7", "8"]; // Only these rows have unique pieces based on your provided code.
  const columns = ["A", "B", "C", "D", "E", "F"];

  rows.forEach((row) => {
    columns.forEach((column) => {
      let pieceId = `${row}${column}`;
      let element = document.getElementById(pieceId);
      if (element) {
        elements.push(element.parentElement.id);
      }
    });
  });
  return elements;
};

const CheckBlackPlace2 = function () {
  let elements = [];
  const rows = ["7", "8"]; // Only these rows have unique pieces based on your provided code.
  const columns = ["A", "B", "C", "D", "E", "F"];

  rows.forEach((row) => {
    columns.forEach((column) => {
      let pieceId = `${row}${column}D`;
      let element = document.getElementById(pieceId);
      if (element) {
        elements.push(element.parentElement.id);
      }
    });
  });
  return elements;
};

const CheckWhitePlace = function () {
  let elements = [];
  const rows = ["1", "2"];
  const columns = ["A", "B", "C", "D", "E", "F"];

  rows.forEach((row) => {
    columns.forEach((column) => {
      let pieceId = `${row}${column}`;
      let element = document.getElementById(pieceId);
      if (element) {
        elements.push(element.parentElement.id);
      }
    });
  });

  if (document.getElementById("3D")) {
    elements.push(document.getElementById("3D").parentElement.id);
  }
  return elements;
};

const CheckWhitePlace2 = function () {
  let elements = [];
  const rows = ["1", "2"];
  const columns = ["A", "B", "C", "D", "E", "F"];

  rows.forEach((row) => {
    columns.forEach((column) => {
      let pieceId = `${row}${column}D`;
      let element = document.getElementById(pieceId);

      if (element) {
        elements.push(element.parentElement.id);
      }
    });
  });
  if (document.getElementById("3DD")) {
    elements.push(document.getElementById("3DD").parentElement.id);
  }
  return elements;
};

const CheckPawnType = function (elementIds) {
  let TypePlace = {};
  elementIds.forEach((id) => {
    if (id) {
      let element = document.getElementById(id);
      if (element && element.querySelector("img")) {
        TypePlace[id] = element.querySelector("img").id;
      }
    }
  });
  return TypePlace;
};

function MyKinginCheck(pieceLocations) {
  const kingId = currentPlayer === "white" ? "1C" : "8C";
  const kingPosition = document
    .getElementById(kingId)
    .parentElement.id.substring(1);
  for (const [locationId, pieceId] of Object.entries(pieceLocations)) {
    const fromPosition = locationId.substring(1);
    const toPosition = kingPosition;

    if (validateMoveByPieceType(pieceId, fromPosition, toPosition)) {
      console.log(
        `Check detected: The piece at ${fromPosition} can move to the king's position at ${toPosition}`
      );
      isInCheck = true;
      break;
    }
  }
}

function MyKinginCheck2(pieceLocations) {
  const kingId = currentPlayer === "white" ? "1CD" : "8CD";
  const kingPosition2 = document
    .getElementById(kingId)
    .parentElement.id.substring(1);

  for (const [locationId, pieceId] of Object.entries(pieceLocations)) {
    const fromPosition = locationId.substring(1);
    const toPosition = kingPosition2;
    if (validateMoveByPieceType(pieceId, fromPosition, toPosition)) {
      console.log(
        `Check detected: The piece at ${fromPosition} can move to the king's position at ${toPosition}`
      );
      return true;
    }
  }
  return false;
}

function kageBunshin(originalObject, originalObject2) {
  const transformedObject = {};

  Object.entries(originalObject).forEach(([key, value]) => {
    // Example transformation: replace 'P' with 'C2' in the key, and apply a similar rule to the value
    const newKey = key.replace("P", "C");
    const newValue = value + "D";
    transformedObject[newKey] = newValue;
  });
  Object.entries(originalObject2).forEach(([key, value]) => {
    // Example transformation: replace 'P' with 'C2' in the key, and apply a similar rule to the value
    const newKey = key.replace("P", "C");
    const newValue = value + "D";
    transformedObject[newKey] = newValue;
  });

  return transformedObject;
}

function rearrangePieces(pieceLocations) {
  const trash = document.getElementById("trash");

  Object.entries(pieceLocations).forEach(([place, imgId]) => {
    const imgElement = document.getElementById(imgId);
    const newPlaceElement = document.getElementById(place);

    if (imgElement && newPlaceElement) {
      // Move any existing child to the trash container
      while (newPlaceElement.firstChild) {
        trash.appendChild(newPlaceElement.firstChild);
      }

      // Now append the moving pawn to the new place
      newPlaceElement.appendChild(imgElement);
    } else {
      // Error handling
      if (!imgElement) {
        console.error(`No image element with id ${imgId} found in the DOM.`);
      }
      if (!newPlaceElement) {
        console.error(`No element with id ${place} found in the DOM.`);
      }
    }
  });
}

//? PIECES -----------------------------------------------------------------------------------------------------------

function validateQueenMove(pieceId, fromPosition, toPosition) {
  const SecondBoardPiece = pieceId.charAt(2) === "D";
  const ThirdBoardPiece = pieceId.charAt(2) === "X";
  const fromCol = fromPosition[1];
  const toCol = toPosition[1];
  const fromRow = parseInt(fromPosition[0], 10);
  const toRow = parseInt(toPosition[0], 10);
  const isWithinBoardLimits =
    toRow >= 1 && toRow <= 8 && toCol >= "A" && toCol <= "F";

  const colToNum = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 };
  const fromColNum = colToNum[fromCol];
  const toColNum = colToNum[toCol];
  let isPathClear = true;

  if (fromRow === toRow || fromCol === toCol) {
    // Horizontal or vertical move
    const range =
      fromRow === toRow
        ? [Math.min(fromColNum, toColNum), Math.max(fromColNum, toColNum)]
        : [Math.min(fromRow, toRow), Math.max(fromRow, toRow)];
    for (let i = range[0] + 1; i < range[1]; i++) {
      let cellId =
        fromRow === toRow
          ? `P${fromRow}${String.fromCharCode(64 + i)}`
          : `P${i}${fromCol}`;
      if (SecondBoardPiece) {
        cellId =
          fromRow === toRow
            ? `C${fromRow}${String.fromCharCode(64 + i)}`
            : `C${i}${fromCol}`;
      }
      if (ThirdBoardPiece) {
        cellId =
          fromRow === toRow
            ? `X${fromRow}${String.fromCharCode(64 + i)}`
            : `X${i}${fromCol}`;
      }
      if (document.getElementById(cellId).querySelector("img")) {
        isPathClear = false;
        break;
      }
    }
  } else if (Math.abs(fromRow - toRow) === Math.abs(fromColNum - toColNum)) {
    // Diagonal move
    let steps = Math.abs(fromRow - toRow);
    for (let step = 1; step < steps; step++) {
      let checkRow = fromRow + (toRow > fromRow ? step : -step);
      let checkColNum = fromColNum + (toColNum > fromColNum ? step : -step);
      let checkCol = String.fromCharCode(64 + checkColNum);
      if (!SecondBoardPiece && !ThirdBoardPiece) {
        if (
          document
            .getElementById(`P${checkRow}${checkCol}`)
            .querySelector("img")
        ) {
          isPathClear = false;
          break;
        }
      }
      if (SecondBoardPiece) {
        if (
          document
            .getElementById(`C${checkRow}${checkCol}`)
            .querySelector("img")
        ) {
          isPathClear = false;
          break;
        }
      }
      if (ThirdBoardPiece) {
        if (
          document
            .getElementById(`X${checkRow}${checkCol}`)
            .querySelector("img")
        ) {
          isPathClear = false;
          break;
        }
      }
    }
  } else {
    return false;
  }

  let targetCellId = `P${toRow}${toCol}`;
  if (SecondBoardPiece) {
    targetCellId = `C${toPosition}`;
  }
  if (ThirdBoardPiece) {
    targetCellId = `X${toPosition}`;
  }
  const targetCell = document.getElementById(targetCellId);
  const isTargetCellOccupied = targetCell.querySelector("img") !== null;
  const isWhitePiece = pieceId.startsWith("1") || pieceId.startsWith("3");
  const opponentColorClass = isWhitePiece ? "black" : "white";

  if (isPathClear && isWithinBoardLimits) {
    if (isTargetCellOccupied) {
      const targetPiece = targetCell.querySelector("img");
      return targetPiece.classList.contains(opponentColorClass);
    } else {
      return true;
    }
  }

  return false;
}

function validateKnightMove(pieceId, fromPosition, toPosition) {
  const SecondBoardPiece = pieceId.charAt(2) === "D";
  const ThirdBoardPiece = pieceId.charAt(2) === "X";
  const fromCol = fromPosition[1];
  const toCol = toPosition[1];
  const fromRow = parseInt(fromPosition[0], 10);
  const toRow = parseInt(toPosition[0], 10);
  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol.charCodeAt(0) - toCol.charCodeAt(0));
  const isValidStep =
    (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  const isWithinBoardLimits =
    toRow >= 1 && toRow <= 8 && toCol >= "A" && toCol <= "F";

  if (isValidStep && isWithinBoardLimits) {
    let targetCellId = `P${toPosition}`;
    if (SecondBoardPiece) {
      targetCellId = `C${toPosition}`;
    }
    if (ThirdBoardPiece) {
      targetCellId = `X${toPosition}`;
    }

    const targetCell = document.getElementById(targetCellId);
    const targetPiece = targetCell.querySelector("img");
    const isWhitePiece = pieceId.startsWith("1");
    const opponentColorClass = isWhitePiece ? "black" : "white";
    const isTargetCellOccupiedByOpponent =
      targetPiece && targetPiece.classList.contains(opponentColorClass);

    // This check is removed to ensure the function returns true for valid moves, including those against the king
    return !targetCell.querySelector("img") || isTargetCellOccupiedByOpponent;
  }
  return false;
}

function validateKingMove(pieceId, fromPosition, toPosition) {
  const SecondBoardPiece = pieceId.charAt(2) === "D";
  const ThirdBoardPiece = pieceId.charAt(2) === "X";
  const isWhitePiece = pieceId.startsWith("1");
  const opponentColorClass = isWhitePiece ? "black" : "white";

  const fromCol = fromPosition[1];
  const toCol = toPosition[1];
  const fromRow = parseInt(fromPosition[0], 10);
  const toRow = parseInt(toPosition[0], 10);

  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol.charCodeAt(0) - toCol.charCodeAt(0));

  const isValidStep =
    (rowDiff === 1 && colDiff === 0) ||
    (colDiff === 1 && rowDiff === 0) ||
    (rowDiff === 1 && colDiff === 1);
  const isWithinBoardLimits =
    toRow >= 1 && toRow <= 8 && toCol >= "A" && toCol <= "F";

  let targetCellId = `P${toPosition}`;
  if (SecondBoardPiece) {
    targetCellId = `C${toPosition}`;
  }
  if (ThirdBoardPiece) {
    targetCellId = `X${toPosition}`;
  }
  const targetCell = document.getElementById(targetCellId);
  const isTargetCellOccupiedByOpponent =
    targetCell.querySelector("img") &&
    targetCell.querySelector("img").classList.contains(opponentColorClass);

  if (pieceId === `1C`) {
    if (fromPosition === `1C`) {
      if (toPosition === `1B`) {
        if (
          WhiteKingMoved === 0 &&
          LeftWhiteRookMoved === 0 &&
          !document.getElementById(`P1B`).firstChild
        ) {
          if (
            isValidStep &&
            isWithinBoardLimits &&
            (!targetCell.querySelector("img") || isTargetCellOccupiedByOpponent)
          ) {
            return true;
          } else {
            return false;
          }
        }
      }

      if (toPosition === `1E`) {
        if (
          WhiteKingMoved === 0 &&
          LeftWhiteRookMoved === 0 &&
          !document.getElementById(`P1D`).firstChild &&
          !document.getElementById(`P1E`).firstChild
        )
          if (
            !targetCell.querySelector("img") ||
            isTargetCellOccupiedByOpponent
          ) {
            return true;
          } else {
            return false;
          }
      }
    }
  } else if (pieceId === "8C") {
    if (fromPosition === `8C`) {
      if (toPosition === `8B`) {
        if (
          BlackKingMoved === 0 &&
          LeftBlackRookMoved === 0 &&
          !document.getElementById(`P8B`).firstChild
        ) {
          if (
            isValidStep &&
            isWithinBoardLimits &&
            (!targetCell.querySelector("img") || isTargetCellOccupiedByOpponent)
          ) {
            return true;
          } else {
            return false;
          }
        }
      }
      if (toPosition === `8E`) {
        if (
          BlackKingMoved === 0 &&
          RightBlackRookMoved === 0 &&
          !document.getElementById(`P8D`).firstChild &&
          !document.getElementById(`P8E`).firstChild
        ) {
          if (
            !targetCell.querySelector("img") ||
            isTargetCellOccupiedByOpponent
          ) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  }

  if (
    isValidStep &&
    isWithinBoardLimits &&
    (!targetCell.querySelector("img") || isTargetCellOccupiedByOpponent)
  ) {
    return true;
  } else {
    return false;
  }
}

const MoveRookwhenking = function (toPosition, fromPosition) {
  if (toPosition === `1B` && fromPosition === `1C`) {
    document.getElementById(`P1C`).appendChild(document.getElementById(`1A`));
  }
  if (toPosition === `1E` && fromPosition === `1C`) {
    document.getElementById(`P1D`).appendChild(document.getElementById(`1F`));
  }
  if (toPosition === `8B` && fromPosition === `8C`) {
    document.getElementById(`P8C`).appendChild(document.getElementById(`8A`));
  }
  if (toPosition === `8E` && fromPosition === `8C`) {
    document.getElementById(`P8D`).appendChild(document.getElementById(`8F`));
  }
};

function validateRookMove(pieceId, fromPosition, toPosition) {
  const SecondBoardPiece = pieceId.charAt(2) === "D";
  const ThirdBoardPiece = pieceId.charAt(2) === "X";
  const isWhitePiece = pieceId.startsWith("1") || pieceId.startsWith("2");
  const isLeftSide = pieceId.charAt(1) === "A";
  const fromCol = fromPosition[1];
  const toCol = toPosition[1];
  const fromRow = parseInt(fromPosition[0], 10);
  const toRow = parseInt(toPosition[0], 10);
  let isPathClear = true;
  if (fromRow === toRow) {
    const startCol = Math.min(fromCol.charCodeAt(0), toCol.charCodeAt(0));
    const endCol = Math.max(fromCol.charCodeAt(0), toCol.charCodeAt(0));
    for (let col = startCol + 1; col < endCol; col++) {
      let cellId = `P${fromRow}${String.fromCharCode(col)}`;
      if (SecondBoardPiece) {
        cellId = `C${fromRow}${String.fromCharCode(col)}`;
      }
      if (ThirdBoardPiece) {
        cellId = `X${fromRow}${String.fromCharCode(col)}`;
      }
      if (document.getElementById(cellId).querySelector("img")) {
        isPathClear = false;
        break;
      }
    }
  } else if (fromCol === toCol) {
    const startRow = Math.min(fromRow, toRow);
    const endRow = Math.max(fromRow, toRow);
    for (let row = startRow + 1; row < endRow; row++) {
      let cellId = `P${row}${fromCol}`;
      if (SecondBoardPiece) {
        cellId = `C${row}${fromCol}`;
      }
      if (ThirdBoardPiece) {
        cellId = `X${row}${fromCol}`;
      }
      if (document.getElementById(cellId).querySelector("img")) {
        isPathClear = false;
        break;
      }
    }
  } else {
    return false;
  }

  let targetCellId = `P${toPosition}`;
  if (SecondBoardPiece) {
    targetCellId = `C${toPosition}`;
  }
  if (ThirdBoardPiece) {
    targetCellId = `X${toPosition}`;
  }
  const targetCell = document.getElementById(targetCellId);
  const isTargetCellOccupied = !!targetCell.querySelector("img");
  const opponentColorClass = isWhitePiece ? "black" : "white";

  if (isPathClear && (SecondBoardPiece || ThirdBoardPiece)) {
    if (isTargetCellOccupied) {
      const targetPiece = targetCell.querySelector("img");
      return targetPiece.classList.contains(opponentColorClass);
    }
    return true;
  }

  if (isPathClear && !SecondBoardPiece && !ThirdBoardPiece) {
    if (isTargetCellOccupied) {
      const targetPiece = targetCell.querySelector("img");
      if (targetPiece.classList.contains(opponentColorClass)) {
        rookadd(isWhitePiece, isLeftSide);
        return true;
      }
      return false;
    } else {
      rookadd(isWhitePiece, isLeftSide);
      return true;
    }
  }
  return false;
}

const rookadd = function (a, b) {
  if (a) {
    if (b) {
      LeftWhiteRookMoved += 1;
    } else if (!b) {
      RightWhiteRookMoved += 1;
    }
  } else {
    if (b) {
      LeftBlackRookMoved += 1;
    } else if (!b) {
      RightBlackRookMoved += 1;
    }
  }
};

function validatePawnMove(pieceId, fromPosition, toPosition) {
  const SecondBoardPiece = pieceId.charAt(2) === "D";
  const ThirdBoardPiece = pieceId.charAt(2) === "X";
  const fromCol = fromPosition[1];
  const toCol = toPosition[1];
  const fromRow = parseInt(fromPosition[0], 10);
  const toRow = parseInt(toPosition[0], 10);
  const isSameColumn = fromCol === toCol;

  const columnDifference = Math.abs(
    fromCol.charCodeAt(0) - toCol.charCodeAt(0)
  );
  let isValidMove = false;
  let targetCellId = `P${toPosition}`;
  if (SecondBoardPiece) {
    targetCellId = `C${toPosition}`;
  }
  if (ThirdBoardPiece) {
    targetCellId = `X${toPosition}`;
  }
  const targetCell = document.getElementById(targetCellId);
  const isTargetCellOccupied = targetCell.querySelector("img") ? true : false;
  let isPathClear = true;
  if (Math.abs(toRow - fromRow) === 2) {
    const middleRow = (fromRow + toRow) / 2;
    let middleCellId = `P${middleRow}${fromCol}`;
    if (SecondBoardPiece) {
      middleCellId = `C${middleRow}${fromCol}`;
    }
    if (ThirdBoardPiece) {
      middleCellId = `X${middleRow}${fromCol}`;
    }
    const middleCell = document.getElementById(middleCellId);
    isPathClear = !middleCell.querySelector("img");
  }

  const isWhitePawn = pieceId.startsWith("2");
  const opponentColorClass = isWhitePawn ? "black" : "white";

  if (columnDifference === 1 && isTargetCellOccupied) {
    const targetPiece = targetCell.querySelector("img");
    if (targetPiece.classList.contains(opponentColorClass)) {
      isValidMove = isWhitePawn ? toRow - fromRow === 1 : fromRow - toRow === 1;
    }
  } else if (isSameColumn && !isTargetCellOccupied) {
    if (isWhitePawn) {
      if (fromRow === 2 && toRow === 4 && isPathClear) {
        isValidMove = true;
      } else if (toRow - fromRow === 1) {
        isValidMove = true;
      }
    } else {
      if (fromRow === 7 && toRow === 5 && isPathClear) {
        isValidMove = true;
      } else if (fromRow - toRow === 1) {
        isValidMove = true;
      }
    }
  }
  if (
    MoveForPassant[0] === "7" &&
    PassantDouble[0] === "5" &&
    Pawns[WhoMovedLast][0] === "7" &&
    fromRow === 5 &&
    toRow === 6 &&
    columnDifference === 1 &&
    MoveForPassant[1] === toCol
  ) {
    isValidMove = true;
    deletePawn = true;
  }
  if (
    MoveForPassant[0] === "2" &&
    PassantDouble[0] === "4" &&
    Pawns[WhoMovedLast][0] === "2" &&
    fromRow === 4 &&
    toRow === 3 &&
    columnDifference === 1 &&
    MoveForPassant[1] === toCol
  ) {
    isValidMove = true;
    deletePawn = true;
  }
  return isValidMove;
}

function DeletePawnPassage(toPosition) {
  if (deletePawn) {
    currentPlayer === `white`
      ? document.getElementById(`${toPosition[0] - 1}${toPosition[1]}`).remove()
      : document
          .getElementById(`${+toPosition[0] + 1}${toPosition[1]}`)
          .remove();
    deletePawn = false;
  }
}

function simulation(pieceLocations) {
  console.log(pieceLocations);
  for (const [currentLocation, pieceId] of Object.entries(pieceLocations)) {
    for (const potentialMove of ments) {
      if (
        validateMoveByPieceType(
          pieceId,
          currentLocation.slice(1),
          potentialMove
        )
      ) {
        let jeb = document.getElementById(pieceId);
        let dzidy = document.getElementById(`C` + potentialMove);

        if (pieceId === "8DD") {
          console.log(dzidy.firstChild);
        }

        while (dzidy.firstChild) {
          trash.appendChild(dzidy.firstChild);
        }
        dzidy.appendChild(jeb);

        if (pieceId === "8DD") {
          console.log(dzidy.firstChild);
          console.log(currentPlayer);
          console.log(CheckPawnType(CheckWhitePlace2()));

          // C2F:"2FD" this is the problem
          // P7D: "3D"
          // console.log(MyKinginCheck2(CheckPawnType(CheckWhitePlace2())));
        }

        if (
          currentPlayer === `black`
            ? !MyKinginCheck2(CheckPawnType(CheckWhitePlace2()))
            : !MyKinginCheck2(CheckPawnType(CheckBlackPlace2()))
        ) {
          array1.push([
            pieceId.slice(0, -1),
            currentLocation.substring(1),
            dzidy.id.substring(1),
          ]);
        }

        rearrangePieces(
          kageBunshin(
            CheckPawnType(CheckWhitePlace()),
            CheckPawnType(CheckBlackPlace())
          )
        );
      }
    }
  }

  if (array1.length === 0) {
    console.log("szach mat");
  } else {
    console.log("nie ma szacha");
    specialsituation = true;
    isInCheck = false;
  }
}

function existo(targetArray) {
  return array1.some(
    (subArray) =>
      subArray.length === targetArray.length &&
      subArray.every((element, index) => element === targetArray[index])
  );
}

let testit = function () {
  const calculationBoard = document.getElementById("kingboard");
  const children = calculationBoard.children;
  let arrayOfArrays = [];
  let tempArray = [];
  const groupSize = 6;

  for (let i = 0; i < children.length; i++) {
    // Check if the current child has any children (specifically looking for <img> elements)
    if (children[i].children.length > 0) {
      // Assuming there's only one <img> per <div>, get the <img> id
      const imgId = children[i].children[0].id || "no-img-id";
      tempArray.push(imgId);
    } else {
      tempArray.push(".");
    }

    if (tempArray.length === groupSize || i === children.length - 1) {
      arrayOfArrays.push(tempArray);
      tempArray = [];
    }
  }
  console.log(arrayOfArrays);
  arrayOfArrays = [];
};

let testit2 = function () {
  const calculationBoard2 = document.getElementById("calculationBoard");
  const children2 = calculationBoard2.children;
  let arrayOfArrays2 = [];
  let tempArray2 = [];
  const groupSize2 = 6;

  for (let i = 0; i < children2.length; i++) {
    // Check if the current child has any children (specifically looking for <img> elements)
    if (children2[i].children.length > 0) {
      // Assuming there's only one <img> per <div>, get the <img> id
      const imgId = children2[i].children[0].id || "no-img-id";
      tempArray2.push(imgId);
    } else {
      tempArray2.push(".");
    }

    if (tempArray2.length === groupSize2 || i === children2.length - 1) {
      arrayOfArrays2.push(tempArray2);
      tempArray2 = [];
    }
  }
  console.log(arrayOfArrays2);
  arrayOfArrays2 = [];
};

function kageBunshin2(originalObject, originalObject2) {
  const transformedObject = {};

  Object.entries(originalObject).forEach(([key, value]) => {
    // Example transformation: replace 'P' with 'C2' in the key, and apply a similar rule to the value
    const newKey = key.replace("P", "X");
    const newValue = value + "X";
    transformedObject[newKey] = newValue;
  });
  Object.entries(originalObject2).forEach(([key, value]) => {
    // Example transformation: replace 'P' with 'C2' in the key, and apply a similar rule to the value
    const newKey = key.replace("P", "X");
    const newValue = value + "X";
    transformedObject[newKey] = newValue;
  });
  return transformedObject;
}

const CheckBlackPlace3 = function () {
  let elements = [];
  const rows = ["7", "8"]; // Only these rows have unique pieces based on your provided code.
  const columns = ["A", "B", "C", "D", "E", "F"];

  rows.forEach((row) => {
    columns.forEach((column) => {
      let pieceId = `${row}${column}X`;
      let element = document.getElementById(pieceId);
      if (element) {
        elements.push(element.parentElement.id);
      }
    });
  });
  return elements;
};

const CheckWhitePlace3 = function () {
  let elements = [];
  const rows = ["1", "2"];
  const columns = ["A", "B", "C", "D", "E", "F"];

  rows.forEach((row) => {
    columns.forEach((column) => {
      let pieceId = `${row}${column}X`;
      let element = document.getElementById(pieceId);

      if (element) {
        elements.push(element.parentElement.id);
      }
    });
  });
  if (document.getElementById("3DX")) {
    elements.push(document.getElementById("3DX").parentElement.id);
  }
  return elements;
};

const simulatore = function (enemies, position, hero) {
  let jeb = document.getElementById(hero + `X`);
  let dzidy = document.getElementById(`X` + position);
  let counter = 0;
  while (dzidy.firstChild) {
    trash.appendChild(dzidy.firstChild);
  }
  dzidy.appendChild(jeb);
  for (const [currentLocation, pieceId] of Object.entries(enemies)) {
    if (currentLocation.slice(1) === position) {
      continue;
    }

    if (
      validateMoveByPieceType(pieceId, currentLocation.slice(1), position) &&
      pieceId != jeb.id
    ) {
      counter += 1;
    }
  }
  return counter > 0;
};

const uncover = function (enemies, position, hero) {
  let jeb = document.getElementById(hero + `X`);
  let dzidy = document.getElementById(`X` + position);
  let counter = 0;

  while (dzidy.firstChild) {
    trash.appendChild(dzidy.firstChild);
  }
  dzidy.appendChild(jeb);

  if (MyKinginCheck3(enemies)) {
    counter += 1;
  }

  rearrangePieces(
    kageBunshin2(
      CheckPawnType(CheckWhitePlace()),
      CheckPawnType(CheckBlackPlace())
    )
  );
  return counter > 0;
};

function MyKinginCheck3(pieceLocations) {
  const kingId = currentPlayer === "white" ? "1CX" : "8CX";
  const kingPosition2 = document
    .getElementById(kingId)
    .parentElement.id.substring(1);

  for (const [locationId, pieceId] of Object.entries(pieceLocations)) {
    const fromPosition = locationId.substring(1);
    const toPosition = kingPosition2;
    if (validateMoveByPieceType(pieceId, fromPosition, toPosition)) {
      console.log(
        `Check detected: The piece at ${fromPosition} can move to the king's position at ${toPosition}`
      );
      return true;
    }
  }
  return false;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.piece[draggable="true"]').forEach((piece) => {
    piece.addEventListener("dragstart", dragStart);
  });

  document.querySelectorAll(".place").forEach((gridCell) => {
    gridCell.addEventListener("dragover", dragOver);
    gridCell.addEventListener("drop", drop);
  });
});

!MyKinginCheck2(CheckPawnType(CheckWhitePlace2()));

validateMoveByPieceType(pieceId, fromPosition, toPosition);


MyKinginCheck2 - sprawdza czy:

król na tablicy 2 wciąż jest bity 
jest bity na miejscu króla



problem:
czarna damka
biała damka
czarny koń 