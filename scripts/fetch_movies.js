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
    },
    {
        "id": "new-4",
        "title": "The Housemaid",
        "slug": "The-Housemaid",
        "year": 2025,
        "genre": ["Mystery", "Thriller"],
        "rating": 8.5,
        "description": "Trying to escape her past, Millie Calloway accepts a job as a live-in housemaid for the wealthy Nina and Andrew Winchester. But what begins as a dream job quickly unravels into something far more dangerous—a sexy, seductive game of secrets, scandal, and power.",
        "poster": "https://media.themoviedb.org/t/p/w300_and_h450_face/cWsBscZzwu5brg9YjNkGewRUvJX.jpg",
        "backdrop": "https://media.themoviedb.org/t/p/w300_and_h450_multi_faces_filter(blur)/cWsBscZzwu5brg9YjNkGewRUvJX.jpg",
        "language": "English",
        "quality": "HD"
    },
    {
        "id": "new-5",
        "title": "The House",
        "slug": "The-House",
        "year": 2025,
        "genre": ["Mystery", "Thriller"],
        "rating": 8.5,
        "description": "Trying to escape her past, Millie Calloway accepts a job as a live-in housemaid for the wealthy Nina and Andrew Winchester. But what begins as a dream job quickly unravels into something far more dangerous—a sexy, seductive game of secrets, scandal, and power.",
        "poster": "https://media.themoviedb.org/t/p/w300_and_h450_face/cWsBscZzwu5brg9YjNkGewRUvJX.jpg",
        "backdrop": "https://media.themoviedb.org/t/p/w300_and_h450_multi_faces_filter(blur)/cWsBscZzwu5brg9YjNkGewRUvJX.jpg",
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
