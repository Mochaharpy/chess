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

// Minimax implementation
function minimax(depth, isMaximizing) {
    if (game.game_over()) {
        return evaluateBoard();
    }

    const possibleMoves = game.ugly_moves();
    
    if (isMaximizing) {
        let bestValue = -Infinity;
        for (let move of possibleMoves) {
            game.ugly_move(move);
            bestValue = Math.max(bestValue, minimax(depth - 1, false));
            game.undo();
        }
        return bestValue;
    } else {
        let bestValue = Infinity;
        for (let move of possibleMoves) {
            game.ugly_move(move);
            bestValue = Math.min(bestValue, minimax(depth - 1, true));
            game.undo();
        }
        return bestValue;
    }
}

// Evaluate the board position
function evaluateBoard() {
    // Simple evaluation function
    const pieceValues = {
        'p': 1, 'r': 5, 'n': 3, 'b': 3, 'q': 9, 'k': 0,
        'P': -1, 'R': -5, 'N': -3, 'B': -3, 'Q': -9, 'K': 0
    };
    let totalEvaluation = 0;

    for (let piece of game.board()) {
        for (let square of piece) {
            if (square) {
                totalEvaluation += pieceValues[square.type] * (square.color === 'w' ? 1 : -1);
            }
        }
    }

    return totalEvaluation;
}

// Bot move using Minimax
function makeBotMove() {
    let bestMove = null;
    let bestValue = -Infinity;

    const possibleMoves = game.ugly_moves();
    for (let move of possibleMoves) {
        game.ugly_move(move);
        const boardValue = minimax(3, false); // Change depth as needed
        game.undo();
        
        if (boardValue > bestValue) {
            bestValue = boardValue;
            bestMove = move;
        }
    }

    game.ugly_move(bestMove);
    renderMove();
}

// Reset the game
function onSnapEnd() {
    board.position(game.fen());
}

// Initialize the board
board.position(game.fen());
