const chessboard = document.getElementById('chessboard');

// Create the board squares
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        square.classList.add('square', (row + col) % 2 === 0 ? 'light' : 'dark');
        square.id = `square-${row}-${col}`; // Give each square a unique ID
        chessboard.appendChild(square);
    }
}

// ... (Logic for piece placement, movement, game rules)