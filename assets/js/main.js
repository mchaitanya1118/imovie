document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.getElementById('searchInput');
    const moviesGrid = document.getElementById('moviesGrid');
    const movieCards = Array.from(document.querySelectorAll('.movie-card'));

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();

            movieCards.forEach(card => {
                const title = card.getAttribute('data-title');
                if (title.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Add simple entrance animation for cards
    movieCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });





    // --- Video Player & Ad Logic (On-Page) ---
    const playerSection = document.getElementById('playerSection');
    const adContainer = document.getElementById('adContainer');
    const moviePlayer = document.getElementById('moviePlayer');
    const skipTimer = document.getElementById('skipTimer');
    const skipAdBtn = document.getElementById('skipAdBtn');
    const videoFrame = document.getElementById('videoFrame');

    let VIDEO_URL = "";
    if (playerSection) {
        VIDEO_URL = playerSection.getAttribute('data-trailer') || "";

        // Ensure autoplay parameters
        if (VIDEO_URL && !VIDEO_URL.includes('autoplay=1')) {
            VIDEO_URL += (VIDEO_URL.includes('?') ? '&' : '?') + "autoplay=1&mute=0";
        }

        // Initialize Ad Flow
        // Use setTimeout to ensure DOM is fully ready/painted
        setTimeout(startAdFlow, 100);
    }

    if (skipAdBtn) {
        skipAdBtn.addEventListener('click', () => {
            skipAd();
        });
    }

    let countdownInterval;

    function startAdFlow() {
        if (!adContainer || !playerSection || !skipTimer) return;

        // Reset State
        adContainer.style.display = 'flex';
        moviePlayer.style.display = 'none';
        skipAdBtn.style.display = 'none';
        skipTimer.style.display = 'block';

        // Start Timer
        let cooldown = 5;
        skipTimer.textContent = `Skip in ${cooldown}`;

        // Clear any existing interval to prevent duplicates
        if (countdownInterval) clearInterval(countdownInterval);

        countdownInterval = setInterval(() => {
            cooldown--;
            if (cooldown > 0) {
                skipTimer.textContent = `Skip in ${cooldown}`;
            } else {
                // Time's up
                clearInterval(countdownInterval);
                skipTimer.style.display = 'none';
                skipAdBtn.style.display = 'block';
            }
        }, 1000);
    }

    function skipAd() {
        if (!adContainer || !moviePlayer) return;

        adContainer.style.display = 'none';
        moviePlayer.style.display = 'block';
        if (videoFrame && VIDEO_URL) {
            videoFrame.src = VIDEO_URL;
        }
    }

});
