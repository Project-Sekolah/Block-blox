document.addEventListener('DOMContentLoaded', function () {
    const gameBoard = document.getElementById('game-board');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const scoreDisplay = document.getElementById('score-display');

    let gameActive = false;
    let score = 0;
    let speed = 2;
    let blockWidth = 60;
    let blockHeight = 20;
    let currentBlock;
    let lastBlock;
    let direction = 1;
    let gameInterval;

    // Inisialisasi permainan
    function initGame() {
        gameBoard.innerHTML = '';
        score = 0;
        speed = 2;
        direction = 1;
        scoreDisplay.textContent = `Skor: ${score}`;
        lastBlock = createBlock((gameBoard.offsetWidth - blockWidth) / 2, gameBoard.offsetHeight - blockHeight, false);
    }

    // Membuat balok baru
    function createBlock(x, y, isMoving) {
        const block = document.createElement('div');
        block.className = 'block' + (isMoving ? ' moving-block' : '');
        block.style.width = `${blockWidth}px`;
        block.style.height = `${blockHeight}px`;
        block.style.left = `${x}px`;
        block.style.top = `${y}px`;
        gameBoard.appendChild(block);
        return block;
    }

    // Memulai permainan
    function startGame() {
        if (gameActive) return;
        gameActive = true;
        startBtn.disabled = true;

        const startY = parseInt(lastBlock.style.top) - blockHeight;
        currentBlock = createBlock(0, startY, true);

        gameInterval = setInterval(updateGame, 20);
    }

    // Update posisi balok berjalan
    function updateGame() {
        if (!gameActive) return;
        let currentLeft = parseInt(currentBlock.style.left);
        let newLeft = currentLeft + speed * direction;

        if (newLeft <= 0 || newLeft >= gameBoard.offsetWidth - blockWidth) {
            direction *= -1;
        }

        currentBlock.style.left = `${newLeft}px`;
    }

    // Menjatuhkan balok
    function dropBlock() {
        if (!gameActive) return;

        clearInterval(gameInterval);
        currentBlock.classList.remove('moving-block');

        // Animasikan jatuh
        const targetTop = parseInt(lastBlock.style.top) - blockHeight;
        currentBlock.style.transition = 'top 0.3s ease';
        currentBlock.style.top = `${targetTop}px`;

        setTimeout(() => {
            const currentLeft = parseInt(currentBlock.style.left);
            const lastLeft = parseInt(lastBlock.style.left);

            if (currentLeft + blockWidth >= lastLeft && currentLeft <= lastLeft + blockWidth) {
                // Sukses menumpuk
                lastBlock = currentBlock;
                score++;
                speed += 0.3;
                scoreDisplay.textContent = `Skor: ${score}`;

                // Buat balok baru
                const newTop = parseInt(lastBlock.style.top) - blockHeight;
                if (newTop < 0) {
                    gameOver(true);
                    return;
                }

                currentBlock = createBlock(0, newTop, true);
                gameInterval = setInterval(updateGame, 20);
            } else {
                // Gagal
                gameOver(false);
            }
        }, 300);
    }

    // Game Over
    function gameOver(won = false) {
        gameActive = false;
        clearInterval(gameInterval);
        const pesan = won ? "Kamu mencapai puncak! Hebat!" : `Permainan berakhir! Skor akhir: ${score}`;
        alert(pesan);
        startBtn.disabled = false;
    }

    // Reset
    function resetGame() {
        clearInterval(gameInterval);
        gameActive = false;
        startBtn.disabled = false;
        initGame();
    }

    // Event Listener
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    document.addEventListener('keydown', function (e) {
    if (!gameActive) return;

    if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault(); // ⬅️ Mencegah scroll/halaman turun
     }

        if (e.key === 'ArrowLeft') direction = -1;
        if (e.key === 'ArrowRight') direction = 1;
        if (e.key === ' ') dropBlock();
    });


        // Kontrol tombol sentuh (untuk HP)
    document.getElementById('btn-left').addEventListener('click', () => {
        if (gameActive) direction = -1;
    });

    document.getElementById('btn-right').addEventListener('click', () => {
        if (gameActive) direction = 1;
    });

    document.getElementById('btn-drop').addEventListener('click', () => {
        if (gameActive) dropBlock();
    });


    // Mulai dengan inisialisasi
    initGame();
});
