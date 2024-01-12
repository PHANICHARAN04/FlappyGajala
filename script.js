const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const birdImage = new Image();
birdImage.src = 'https://i.postimg.cc/GH78mgPc/bird.png';

const pipeImage = new Image();
pipeImage.src = 'https://i.postimg.cc/svDGyCh6/pipe.webp';

const bird = {
    x: 50,
    y: canvas.height / 2,
    size: 20,
    velocity: 0,
    jumpStrength: 5
};

const pipes = [];
let score = 0;
let highestScore = localStorage.getItem("highestScore") || 0;
let gameOver = false;

const scoreImages = [
    { score: 0, imageUrl: 'https://i.postimg.cc/jjNv8Kt1/0p.webp' },
    { score: 1, imageUrl: 'https://i.postimg.cc/Jn0Sxx1n/1g.gif' },
    { score: 2, imageUrl: 'https://i.postimg.cc/3RqVcGRZ/2p.gif' },
    { score: 3, imageUrl: 'https://i.postimg.cc/pXXGPgJ9/3p.webp' },
    { score: 4, imageUrl: 'https://i.postimg.cc/3wnP2VQV/4g.gif' },
    { score: 5, imageUrl: 'https://i.postimg.cc/y82vXW49/5p.webp' },
    { score: 6, imageUrl: 'https://i.postimg.cc/rwDfrxbM/6p.webp' },
    { score: 7, imageUrl: 'https://i.postimg.cc/fyvhVL5n/7g.gif' },
    { score: 10, imageUrl: 'https://i.postimg.cc/c4sSVR4s/10g.gif' },
    { score: Infinity, imageUrl: 'URL_FOR_SCORE_GREATER_THAN_10_IMAGE' }
];

function getImageUrlByScore(currentScore) {
    for (const scoreImage of scoreImages) {
        if (currentScore <= scoreImage.score) {
            return scoreImage.imageUrl;
        }
    }
}

function drawBird() {
    ctx.drawImage(birdImage, bird.x - bird.size, bird.y - bird.size, bird.size * 2, bird.size * 2);
}

function drawPipe(pipe) {
    ctx.drawImage(pipeImage, pipe.x, 0, pipe.width, pipe.topHeight);
    ctx.drawImage(pipeImage, pipe.x, canvas.height - pipe.bottomHeight, pipe.width, pipe.bottomHeight);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background (already handled by canvas styling)

    // Draw bird
    drawBird();

    // Draw pipes
    pipes.forEach(drawPipe);

    // Draw score
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    if (gameOver) {
        document.getElementById("game-over").style.display = "block";
        document.getElementById("final-score").innerText = score;

        // Update the highest score in local storage if needed
        if (score > highestScore) {
            highestScore = score;
            localStorage.setItem("highestScore", highestScore);
        }

        document.getElementById("highest-score").innerText = highestScore;

        // Display the appropriate image based on the score
        const imageUrl = getImageUrlByScore(score);
        if (imageUrl) {
            const existingImage = document.getElementById("score-image");
            if (existingImage) {
                existingImage.src = imageUrl;
            } else {
                const imageElement = document.createElement("img");
                imageElement.src = imageUrl;
                imageElement.alt = "Score Image";
                imageElement.id = "score-image";
                document.getElementById("game-over").appendChild(imageElement);
            }
        }

        return;
    }

    bird.velocity += 0.2;
    bird.y += bird.velocity;

    pipes.forEach(pipe => {
        pipe.x -= 2;
        if (pipe.x + pipe.width < 0) {
            pipes.shift();
            generatePipe();
        }

        // Check for collisions
        if (
            (bird.x + bird.size > pipe.x && bird.x < pipe.x + pipe.width) &&
            (bird.y < pipe.topHeight || bird.y + bird.size > canvas.height - pipe.bottomHeight) ||
            bird.y < 0 || bird.y + bird.size > canvas.height
        ) {
            gameOver = true;
        }

        if (bird.x > pipe.x + pipe.width && !pipe.passed) {
            pipe.passed = true;
            score++;
        }
    });

    requestAnimationFrame(draw);
}

function generatePipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - 100;
    const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    const gap = 150;
    const width = 50;

    pipes.push({
        x: canvas.width,
        topHeight: height,
        bottomHeight: canvas.height - height - gap,
        width: width,
        passed: false
    });
}

function jump() {
    if (!gameOver) {
        bird.velocity = -bird.jumpStrength;
    }
}

function startGame() {
    document.getElementById("start-screen").style.display = "none"; // Hide start-screen
    pipes.length = 0;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    score = 0;
    gameOver = false;
    document.getElementById("game-over").style.display = "none";
    document.getElementById("highest-score").innerText = highestScore;
    generatePipe();
    draw();
}

document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        jump();
    }
});
