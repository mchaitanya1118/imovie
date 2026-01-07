const fs = require('fs-extra');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/movies.json');

// Mock data source - normally this would come from an API
const MOCK_NEW_MOVIES = [
    {
        "id": "new-1",
        "title": "Dune: Part Two",
        "slug": "dune-part-two",
        "year": 2024,
        "genre": ["Sci-Fi", "Adventure"],
        "rating": 8.9,
        "description": "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        "poster": "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
        "language": "English",
        "quality": "4K"
    },
    {
        "id": "new-2",
        "title": "Oppenheimer",
        "slug": "oppenheimer",
        "year": 2023,
        "genre": ["Biography", "Drama", "History"],
        "rating": 8.5,
        "description": "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        "poster": "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaB0V.jpg",
        "language": "English",
        "quality": "HD"
    }
];

async function fetchMovies() {
    console.log('Fetching new movies...');

    let currentMovies = [];
    if (fs.existsSync(DATA_FILE)) {
        currentMovies = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }

    // Check all new movies
    let addedCount = 0;
    MOCK_NEW_MOVIES.forEach(movie => {
        const exists = currentMovies.find(m => m.slug === movie.slug);
        if (!exists) {
            console.log(`Adding new movie: ${movie.title}`);
            currentMovies.unshift(movie);
            addedCount++;
        }
    });

    if (addedCount > 0) {
        // Save back to file
        fs.writeFileSync(DATA_FILE, JSON.stringify(currentMovies, null, 4));
        console.log(`Database updated. Added ${addedCount} new movies.`);
    } else {
        console.log('No new movies found.');
    }
}

fetchMovies();
