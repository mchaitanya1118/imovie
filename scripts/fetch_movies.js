const fs = require('fs-extra');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/movies.json');

const MOCK_DATA_FILE = path.join(__dirname, '../data/mock_movies.json');

async function fetchMovies() {
    console.log('Fetching new movies...');

    let currentMovies = [];
    if (fs.existsSync(DATA_FILE)) {
        currentMovies = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }

    let mockMovies = [];
    if (fs.existsSync(MOCK_DATA_FILE)) {
        mockMovies = JSON.parse(fs.readFileSync(MOCK_DATA_FILE, 'utf8'));
    } else {
        console.warn('Mock data file not found!');
        return;
    }

    // 1. Add new movies
    let addedCount = 0;
    mockMovies.forEach(movie => {
        const exists = currentMovies.find(m => m.slug === movie.slug);
        if (!exists) {
            console.log(`Adding new movie: ${movie.title}`);
            currentMovies.unshift(movie);
            addedCount++;
        }
    });

    // 2. Remove movies that are no longer in the source (only for "new-*" or "tl_*" IDs)
    // We assume IDs starting with "new-" or "tl_" are managed by this script.
    const mockIds = new Set(mockMovies.map(m => m.id));
    const initialLength = currentMovies.length;

    currentMovies = currentMovies.filter(movie => {
        if (movie.id && (movie.id.toString().startsWith('new-') || movie.id.toString().startsWith('tl_'))) {
            if (!mockIds.has(movie.id)) {
                console.log(`Removing movie: ${movie.title} (ID: ${movie.id})`);
                return false;
            }
        }
        return true;
    });

    const removedCount = initialLength - currentMovies.length;

    if (addedCount > 0 || removedCount > 0) {
        // Save back to file
        fs.writeFileSync(DATA_FILE, JSON.stringify(currentMovies, null, 4));
        console.log(`Database updated. Added ${addedCount}, Removed ${removedCount} movies.`);
    } else {
        console.log('No changes found.');
    }
}

fetchMovies();
