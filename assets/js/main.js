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
        let rawUrl = playerSection.getAttribute('data-trailer') || "";
        VIDEO_URL = convertToEmbedUrl(rawUrl);

        // Ensure autoplay parameters
        if (VIDEO_URL && !VIDEO_URL.includes('autoplay=1')) {
            VIDEO_URL += (VIDEO_URL.includes('?') ? '&' : '?') + "autoplay=1&mute=0";
        }

        // Initialize Ad Flow
        // Use setTimeout to ensure DOM is fully ready/painted
        setTimeout(startAdFlow, 100);
    }

    function convertToEmbedUrl(url) {
        if (!url) return "";
        let videoId = "";

        // Handle standard youtube.com/watch?v=ID
        if (url.includes("youtube.com/watch")) {
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get("v");
        }
        // Handle youtu.be/ID
        else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1];
        }
        // Handle already embed URLs or other cases (pass through if unsure, but strip query params if needed)
        else if (url.includes("youtube.com/embed/")) {
            return url;
        }

        if (videoId) {
            // Clean videoId in case of extra params
            const ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition !== -1) {
                videoId = videoId.substring(0, ampersandPosition);
            }
            return `https://www.youtube.com/embed/${videoId}`;
        }

        return url; // Return original if no conversion pattern matched (fallback)
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
