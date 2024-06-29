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

// --- Piece-Specific Movement Logic ---
  
// Pawn Movement (basic - no en passant or promotion yet)
function isValidPawnMove(piece, newRow, newCol, boardToUse) {
    const { row, col } = piece;
    const pieceType = typeof piece.element === 'string' ? piece.element : piece.element.classList[1];
    const isWhite = pieceType.startsWith('white');

    const direction = isWhite ? -1 : 1;

    // One square forward
    if (newCol === col && newRow === row + direction && !isPieceAt(newRow, newCol, boardToUse)) {
        return true;
    }

    // Two squares forward (only from starting position)
    if (isWhite && row === 6 && newRow === 4 && newCol === col && 
        !isPieceAt(newRow, newCol, boardToUse) && !isPieceAt(row + direction, col, boardToUse)) {
        return true;
    }
    if (!isWhite && row === 1 && newRow === 3 && newCol === col && 
        !isPieceAt(newRow, newCol, boardToUse) && !isPieceAt(row + direction, col, boardToUse)) {
        return true;
    }

    // Diagonal capture
    if (Math.abs(newCol - col) === 1 && newRow === row + direction && 
        isPieceAt(newRow, newCol, boardToUse) && isOpponentPiece(piece, newRow, newCol, boardToUse)) {
        return true;
    }

    return false;
}
  
// Rook Movement (horizontal and vertical)
function isValidRookMove(piece, newRow, newCol, boardToUse) {
    const { row, col } = piece;

    // Check if moving horizontally or vertically
    if (newRow === row || newCol === col) {
        // Check for obstacles (pieces in the path)
        if (newRow === row) {
            for (let c = Math.min(col, newCol) + 1; c < Math.max(col, newCol); c++) {
                if (isPieceAt(newRow, c, boardToUse)) return false;
            }
        } else {
            for (let r = Math.min(row, newRow) + 1; r < Math.max(row, newRow); r++) {
                if (isPieceAt(r, newCol, boardToUse)) return false;
            }
        }
        // Check if the destination is empty or an opponent's piece
        return !isPieceAt(newRow, newCol, boardToUse) || isOpponentPiece(piece, newRow, newCol, boardToUse);
    }

    return false;
}
  
// Knight Movement (L-shape)
function isValidKnightMove(piece, newRow, newCol, boardToUse) {
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
                                           (!isPieceAt(newRow, newCol, boardToUse) || isOpponentPiece(piece, newRow, newCol, boardToUse)));
}

// Bishop Movement
function isValidBishopMove(piece, newRow, newCol, boardToUse) {
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
        if (isPieceAt(currentRow, currentCol, boardToUse)) {
            return false; // Obstacle in the way
        }
        currentRow += rowDir;
        currentCol += colDir;
    }

    // Check if the destination is empty or an opponent's piece
    return !isPieceAt(newRow, newCol, boardToUse) || isOpponentPiece(piece, newRow, newCol, boardToUse);
}

// King Movement (one square in any direction)
function isValidKingMove(piece, newRow, newCol, boardToUse) {
    const { row, col } = piece;

    // Calculate the row and column differences
    const rowDiff = Math.abs(newRow - row);
    const colDiff = Math.abs(newCol - col);

    // Check if the move is within one square in any direction
    if (rowDiff <= 1 && colDiff <= 1) { 
        // Check if the destination is empty or an opponent's piece
        return !isPieceAt(newRow, newCol, boardToUse) || isOpponentPiece(piece, newRow, newCol, boardToUse);
    }

    // Invalid move if not within one square
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
function isValidQueenMove(piece, newRow, newCol, boardToUse) {
    // Queen moves like a rook or bishop
    return isValidRookMove(piece, newRow, newCol, boardToUse) || 
           isValidBishopMove(piece, newRow, newCol, boardToUse);
}

function findKing(color, boardToUse) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (boardToUse[row][col] === `${color}-king`) {
                return { row, col };
            }
        }
    }
    return null;
}

// Function to check if a king is in check
function isKingInCheck(color, simulatedBoard = null) {
    const boardToUse = simulatedBoard || board;
    const kingPos = findKing(color, boardToUse);
    if (!kingPos) {
        console.error(`Cannot check for check: ${color} king not found`);
        return false;
    }

    const opponentColor = color === 'white' ? 'black' : 'white';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = boardToUse[row][col];
            if (piece && piece.startsWith(opponentColor)) {
                const pieceObj = { 
                    element: piece,
                    row,
                    col
                };
                if (canPieceMove(pieceObj, kingPos.row, kingPos.col, boardToUse)) {
                    return true;
                }
            }
        }
    }
    return false;
}
  
// Helper Functions:
// (You might want to move these outside the event listener)
function isPieceAt(row, col, boardToUse) {
    return boardToUse[row][col] !== null;
}

function isOpponentPiece(piece, row, col, boardToUse) {
    const pieceType = typeof piece.element === 'string' ? piece.element : piece.element.classList[1];
    const pieceColor = pieceType.split('-')[0];
    const targetPiece = boardToUse[row][col];
    if (!targetPiece) {
        return false;
    }
    const targetColor = targetPiece.split('-')[0];
    return pieceColor !== targetColor;
}

function canPieceMove(piece, newRow, newCol, boardToUse) {
    const pieceType = typeof piece.element === 'string' ? piece.element : piece.element.classList[1];
    
    switch(pieceType) {
        case 'white-pawn':
        case 'black-pawn':
            return isValidPawnMove(piece, newRow, newCol, boardToUse);
        case 'white-rook':
        case 'black-rook':
            return isValidRookMove(piece, newRow, newCol, boardToUse);
        case 'white-knight':
        case 'black-knight':
            return isValidKnightMove(piece, newRow, newCol, boardToUse);
        case 'white-bishop':
        case 'black-bishop':
            return isValidBishopMove(piece, newRow, newCol, boardToUse);
        case 'white-queen':
        case 'black-queen':
            return isValidQueenMove(piece, newRow, newCol, boardToUse);
        case 'white-king':
        case 'black-king':
            return isValidKingMove(piece, newRow, newCol, boardToUse);
        default:
            return false;
    }
}

function isValidMove(piece, newRow, newCol) {
    const oldRow = piece.row;
    const oldCol = piece.col;
    const pieceType = piece.element.classList[1];
    const pieceColor = pieceType.split('-')[0];

    // Create a simulated board
    const simulatedBoard = board.map(row => [...row]);
    simulatedBoard[newRow][newCol] = simulatedBoard[oldRow][oldCol];
    simulatedBoard[oldRow][oldCol] = null;

    // Check if the move would leave the king in check
    if (isKingInCheck(pieceColor, simulatedBoard)) {
        return false;
    }

    // Check if the piece can make this move
    return canPieceMove(piece, newRow, newCol, board);
}

// Modify the movePiece function to check for check after a move
function movePiece(piece, newRow, newCol) {
    const oldRow = piece.row;
    const oldCol = piece.col;
    const pieceColor = piece.element.classList[1].split('-')[0];

    // Update the board array
    board[newRow][newCol] = board[oldRow][oldCol];
    board[oldRow][oldCol] = null;

    // Update the DOM
    const newSquare = document.getElementById(`square-${newRow}-${newCol}`);
    const existingPiece = newSquare.querySelector('.piece');
    if (existingPiece) {
        newSquare.removeChild(existingPiece);
    }
    newSquare.appendChild(piece.element);

    // Update the piece's internal position
    piece.row = newRow;
    piece.col = newCol;

    // Check if the move results in a check
    const opponentColor = pieceColor === 'white' ? 'black' : 'white';
    if (isKingInCheck(opponentColor)) {
        console.log(`${opponentColor}'s king is in check!`);
        // You can add additional UI feedback here
    }

    // Switch turns
    isWhiteTurn = !isWhiteTurn;
}
