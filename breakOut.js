const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const blockWidth = 50;
const blockHeight = 5;
const boardWidth = 250;
const boardHeight = 150;
const ballDiameter = 12;
let timerId;
let xDirection = 2;
let yDirection = 2;
let score = 0;

const userStart = [105, 10];
let currentPosition = userStart;
const ballStart = [125, 40];
let ballCurrentPosition = ballStart;

// create block

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    }
}

//array of blocks 

const blocks = [
    new Block(5, 130),
    new Block(55, 130),
    new Block(105, 130),
    new Block(155, 130),
    new Block(205, 130),
    new Block(5, 120),
    new Block(55, 120),
    new Block(105, 120),
    new Block(155, 120),
    new Block(205, 120),
    new Block(5, 110),
    new Block(55, 110),
    new Block(105, 110),
    new Block(155, 110),
    new Block(205, 110),
]

//draw all blocks

function addBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.left = blocks[i].bottomLeft[0] + 'px';
        block.style.bottom = blocks[i].bottomLeft[1] + 'px';
        grid.appendChild(block);
    }
}
addBlocks();

//add user

const user = document.createElement('div');
user.classList.add('user');
drawUser();
grid.appendChild(user);

// draw user 

function drawUser() {
    user.style.left = currentPosition[0] + 'px';
    user.style.bottom = currentPosition[1] + 'px';
}

// draw ball

function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

// move user

function moveUser(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 5) {
                currentPosition[0] -= 3;
                drawUser();
            } 
            break;
        case 'ArrowRight':
            if (currentPosition[0] < boardWidth - (blockWidth - 3)) {
                currentPosition[0] += 3;
                drawUser();
            }
            break;
    }
}

document.addEventListener('keydown', moveUser);

// move user on mobile

function moveMobileLeft() {
    if (currentPosition[0] > 10) {
        currentPosition[0] -= 25;
        drawUser();
    }
}

function moveMobileRight() {
    if (currentPosition[0] < boardWidth - (blockWidth + 10)) {
        currentPosition[0] += 25;
        drawUser();
    }
}

// add ball

const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);

// move ball

function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForCollision();
}

timerId = setInterval(moveBall, 60);

// check for collision

function checkForCollision() {

    // check for block collision

    for (let i=0; i < blocks.length; i++) {
        if (
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) && ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            allBlocks[i].classList.remove('block');
            blocks.splice(i, 1);
            changeDirection();
            score++
            scoreDisplay.innerHTML = score;

            // check for win 

            if (blocks.length === 0) {
                scoreDisplay.innerHTML = 'YOU WIN!';
                clearInterval(timerId);
                document.removeEventListener('keydown', moveUser);
            }
        }
    }

    // check for wall collision
    if (
        ballCurrentPosition[0] >= (boardWidth - ballDiameter) || 
        ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
        ballCurrentPosition[0] <= 0
        ) {
        changeDirection();
    }

    // check for user collision 

    if (
        (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth + 3) && (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight + 3)
    ) {
        changeDirection();
    }

    // check for game over
    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId);
        scoreDisplay.innerHTML = 'You lose!';
        document.removeEventListener('keydown', moveUser);
    }
}

function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2;
        return;
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2;
        return;
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2;
        return;
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2;
        return;
    }
}
