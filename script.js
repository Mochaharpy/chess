const boardElement = document.getElementById('board');
const resultElement = document.getElementById('result');

let game = new Chess();

const board = ChessBoard('board', {
    draggable: true,
    position: 'start',
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
});

// Handle piece drops
function onDrop(source, target) {
    // Remove the piece from the board
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // promote to queen
    });

    // If the move was illegal, snap back the piece
    if (move === null) return 'snapback';

    renderMove();
    if (!game.game_over()) {
        setTimeout(makeBotMove, 250); // Make bot move after a short delay
    }
}

// Update the board after a move
function renderMove() {
    board.position(game.fen());
    if (game.game_over()) {
        resultElement.innerHTML = 'Game over';
    }
}

// Simple AI move (random valid move)
function makeBotMove() {
    const possibleMoves = game.ugly_moves();
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[randomIndex];

    game.ugly_move(move);
    renderMove();
}

// Reset the game
function onSnapEnd() {
    board.position(game.fen());
}

// Initialize the board
board.position(game.fen());
