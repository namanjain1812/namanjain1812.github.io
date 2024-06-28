const chessboard = document.getElementById('chessboard');
let selectedPiece = null; // Store the currently selected piece
let isWhiteTurn = true;

// Function to create a chessboard square
function createSquare(row, col) {
  const square = document.createElement('div');
  square.classList.add('square', (row + col) % 2 === 0 ? 'light' : 'dark');
  square.id = `square-${row}-${col}`;
  chessboard.appendChild(square);
  return square;
}

// Initialize the board array - representing the chessboard state
const board = [
    ['black-rook', 'black-knight', 'black-bishop', 'black-queen', 'black-king', 'black-bishop', 'black-knight', 'black-rook'],
    ['black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn'],
    ['white-rook', 'white-knight', 'white-bishop', 'white-queen', 'white-king', 'white-bishop', 'white-knight', 'white-rook'],
];

// Function to add a chess piece to the board
function addPiece(pieceCode, row, col) {
  const square = document.getElementById(`square-${row}-${col}`);
  const piece = document.createElement('div');
  piece.classList.add('piece', pieceCode);
  square.appendChild(piece);
  // Update the board array
  board[row][col] = pieceCode;
}

// Create the board squares
for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    createSquare(row, col);
  }
}

//Place pawns
for (let col = 0; col < 8; col++) {
  addPiece('black-pawn', 1, col);
  addPiece('white-pawn', 6, col);
}

// Place other black pieces
addPiece('black-rook', 0, 0);
addPiece('black-knight', 0, 1);
addPiece('black-bishop', 0, 2);
addPiece('black-queen', 0, 3);
addPiece('black-king', 0, 4);
addPiece('black-bishop', 0, 5);
addPiece('black-knight', 0, 6);
addPiece('black-rook', 0, 7);

// Place other white pieces
addPiece('white-rook', 7, 0);
addPiece('white-knight', 7, 1);
addPiece('white-bishop', 7, 2);
addPiece('white-queen', 7, 3);
addPiece('white-king', 7, 4);
addPiece('white-bishop', 7, 5);
addPiece('white-knight', 7, 6);
addPiece('white-rook', 7, 7);


// Event listener for piece selection and movement
chessboard.addEventListener('click', (event) => {
    const clickedSquare = event.target.closest('.square'); 
    
    if (clickedSquare) { 
      const squareId = clickedSquare.id;
      const [_, row, col] = squareId.split('-').map(Number); // Get row, col from ID
  
      if (selectedPiece) {
        // A piece is already selected, try to move it
        if (isValidMove(selectedPiece, row, col)) {
          movePiece(selectedPiece, row, col); 
          selectedPiece = null; // Deselect after moving
        } else {
          // Invalid move - you might want to handle this with feedback to the user
          selectedPiece = null; // Deselect for now
        }
      } else {
        // No piece selected, check if clicking on a piece
        const piece = clickedSquare.querySelector('.piece');
        console.log(piece);
        if (piece) {
            const pieceColor = piece.classList[1].split('-')[0];
            if ((isWhiteTurn && pieceColor === 'white') || (!isWhiteTurn && pieceColor === 'black')) {
                selectedPiece = {
                    element: piece,
                    row,
                    col
                };

            }
            
          console.log(selectedPiece);
          // Highlight valid moves (optional) - you'll need to implement this
          // highlightMoves(selectedPiece); 
        }
      }
    }
});

// Function to check if a move is valid
function isValidMove(piece, newRow, newCol) {
    console.log(piece.element.classList);
    const pieceType = piece.element.classList[1]; // Get the piece type (e.g., 'white-rook', 'black-pawn') 
    // const pieceType =  piece.element ? piece.element.classList[1] : piece.element.classList;
    // if (piece.element instanceof HTMLElement) { 
    //     pieceType = piece.element.classList[1]; 
    //   } else {
    //     pieceType = piece.element.classList[0]; // Assuming your simulated object
    //   }
    console.log(pieceType);
    // Basic validation (replace with more specific rules for each piece):
    let isValidPieceMove = false;
    if (pieceType === 'white-pawn' || pieceType === 'black-pawn') {
        isValidPieceMove = isValidPawnMove(piece, newRow, newCol);
    } else if (pieceType === 'white-rook' || pieceType === 'black-rook') {
        isValidPieceMove = isValidRookMove(piece, newRow, newCol);
    } else if (pieceType === 'white-knight' || pieceType === 'black-knight') {
        isValidPieceMove = isValidKnightMove(piece, newRow, newCol);
    } else if (pieceType === 'white-bishop' || pieceType === 'black-bishop') {
        isValidPieceMove = isValidBishopMove(piece, newRow, newCol);
    } else if (pieceType === 'white-king' || pieceType === 'black-king') {
        isValidPieceMove = isValidKingMove(piece, newRow, newCol);
    } else if (pieceType === 'white-queen' || pieceType === 'black-queen') {
        isValidPieceMove = isValidQueenMove(piece, newRow, newCol);
    }    
    // console.log(isValidPieceMove);
    // 2. Check for Self-Check ONLY IF the piece's move is valid:
    if (isValidPieceMove) {
        // ... (perform the hypothetical move and check for self-check as in the previous example) ...
        // *** 1. Hypothetical Move on the Board Array: ***
        const oldRow = piece.row;
        const oldCol = piece.col;
        board[newRow][newCol] = board[oldRow][oldCol]; // Place piece in the new position
        board[oldRow][oldCol] = null;                 // Clear the old position

        // *** 2. Check for Self-Check: ***
        const playerColor = piece.element.classList[1].split('-')[0];
        console.log(playerColor);
        if (isKingInCheck(playerColor)) {
            // ... undo the move and return false (illegal move) ...
            // *** 3. Undo the Hypothetical Move: *** 
            board[oldRow][oldCol] = board[newRow][newCol]; // Put piece back 
            board[newRow][newCol] = null;                // Clear new position 

            return false; // Move is illegal (self-check)

        } 
        // *** 4. Undo the Hypothetical Move (if the move was valid): ***
        board[oldRow][oldCol] = board[newRow][newCol]; // Put piece back
        board[newRow][newCol] = null;                // Clear new position
    // ... undo the move (even if it was valid) ... 
  }

  return isValidPieceMove; // Return the result of piece-specific validation
    
}
  
// Function to move a piece
function movePiece(piece, newRow, newCol) {
    const oldRow = piece.row;
    const oldCol = piece.col;
    // console.log(piece.element.classList[1].split('-')[0]);
    // Check if the opponent is now in check:
  if (isKingInCheck(piece.element.classList[1].split('-')[0] === 'white' ? 'black' : 'white')) {
    console.log("Opponent is in Check!"); // Or update UI to indicate check
    // ... you'll likely need additional logic to handle checkmate later
  }


    // 1. Update the board array
    board[newRow][newCol] = board[oldRow][oldCol]; // Move the piece
    board[oldRow][oldCol] = null; // Clear the old square

    // 2. Update the DOM
    const newSquare = document.getElementById(`square-${newRow}-${newCol}`);
    newSquare.appendChild(piece.element); 

    // *** HANDLE CAPTURES IN THE DOM ***
   const existingPiece = newSquare.querySelector('.piece'); // Check for a piece on target square
   if (existingPiece) {
       newSquare.removeChild(existingPiece); // Remove the captured piece from the DOM
   }

   newSquare.appendChild(piece.element); // Move the capturing piece

    // Update the piece's internal position
    piece.row = newRow;
    piece.col = newCol;
    
    // Switch turns AFTER a successful move
    isWhiteTurn = !isWhiteTurn; 
}
// --- Piece-Specific Movement Logic ---
  
// Pawn Movement (basic - no en passant or promotion yet)
function isValidPawnMove(piece, newRow, newCol) {
    const { row, col } = piece;
    const isWhite = piece.element.classList.contains('white-pawn'); 
  
    const direction = isWhite ? -1 : 1; // White pawns move up, black pawns move down
  
    // One square forward (or two from starting position)
    if (newCol === col && newRow === row + direction && !isPieceAt(newRow, newCol)) {
      return true; 
    } 
  
    // Two squares forward (only from starting position)
    if (isWhite && row === 6 && newRow === 4 && newCol === col && !isPieceAt(newRow, newCol) && !isPieceAt(row + direction, col)) {
      return true; 
    }
    if (!isWhite && row === 1 && newRow === 3 && newCol === col && !isPieceAt(newRow, newCol) && !isPieceAt(row + direction, col)) {
      return true;
    }
  
    // Diagonal capture (one square diagonally)
    if (Math.abs(newCol - col) === 1 && newRow === row + direction && isPieceAt(newRow, newCol) && isOpponentPiece(piece, newRow, newCol)) {
      return true;
    }
  
    return false;
}
  
// Rook Movement (horizontal and vertical)
function isValidRookMove(piece, newRow, newCol) {
    const { row, col } = piece;
  
    // Check if moving horizontally or vertically
    if (newRow === row || newCol === col) {
      // Check for obstacles (pieces in the path)
      if (newRow === row) {
        for (let c = Math.min(col, newCol) + 1; c < Math.max(col, newCol); c++) {
          if (isPieceAt(newRow, c)) return false;
        }
      } else {
        for (let r = Math.min(row, newRow) + 1; r < Math.max(row, newRow); r++) {
          if (isPieceAt(r, newCol)) return false;
        }
      }
      // Check if the destination is empty or an opponent's piece
      return !isPieceAt(newRow, newCol) || isOpponentPiece(piece, newRow, newCol); 
    }
  
    return false;
}
  
// Knight Movement (L-shape)
  function isValidKnightMove(piece, newRow, newCol) {
    const { row, col } = piece;
  
    const validKnightMoves = [
      [row - 2, col - 1], [row - 2, col + 1],
      [row - 1, col - 2], [row - 1, col + 2],
      [row + 1, col - 2], [row + 1, col + 2],
      [row + 2, col - 1], [row + 2, col + 1]
    ];
  
    // Check if the new position is within the board and a valid knight move
    return validKnightMoves.some(([r, c]) => r === newRow && c === newCol &&
                                           (newRow >= 0 && newRow <= 7 && 
                                            newCol >= 0 && newCol <= 7) &&
                                           (!isPieceAt(newRow, newCol) || isOpponentPiece(piece, newRow, newCol)));
}

// Bishop Movement
function isValidBishopMove(piece, newRow, newCol) {
    const { row, col } = piece;

    // Check if the move is diagonal
  if (Math.abs(newRow - row) !== Math.abs(newCol - col)) {
    return false; // Not a diagonal move
  }
  // Determine the direction of the diagonal move
  const rowDir = newRow > row ? 1 : -1;
  const colDir = newCol > col ? 1 : -1;

  // Check for obstacles in the path
  let currentRow = row + rowDir;
  let currentCol = col + colDir;
  while (currentRow !== newRow) { // Stop one square before the destination
    if (isPieceAt(currentRow, currentCol)) {
      return false; // Obstacle in the way
    }
    currentRow += rowDir;
    currentCol += colDir;
  }

  // Check if the destination is empty or an opponent's piece
  return !isPieceAt(newRow, newCol) || isOpponentPiece(piece, newRow, newCol);

}

// King Movement (one square in any direction)
function isValidKingMove(piece, newRow, newCol) {
    const { row, col } = piece;
  
    // Calculate the row and column differences
    const rowDiff = Math.abs(newRow - row);
    const colDiff = Math.abs(newCol - col);
  
    // Check if the move is within one square in any direction
    if (rowDiff <= 1 && colDiff <= 1) { 
      // Check if the destination is empty or an opponent's piece
      return !isPieceAt(newRow, newCol) || isOpponentPiece(piece, newRow, newCol);
    }
  
    // Castling Logic (You'll need to implement this separately)
    // if (isValidCastlingMove(piece, newRow, newCol)) {
    //   return true; 
    // }
  
    // Invalid move if not within one square or a valid castling move
    return false; 
  }

// function isValidKingMove(piece, newRow, newCol) {
//     const { row, col } = piece;
    
//     if (Math.abs(newRow-row)>1 || Math.abs(newCol-col)>1) {
//         return false; // Can only move step in any direction
//     }
   
//     if(isPieceAt(newRow, newCol)){
//         return false;
//     } else return true;

// }

// Queen Movement (horizontal, vertical, and diagonal)
function isValidQueenMove(piece, newRow, newCol) {
    const { row, col } = piece;
  
    // Check if moving horizontally, vertically, or diagonally
    const isHorizontalOrVertical = (newRow === row || newCol === col);
    const isDiagonal = (Math.abs(newRow - row) === Math.abs(newCol - col));
  
    if (!isHorizontalOrVertical && !isDiagonal) {
      return false; // Not a valid queen move pattern
    }
  
    // Check for obstacles (reusing Rook and Bishop logic)
    if (isHorizontalOrVertical) {
      // Reuse the Rook's obstacle checking logic:
      return isValidRookMove(piece, newRow, newCol); 
    } else if (isDiagonal) {
      // Reuse the Bishop's obstacle checking logic:
      return isValidBishopMove(piece, newRow, newCol); 
    } 
}

// Function to check if the king of the specified color is in check
function isKingInCheck(kingColor) {
    // 1. Find the King's Position:
    let kingRow, kingCol;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const pieceCode = board[row][col];
        if (pieceCode && pieceCode === `${kingColor}-king`) { // Match pieceCode with king color
          kingRow = row;
          kingCol = col;
        //   console.log(pieceCode);
        //   console.log(kingRow,kingCol);
          break; // Found the king, exit the inner loop
        }
      }
      if (kingRow !== undefined) break; // King found, exit the outer loop
    }
  
    // 2. Check if any opponent's piece can attack the king:
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const pieceCode = board[row][col];
        if (pieceCode && pieceCode.startsWith(kingColor === 'white' ? 'black' : 'white')) { 
          // It's an opponent's piece
          const piece = { element: { classList: [pieceCode] }, row, col }; // Simulate a piece object
            console.log(piece);
          // Important: Assume a hypothetical move, DON'T actually move the piece
          if (isValidMove(piece, kingRow, kingCol)) { 
            // If an opponent's piece can "attack" the king's square, the king is in check
            // console.log("King is in check");
            return true; 
          }
        }
      }
    }
  
    //3. If no attack is found, the king is safe:
    return false; 
}

  
// Helper Functions:
// (You might want to move these outside the event listener)
function isPieceAt(row, col) {
    const square = document.getElementById(`square-${row}-${col}`);
    return square.querySelector('.piece') !== null; 
}
  
function isOpponentPiece(piece, row, col) {
    const targetPiece = document.getElementById(`square-${row}-${col}`).querySelector('.piece');
    if (!targetPiece) { // Return false if there's no piece at the destination
      return false; 
    }
  
    // Compare the first part of the class names to check for different colors
    const pieceColor = piece.element.classList[1].split('-')[0]; // 'white' or 'black'
    const targetColor = targetPiece.classList[1].split('-')[0]; // 'white' or 'black'
  
    return pieceColor !== targetColor; 
  }