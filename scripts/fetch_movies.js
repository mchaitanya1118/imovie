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
        "quality": "4K",
        "trailer": "https://www.youtube.com/embed/Way9Dexny3w"
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
        "quality": "HD",
        "trailer": "https://www.youtube.com/embed/uYPbbksJxIg"
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
        "backdrop": "https://media.themoviedb.org/t/p/original/7gW4pHqgH0X0X0X0X0X0X0X0X0X.jpg",
        "language": "English",
        "quality": "HD",
        "trailer": "https://www.youtube.com/watch?v=cDL3Zjdz514"
    },
    {
        "id": "new-4",
        "title": "The Housemaid",
        "slug": "the-housemaid",
        "year": 2025,
        "genre": ["Mystery", "Thriller"],
        "rating": 8.5,
        "description": "Trying to escape her past, Millie Calloway accepts a job as a live-in housemaid for the wealthy Nina and Andrew Winchester. But what begins as a dream job quickly unravels into something far more dangerous—a sexy, seductive game of secrets, scandal, and power.",
        "poster": "https://media.themoviedb.org/t/p/w300_and_h450_face/cWsBscZzwu5brg9YjNkGewRUvJX.jpg",
        "backdrop": "https://media.themoviedb.org/t/p/original/6gW4pHqgH0X0X0X0X0X0X0X0X0X.jpg",
        "language": "English",
        "quality": "HD",
        "trailer": "https://www.youtube.com/watch?v=48CtX6OgU3s"
    },
    {
        "id": "new-5",
        "title": "Fallout",
        "slug": "fallout",
        "year": 2024,
        "genre": ["Action", "Adventure", "Sci-Fi"],
        "rating": 8.5,
        "description": "The story of haves and have-nots in a world in which there's almost nothing left to have. 200 years after the apocalypse, the gentle denizens of luxury fallout shelters are forced to return to the irradiated hellscape their ancestors left behind — and are shocked to discover an incredibly complex, gleefully weird, and highly violent universe waiting for them.",
        "poster": "https://media.themoviedb.org/t/p/w300_and_h450_face/c15BtJxCXMrISLVmysdsnZUPQft.jpg",
        "backdrop": "https://media.themoviedb.org/t/p/original/6gW4pHqgH0X0X0X0X0X0X0X0X0X.jpg",
        "language": "English",
        "quality": "HD",
        "trailer": "https://www.youtube.com/watch?v=0kQ8i2FpRDk"
    },
    {
        "id": "new-6",
        "title": "Shine on Me",
        "slug": "shine-on-me",
        "year": 2025,
        "genre": ["Drama", "Romance"],
        "rating": 8.5,
        "description": "The drama follows the romantic story of Lin Yusen and Nie Xiguang, tracing Nie’s journey from college to the workplace. Bright and optimistic, she experiences an unspoken love in university, then meets Lin Yusen, a former surgeon turned industry professional. Despite early misunderstandings, her warmth draws him in. Through love and support, she overcomes past regrets, grows professionally, and ultimately finds love, fulfillment, and self-discovery.",
        "poster": "https://media.themoviedb.org/t/p/w300_and_h450_face/8QybFgm5jzNoJPjwWYW1r1ZBdOb.jpg",
        "backdrop": "https://media.themoviedb.org/t/p/original/6gW4pHqgH0X0X0X0X0X0X0X0X0X.jpg",
        "language": "English",
        "quality": "HD",
        "trailer": "https://www.youtube.com/watch?v=hEQDws2xQHk"
    },
    {
        "id": "new-7",
        "title": "Avatar: Fire and Ash",
        "slug": "avatar-fire-and-ash",
        "year": 2025,
        "genre": ["Action", "Adventure", "Sci-Fi"],
        "rating": 8.5,
        "description": "In the wake of the devastating war against the RDA and the loss of their eldest son, Jake Sully and Neytiri face a new threat on Pandora: the Ash People, a violent and power-hungry Na'vi tribe led by the ruthless Varang. Jake's family must fight for their survival and the future of Pandora in a conflict that pushes them to their emotional and physical limits.",
        "poster": "https://media.themoviedb.org/t/p/w300_and_h450_face/cf7hE1ifY4UNbS25tGnaTyyDrI2.jpg",
        "backdrop": "https://media.themoviedb.org/t/p/original/6gW4pHqgH0X0X0X0X0X0X0X0X0X.jpg",
        "language": "English",
        "quality": "HD",
        "trailer": "https://www.youtube.com/watch?v=nb_fFj_0rq8"
    }
];

async function fetchMovies() {
    console.log('Fetching new movies...');

    let currentMovies = [];
    if (fs.existsSync(DATA_FILE)) {
        currentMovies = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }

    // 1. Add new movies
    let addedCount = 0;
    MOCK_NEW_MOVIES.forEach(movie => {
        const exists = currentMovies.find(m => m.slug === movie.slug);
        if (!exists) {
            console.log(`Adding new movie: ${movie.title}`);
            currentMovies.unshift(movie);
            addedCount++;
        }
    });

    // 2. Remove movies that are no longer in the source (only for "new-*" IDs)
    // We assume IDs starting with "new-" are managed by this script.
    const mockIds = new Set(MOCK_NEW_MOVIES.map(m => m.id));
    const initialLength = currentMovies.length;

    currentMovies = currentMovies.filter(movie => {
        if (movie.id && movie.id.toString().startsWith('new-')) {
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
