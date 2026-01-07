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
    },
    {
        "id": "new-3",
        "title": "Predator: Badlands",
        "slug": "predator-badlands",
        "year": 2025,
        "genre": ["Action", "Adventure", "Sci-Fi"],
        "rating": 8.5,
        "description": "Cast out from his clan, a young Predator finds an unlikely ally in a damaged android and embarks on a treacherous journey in search of the ultimate adversary.",
        "poster": "https://media.themoviedb.org/t/p/w300_and_h450_face/pHpq9yNUIo6aDoCXEBzjSolywgz.jpg",
        "backdrop": "https://media.themoviedb.org/t/p/w300_and_h450_multi_faces_filter(blur)/pHpq9yNUIo6aDoCXEBzjSolywgz.jpg",
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

    // Simulate adding a random new movie if it doesn't await exist
    const randomNewMovie = MOCK_NEW_MOVIES[Math.floor(Math.random() * MOCK_NEW_MOVIES.length)];

    // Check if already exists
    const exists = currentMovies.find(m => m.slug === randomNewMovie.slug);

    if (!exists) {
        console.log(`Adding new movie: ${randomNewMovie.title}`);
        currentMovies.unshift(randomNewMovie); // Add to top

        // Save back to file
        fs.writeFileSync(DATA_FILE, JSON.stringify(currentMovies, null, 4));
        console.log('Database updated.');
    } else {
        console.log('No new movies found (mock simulation).');
    }
}

fetchMovies();
