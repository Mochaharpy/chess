const board = ChessBoard('board', {
    draggable: true,
    position: 'start',
    onDrop: handleMove,
});

const chess = new Chess();

function handleMove(source, target) {
    const move = chess.move({
        from: source,
        to: target,
        promotion: 'q', // Automatically promote to a queen
    });

    if (move === null) {
        return 'snapback'; // Illegal move, snap back
    }

    renderMoveHistory();
    updateEvaluation();
    setTimeout(getAIMove, 250); // Allow a short delay before the AI's move
}

function renderMoveHistory() {
    const moves = chess.history();
    console.log(moves);
}

function updateEvaluation() {
    const evaluationValue = evaluateBoard();
    const evalText = document.getElementById('eval-text');
    const evalIndicator = document.getElementById('eval-indicator');

    evalText.innerText = evaluationValue.toFixed(2);

    // Update the height of the evaluation indicator based on the value
    const percentage = Math.min(Math.max(evaluationValue / 10, -1), 1); // Normalize between -1 and 1
    evalIndicator.style.height = `${(1 - percentage) * 100}%`; // Invert for visual
    evalIndicator.style.background = percentage > 0 ? 'green' : 'red'; // Green for positive, red for negative
}

function getAIMove() {
    const difficulty = document.getElementById('difficulty').value;
    let move;

    if (difficulty === 'easy') {
        move = getRandomMove();
    } else if (difficulty === 'medium') {
        move = getMediumMove();
    } else {
        move = getBestMove();
    }

    chess.move(move);
    board.move(move);
    renderMoveHistory();
    updateEvaluation(); // Update evaluation after AI's move
}

function getRandomMove() {
    const legalMoves = chess.legalMoves();
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
}

function getMediumMove() {
    const legalMoves = chess.legalMoves();
    const captures = legalMoves.filter(move => chess.get(move).captured);
    if (captures.length > 0) {
        return captures[Math.floor(Math.random() * captures.length)];
    }
    return getRandomMove();
}

function getBestMove() {
    const legalMoves = chess.legalMoves();
    let bestMove = legalMoves[0];
    let bestValue = -Infinity;

    for (const move of legalMoves) {
        chess.move(move);
        const moveValue = evaluateBoard();
        chess.undo();

        if (moveValue > bestValue) {
            bestValue = moveValue;
            bestMove = move;
        }
    }
    
    return bestMove;
}

function evaluateBoard() {
    let totalValue = 0;
    const pieceValues = {
        'p': 1,
        'r': 5,
        'n': 3,
        'b': 3,
        'q': 9,
        'k': 0 // King has no value in terms of piece evaluation
    };

    for (let piece of chess.board()) {
        if (piece) {
            const value = pieceValues[piece.type] || 0;
            totalValue += piece.color === 'w' ? value : -value;
        }
    }
    return totalValue;
}
