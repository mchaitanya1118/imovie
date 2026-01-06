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





    // --- Video Player & Ad Logic ---
    const watchBtn = document.getElementById('watchBtn');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const adContainer = document.getElementById('adContainer');
    const moviePlayer = document.getElementById('moviePlayer');
    const skipTimer = document.getElementById('skipTimer');
    const skipAdBtn = document.getElementById('skipAdBtn');
    const videoFrame = document.getElementById('videoFrame');

    // Placeholder Video (Rick Roll - ensuring autoplay works with mute)
    const VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1";

    if (watchBtn) {
        watchBtn.addEventListener('click', () => {
            openModal();
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            closeVideoModal();
        });
    }

    if (skipAdBtn) {
        skipAdBtn.addEventListener('click', () => {
            skipAd();
        });
    }

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    let countdownInterval;

    function openModal() {
        if (!videoModal) return;
        console.log('Opening Video Modal');
        videoModal.style.display = 'flex';
        resetPlayerParams();
        startAdFlow();
    }

    function closeVideoModal() {
        if (!videoModal) return;
        videoModal.style.display = 'none';
        if (videoFrame) videoFrame.src = ""; // Stop video
        clearInterval(countdownInterval);
    }

    function startAdFlow() {
        if (!adContainer) return;

        // Show Ad, Hide Player
        adContainer.style.display = 'flex';
        moviePlayer.style.display = 'none';
        skipAdBtn.style.display = 'none';
        skipTimer.style.display = 'block';

        // Start Timer
        let coldown = 5;
        skipTimer.innerText = `Skip in ${coldown}`;

        countdownInterval = setInterval(() => {
            coldown--;
            if (coldown > 0) {
                skipTimer.innerText = `Skip in ${coldown}`;
            } else {
                // Time's up, show skip button
                clearInterval(countdownInterval);
                skipTimer.style.display = 'none';
                skipAdBtn.style.display = 'block';
            }
        }, 1000);
    }

    function skipAd() {
        adContainer.style.display = 'none';
        moviePlayer.style.display = 'block';
        if (videoFrame) videoFrame.src = VIDEO_URL; // Start Video
    }

    function resetPlayerParams() {
        if (videoFrame) videoFrame.src = "";
    }

});
