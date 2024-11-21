const game = document.getElementById("game-box");
const score = document.getElementById("score");
const score1 = document.getElementById("score1");
const popup = document.getElementById("popup");
const box = document.getElementById("box");
const restartButton = document.getElementById("restart");
const homeButton = document.getElementById("home-button");
const startPopup = document.getElementById("start-popup");
const startGameButton = document.getElementById("start-game");
const playerNameInput = document.getElementById("player-name");
const difficultySelect = document.getElementById("difficulty");

let snakeSpeed = 5; // Default speed
let lastTime = 0;
let lastInputDirection = { x : 1 , y : 0 };
let inputDirection = { x : 1 , y : 0 };
let foodBody = { x : Math.ceil(Math.random() * 50), y : Math.ceil(Math.random() * 25) };
let bodyOfSnake = [{ x : Math.floor(25), y : Math.floor(12) }]; // Centered start position
let count = 0;
let roundCount = 0; // Track number of rounds
const maxRounds = 3; // Maximum number of rounds
let totalScore = 0; // Total score across rounds
let roundScores = []; // Array to store scores for each round
let gameActive = true; // Track if the game is active
let playerNameDisplay; // Variable to hold player name

// Function to start the game
function startGame() {
    playerNameDisplay = playerNameInput.value.trim();
    if (!playerNameDisplay) {
        alert("Please enter your name!");
        return;
    }

    // Set snake speed based on difficulty level
    const difficulty = difficultySelect.value;
    if (difficulty === 'easy') {
        snakeSpeed = 3; // Easy speed
    } else if (difficulty === 'medium') {
        snakeSpeed = 5; // Medium speed
    } else if (difficulty === 'hard') {
        snakeSpeed = 7; // Hard speed
    }

    startPopup.style.display = 'none'; // Hide start popup
    resetGame(); // Reset game state before starting
    window.requestAnimationFrame(cobra); // Start game loop
}

// Event listener for starting the game
startGameButton.addEventListener('click', startGame);

// Game loop function
function cobra(currTime) {
    if (!gameActive) return; // Exit if the game is not active

    var time = (currTime - lastTime) / 1000;

    requestAnimationFrame(cobra);
    if (time < (1 / snakeSpeed)) return;

    lastTime = currTime;

    update();
    draw();
}

// Update and draw functions remain unchanged...
function draw() {
    drawTheSnake();
    drawFood();
}

function update() {
    game.innerHTML = "";
    moveSnake();
    snakeFood();
}

function drawTheSnake() {
    bodyOfSnake.forEach((element, index) => {
        var snake = document.createElement("div");
        snake.style.gridColumnStart = element.x;
        snake.style.gridRowStart = element.y;

        if (index === 0) {
            snake.classList.add("head");
        } else {
            snake.classList.add("snake");
        }

        game.appendChild(snake);
    });
}

function drawFood() {
    var food = document.createElement("div");
    food.style.gridColumnStart = foodBody.x;
    food.style.gridRowStart = foodBody.y;

    food.classList.add("food");
    game.appendChild(food);
}

function moveSnake() {
    inputDirection = getInputDirection();

    for (var i = bodyOfSnake.length - 2; i >= 0; i--) {
        bodyOfSnake[i + 1] = { ...bodyOfSnake[i] };
    }
    
    bodyOfSnake[0].x += inputDirection.x;
    bodyOfSnake[0].y += inputDirection.y;

    gameOver();
}

function getInputDirection() {
      window.addEventListener("keydown", e => {
          switch (e.key) {
              case 'ArrowUp':
              case 'w':
                  if (lastInputDirection.y === +1) break;
                  inputDirection = { x : 0 , y : -1 };
                  break;

              case 'ArrowDown':
              case 's':
                  if (lastInputDirection.y === -1) break;
                  inputDirection = { x : 0 , y : +1 };
                  break;

              case 'ArrowRight':
              case 'd':
                  if (lastInputDirection.x === -1) break;
                  inputDirection = { x : +1 , y : +0 };
                  break;

              case 'ArrowLeft':
              case 'a':
                  if (lastInputDirection.x === +1) break;
                  inputDirection = { x : -1 , y : +0 };
                  break;

              default:
                  inputDirection = { x : lastInputDirection.x , y : lastInputDirection.y };
          }
      });

      lastInputDirection = inputDirection;

      return inputDirection;
}

function snakeFood() {
      if (bodyOfSnake[0].x === foodBody.x && bodyOfSnake[0].y === foodBody.y) {
          let a, b, condition = true;

          while (condition) {
              a = Math.ceil(Math.random() * (game.clientWidth / (game.clientWidth / 50)));
              b = Math.ceil(Math.random() * (game.clientHeight / (game.clientHeight / 25)));
              
              condition = bodyOfSnake.some(element => element.x === a && element.y === b);
          }

          foodBody.x = a;
          foodBody.y = b;

          snakeExpansion();
          count +=10; // Increment score by a fixed amount

          score.innerHTML=count.toString();
          totalScore += count; // Add current round score to total score
          score1.innerHTML=totalScore.toString(); // Update displayed total score
      }
}

function snakeExpansion() {
      bodyOfSnake.push(bodyOfSnake[bodyOfSnake.length -1]);
}

function gameOver() {
      if (outOfBox() || intersected()) {
          inputDirection.x=inputDirection.y=0; // Stop the snake

          roundScores.push(count); // Store current round score
          roundCount++; // Increment round count

          if (roundCount < maxRounds) {
              alert(`Round ${roundCount} over! Your score this round is: ${count}`);
              resetGame(); // Reset for next round
          } else {
              gameActive = false; // Mark game as inactive
              popup.style.display ="flex"; // Show popup for final score

              // Display individual round scores on leaderboard
              let roundScoresDisplayHTML="<h3>Round Scores:</h3>";
              roundScores.forEach((score, index) => {
                  roundScoresDisplayHTML += `<p>Round ${index + 1}: ${score}</p>`;
              });

              popup.innerHTML += roundScoresDisplayHTML; // Append round scores to popup

              score1.innerHTML=totalScore.toString(); 
              
              showLeaderboard(); // Show leaderboard after all rounds are over
              box.style.opacity ="0.4"; // Dim the background
          }
      }
}

// Function to reset the game state for the next round or restart the game completely
function resetGame() {
      bodyOfSnake.length=1; 
      bodyOfSnake[0] ={ x: Math.floor(25), y: Math.floor(12) }; 
      count=0; 
      score.innerHTML="0"; 
      foodBody={ x: Math.ceil(Math.random()*50), y: Math.ceil(Math.random()*25)}; 
}

// Function to show leaderboard without storing session data
function showLeaderboard() {      
      let leaderboardHTML="<h2>Leaderboard</h2>";
      
      leaderboardHTML += `<p>${playerNameDisplay}: ${totalScore}</p>`; 

      popup.innerHTML += leaderboardHTML; // Append leaderboard to popup
      
      // Reset buttons functionality after showing scores.
      restartButton.onclick = () => location.reload(); 
      homeButton.onclick = () => window.location.href='./snake.html'; 
}

// Check for intersections with itself or walls
function intersected() {
      for(var i=1;i<bodyOfSnake.length;i++) {
          if(bodyOfSnake[0].x===bodyOfSnake[i].x && bodyOfSnake[0].y===bodyOfSnake[i].y) return true;
      }
}

function outOfBox() {
      return (
          bodyOfSnake[0].x >= game.clientWidth / (game.clientWidth /50) || 
          bodyOfSnake[0].y >= game.clientHeight / (game.clientHeight /25) || 
          bodyOfSnake[0].x <= -1 || 
          bodyOfSnake[0].y <= -1
      );
}

// Restart button functionality remains unchanged...
restartButton.addEventListener("click", () => location.reload());