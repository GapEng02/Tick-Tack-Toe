class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X'; // Player is X, AI is O
        this.gameActive = true;
        this.playerScore = 0;
        this.aiScore = 0;
        this.tieScore = 0;
        
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        this.init();
    }
    
    init() {
        this.createBoard();
        this.attachEventListeners();
        this.updateStatus();
    }
    
    createBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('button');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            gameBoard.appendChild(cell);
        }
    }
    
    attachEventListeners() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
    }
    
    handleCellClick(event) {
        const cell = event.target;
        const index = parseInt(cell.getAttribute('data-index'));
        
        // Check if move is valid
        if (!this.gameActive || this.board[index] !== null || this.currentPlayer !== 'X') {
            return;
        }
        
        // Make player move
        this.makeMove(index, 'X');
        
        // Check if game is still active and it's AI's turn
        if (this.gameActive && this.currentPlayer === 'O') {
            setTimeout(() => this.aiMove(), 500);
        }
    }
    
    makeMove(index, player) {
        // Update board
        this.board[index] = player;
        const cell = document.querySelector(`.cell[data-index='${index}']`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase(), 'disabled');
        
        // Check win/tie
        if (this.checkWin(player)) {
            this.endGame(player);
        } else if (this.checkTie()) {
            this.endGame('tie');
        } else {
            // Switch player
            this.currentPlayer = (this.currentPlayer === 'X') ? 'O' : 'X';
            this.updateStatus();
        }
    }
    
    aiMove() {
        if (!this.gameActive || this.currentPlayer !== 'O') return;
        
        const move = this.getBestMove();
        if (move !== -1) {
            this.makeMove(move, 'O');
        }
    }
    
    getBestMove() {
        // First, check if AI can win
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === null) {
                this.board[i] = 'O';
                if (this.checkWin('O')) {
                    this.board[i] = null;
                    return i;
                }
                this.board[i] = null;
            }
        }
        
        // Second, block player from winning
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === null) {
                this.board[i] = 'X';
                if (this.checkWin('X')) {
                    this.board[i] = null;
                    return i;
                }
                this.board[i] = null;
            }
        }
        
        // Third, take center if available
        if (this.board[4] === null) return 4;
        
        // Fourth, take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === null);
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // Finally, take any available edge
        const edges = [1, 3, 5, 7];
        const availableEdges = edges.filter(i => this.board[i] === null);
        if (availableEdges.length > 0) {
            return availableEdges[Math.floor(Math.random() * availableEdges.length)];
        }
        
        return -1;
    }
    
    checkWin(player) {
        return this.winningCombinations.some(combination => {
            return combination.every(index => this.board[index] === player);
        });
    }
    
    checkTie() {
        return this.board.every(cell => cell !== null);
    }
    
    endGame(result) {
        this.gameActive = false;
        
        if (result === 'X') {
            this.playerScore++;
            document.getElementById('playerScore').textContent = this.playerScore;
            this.updateStatus('🎉 You win! 🎉');
        } else if (result === 'O') {
            this.aiScore++;
            document.getElementById('aiScore').textContent = this.aiScore;
            this.updateStatus('🤖 AI wins! Better luck next time! 🤖');
        } else if (result === 'tie') {
            this.tieScore++;
            document.getElementById('tieScore').textContent = this.tieScore;
            this.updateStatus("It's a tie! 🤝");
        }
    }
    
    updateStatus(message = null) {
        const statusDiv = document.getElementById('statusMessage');
        
        if (message) {
            statusDiv.textContent = message;
        } else if (this.gameActive) {
            if (this.currentPlayer === 'X') {
                statusDiv.innerHTML = '<span class="x-color">Your turn!</span>';
            } else {
                statusDiv.innerHTML = '<span class="o-color">AI is thinking...</span>';
            }
        }
    }
    
    resetGame() {
        // Reset board
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Clear all cells
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'disabled');
        });
        
        this.updateStatus();
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});