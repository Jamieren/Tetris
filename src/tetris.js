document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetrisCanvas');
    const context = canvas.getContext('2d');
    const grid = createGrid(10, 20);
    const pieceColors = ['#00FFFF', '#FFFF00', '#FF00FF', '#00FF00', '#0000FF', '#FFA500', '#FF0000'];
  
    let piece;
    let score = 0;
    let gameLoop;
    let isGameOver = false;
    let playerName = '';
  
    const playerNameSpan = document.getElementById('playerName');
    const scoreContainer = document.getElementById('currentScore');
    const gameOverContainer = document.getElementById('gameOverContainer');
  
    function getPlayerName() {
      if (!playerName) {
        playerName = prompt('Enter your name:');
        if (playerName == 'Justin' || playerName == 'justin'){
            playerName = 'Boyfriend!';
        }
        playerNameSpan.textContent = playerName;
      }
    }
  
    function drawGrid() {
      context.fillStyle = '#000';
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          const colorIndex = grid[row][col];
          if (colorIndex !== 0) {
            drawSquare(col, row, colorIndex);
          }
        }
      }
    }
  
    function drawSquare(x, y, colorIndex) {
      context.fillStyle = pieceColors[colorIndex - 1];
      context.fillRect(x * 24, y * 24, 23, 23);
      context.strokeStyle = '#222';
      context.strokeRect(x * 24, y * 24, 23, 23);
    }
  
    function createGrid(cols, rows) {
      const matrix = [];
  
      for (let row = 0; row < rows; row++) {
        matrix.push(new Array(cols).fill(0));
      }
  
      return matrix;
    }
  
    function createPiece() {
      const pieces = [
        [[1, 1, 1, 1]],
        [[1, 1], [1, 1]],
        [[1, 0, 0], [1, 1, 1]],
        [[0, 0, 1], [1, 1, 1]],
        [[0, 1, 1], [1, 1, 0]],
        [[0, 1, 0], [1, 1, 1]],
        [[1, 1, 0], [0, 1, 1]]
      ];
  
      const randomPiece = Math.floor(Math.random() * pieces.length);
      const colorIndex = Math.floor(Math.random() * pieceColors.length) + 1;
      return {
        matrix: pieces[randomPiece],
        colorIndex: colorIndex,
        x: Math.floor((10 - pieces[randomPiece][0].length) / 2),
        y: 0
      };
    }
  
    function collide() {
      const matrix = piece.matrix;
      const offsetX = piece.x;
      const offsetY = piece.y;
  
      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
          if (
            matrix[row][col] !== 0 &&
            ((grid[row + offsetY] && grid[row + offsetY][col + offsetX]) !== 0 ||
              row + offsetY >= grid.length)
          ) {
            return true;
          }
        }
      }
  
      return false;
    }
  
    function merge() {
      const matrix = piece.matrix;
      const offsetX = piece.x;
      const offsetY = piece.y;
  
      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
          if (matrix[row][col] !== 0) {
            grid[row + offsetY][col + offsetX] = piece.colorIndex;
          }
        }
      }
    }
  
    function rotate() {
      const matrix = piece.matrix;
      const tempMatrix = [];
  
      for (let row = 0; row < matrix[0].length; row++) {
        tempMatrix[row] = [];
        for (let col = 0; col < matrix.length; col++) {
          tempMatrix[row][col] = matrix[col][matrix[0].length - 1 - row];
        }
      }
  
      piece.matrix = tempMatrix;
  
      if (collide()) {
        // Revert the rotation
        piece.matrix = matrix;
      }
    }
  
    function movePiece(dir) {
      piece.x += dir;
  
      if (collide()) {
        piece.x -= dir;
      }
    }
  
    function dropPiece() {
      piece.y++;
  
      if (collide()) {
        piece.y--;
        merge();
        piece = createPiece();
  
        if (collide()) {
          // Game over
          clearInterval(gameLoop);
          alert('Ugh Oh T^T...Game Over...  ' + playerName + '\n'+
          'Your final Score: ' + score + '\n'+
          'Close this window and press' + '"start "to reset the game' );
          isGameOver = true;
        }
      }
    }
  
    function clearLines() {
      for (let row = grid.length - 1; row >= 0; row--) {
        if (grid[row].every(cell => cell !== 0)) {
          grid.splice(row, 1);
          grid.unshift(new Array(10).fill(0));
          score++;
        }
      }
    }
  
    function update() {
      drawGrid();
      dropPiece();
      clearLines();
      drawPiece();
      updateScore();
    }
  
    function updateScore() {
      scoreContainer.textContent = score;
    }
  
    function drawPiece() {
      const matrix = piece.matrix;
      const offsetX = piece.x;
      const offsetY = piece.y;
  
      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
          if (matrix[row][col] !== 0) {
            drawSquare(col + offsetX, row + offsetY, piece.colorIndex);
          }
        }
      }
    }
  
    function handleKeyPress(event) {
      switch (event.key) {
        case 'ArrowLeft':
          movePiece(-1);
          break;
        case 'ArrowRight':
          movePiece(1);
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case ' ':
          rotate();
          break;
      }
    }
  

    function restartGame() {
        isGameOver = false;
        //getPlayerName();
        piece = createPiece();
        score = 0;
        grid.forEach(row => row.fill(0));
        scoreContainer.textContent = score;
        gameOverContainer.style.display = 'none';
        gameLoop = setInterval(update, 500);
      }
    
    document.getElementById('startButton').addEventListener('click', () => {
      if (!gameLoop && !isGameOver) {
        getPlayerName();
        piece = createPiece();
        score = 0;
        grid.forEach(row => row.fill(0)); // Clear the grid
        scoreContainer.textContent = score;
        gameLoop = setInterval(update, 500);
        document.addEventListener('keydown', handleKeyPress);
        drawGrid();
      }
      else if (isGameOver){
        //getPlayerName();
        restartGame();
      }
    });

  //  document.getElementById('restartButton').addEventListener('click',restartGame)
  });
  