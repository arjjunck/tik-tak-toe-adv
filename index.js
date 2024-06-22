document.addEventListener('DOMContentLoaded', () => {
    const startpage = document.querySelector('.startPageContainer');
    const gamepage = document.querySelector('.GamePage');
    const start = document.getElementById('start-button');
    const restart = document.querySelector('#restart-button');
    const home = document.getElementById('home-button');
    const statusText = document.getElementById('statusText');
    const cells = Array.from(document.querySelectorAll('.cell'));
    let currentPlayer = 'X';
    let options = ["", "", "", "", "", "", "", "", ""];
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    let running = false;

    gamepage.style.display = 'none';

    start.addEventListener('click', () => {
        startpage.style.display = 'none';
        gamepage.style.display = 'block';
        initializeGame();
    });

    restart.addEventListener('click', () => {
        restartGame();
    });

    home.addEventListener('click', () => {
        startpage.style.display = 'block';
        gamepage.style.display = 'none';
    });

    function initializeGame() {
        currentPlayer = 'X';
        options = ["", "", "", "", "", "", "", "", ""];
        statusText.textContent = `${currentPlayer}'s turn`;
        running = true;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.addEventListener('click', cellClicked);
            cell.setAttribute('data-cell-index', cell.getAttribute('cellIndex'));
        });
    }

    function cellClicked() {
        const cellIndex = this.getAttribute('data-cell-index');
        if (options[cellIndex] !== "" || !running || currentPlayer === 'O') {
            return;
        }
        updateCell(this, cellIndex);
        checkWinner();
        if (running) {
            switchTurn();
            if (currentPlayer === 'O') {
                disableCells();
                setTimeout(() => {
                    computerMove();
                    enableCells();
                }, 500);
            }
        }
    }
    function disableCells() {
        cells.forEach(cell => cell.removeEventListener('click', cellClicked));
    }
    
    function enableCells() {
        cells.forEach(cell => cell.addEventListener('click', cellClicked));
    }
    function updateCell(cell, index) {
        options[index] = currentPlayer;
        cell.textContent = currentPlayer;
    }

    function switchTurn() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `${currentPlayer}'s turn`;
    }

    function checkWinner() {
        for (const condition of winConditions) {
            const [a, b, c] = condition;
            if (options[a] && options[a] === options[b] && options[a] === options[c]) {
                statusText.textContent = `${currentPlayer} wins!`;
                running = false;
                cells.forEach(cell => cell.removeEventListener('click', cellClicked));
                setTimeout(restartGame, 5000);
                return;
            }
        }

        if (!options.includes("")) {
            statusText.textContent = `Draw!`;
            running = false;
            setTimeout(restartGame, 5000);
        }
    }

    function restartGame() {
        initializeGame();
        console.log("Game restarted");
    }

    function computerMove() {
        // Try to win
        let move = findBestMove('O');
        if (move === -1) {
            // Block opponent's win
            move = findBestMove('X');
        }
        if (move === -1) {
            // Otherwise, choose a random move
            let emptyCells = cells.filter(cell => options[cell.getAttribute('data-cell-index')] === "");
            if (emptyCells.length > 0) {
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                const cell = emptyCells[randomIndex];
                move = cell.getAttribute('data-cell-index');
            }
        }
        if (move !== -1) {
            const cell = cells[move];
            updateCell(cell, move);
            checkWinner();
            if (running) {
                switchTurn();
            }
        }
    }

    function findBestMove(player) {
        for (const condition of winConditions) {
            const [a, b, c] = condition;
            if (options[a] === player && options[a] === options[b] && options[c] === "") {
                return c;
            }
            if (options[a] === player && options[a] === options[c] && options[b] === "") {
                return b;
            }
            if (options[b] === player && options[b] === options[c] && options[a] === "") {
                return a;
            }
        }
        return -1;
    }
});
