const fs = require('fs-extra');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/movies.json');

// Mock data source - normally this would come from an API
const MOCK_NEW_MOVIES = [
    {
        "id": "tl_001",
        "title": "Baahubali: The Beginning",
        "slug": "baahubali-the-beginning-2015",
        "year": 2015,
        "genre": ["Action", "Drama", "Fantasy"],
        "rating": 8.0,
        "description": "In ancient India, an adventurous young man learns of his royal heritage and his mission to reclaim the kingdom from a tyrannical ruler.",
        "poster": "https://example.com/posters/baahubali1.jpg",
        "backdrop": "https://example.com/backdrops/baahubali1-bg.jpg",
        "language": "Telugu",
        "quality": "1080p",
        "trailer": "https://www.youtube.com/watch?v=sOEg_YZQsTI"
    },
    {
        "id": "tl_002",
        "title": "Baahubali: The Conclusion",
        "slug": "baahubali-the-conclusion-2017",
        "year": 2017,
        "genre": ["Action", "Drama", "Fantasy"],
        "rating": 8.2,
        "description": "After learning his true identity, Mahendra Baahubali sets out to avenge his father and free the kingdom from Bhallaladeva.",
        "poster": "https://example.com/posters/baahubali2.jpg",
        "backdrop": "https://example.com/backdrops/baahubali2-bg.jpg",
        "language": "Telugu",
        "quality": "1080p",
        "trailer": "https://www.youtube.com/watch?v=G62HrubdD6o"
    },
    {
        "id": "tl_003",
        "title": "RRR",
        "slug": "rrr-2022",
        "year": 2022,
        "genre": ["Action", "Drama", "Historical"],
        "rating": 8.1,
        "description": "A fictional story about two legendary revolutionaries and their journey away from home before they began fighting for their country.",
        "poster": "https://example.com/posters/rrr.jpg",
        "backdrop": "https://example.com/backdrops/rrr-bg.jpg",
        "language": "Telugu",
        "quality": "4K",
        "trailer": "https://www.youtube.com/watch?v=NgBoMJy386M"
    },
    {
        "id": "tl_004",
        "title": "Pushpa: The Rise",
        "slug": "pushpa-the-rise-2021",
        "year": 2021,
        "genre": ["Action", "Drama", "Thriller"],
        "rating": 7.6,
        "description": "A laborer rises through the ranks of a red sandalwood smuggling syndicate, facing betrayal and enemies at every turn.",
        "poster": "https://example.com/posters/pushpa.jpg",
        "backdrop": "https://example.com/backdrops/pushpa-bg.jpg",
        "language": "Telugu",
        "quality": "1080p",
        "trailer": "https://www.youtube.com/watch?v=Q1NKMPhP8PY"
    },
    {
        "id": "tl_005",
        "title": "Ala Vaikunta Puramulo",
        "slug": "ala-vaikunta-puramulo-2020",
        "year": 2020,
        "genre": ["Drama", "Family", "Romance"],
        "rating": 7.3,
        "description": "A man raised in a middle-class family learns of his true parentage and chooses to protect both families that shaped his life.",
        "poster": "https://example.com/posters/ala-vaikunta-puramulo.jpg",
        "backdrop": "https://example.com/backdrops/ala-vaikunta-puramulo-bg.jpg",
        "language": "Telugu",
        "quality": "1080p",
        "trailer": "https://www.youtube.com/watch?v=SkENAjfVoNI"
    },
    {
        "id": "tl_006",
        "title": "Eega",
        "slug": "eega-2012",
        "year": 2012,
        "genre": ["Fantasy", "Romance", "Thriller"],
        "rating": 7.8,
        "description": "A man reincarnates as a housefly to seek revenge on the man who murdered him and protect the woman he loves.",
        "poster": "https://example.com/posters/eega.jpg",
        "backdrop": "https://example.com/backdrops/eega-bg.jpg",
        "language": "Telugu",
        "quality": "720p",
        "trailer": "https://www.youtube.com/watch?v=4xBjp6h0Kkk"
    },
    {
        "id": "tl_007",
        "title": "Magadheera",
        "slug": "magadheera-2009",
        "year": 2009,
        "genre": ["Action", "Romance", "Fantasy"],
        "rating": 7.7,
        "description": "A warrior is reincarnated after 400 years and seeks to reunite with his love while confronting his ancient enemy.",
        "poster": "https://example.com/posters/magadheera.jpg",
        "backdrop": "https://example.com/backdrops/magadheera-bg.jpg",
        "language": "Telugu",
        "quality": "720p",
        "trailer": "https://www.youtube.com/watch?v=3O1n3A1sT5Y"
    },
    {
        "id": "tl_008",
        "title": "Jersey",
        "slug": "jersey-2019",
        "year": 2019,
        "genre": ["Drama", "Sports"],
        "rating": 8.5,
        "description": "A failed cricketer decides to revive his career in his late 30s to prove himself to his son and fulfill his dream.",
        "poster": "https://example.com/posters/jersey.jpg",
        "backdrop": "https://example.com/backdrops/jersey-bg.jpg",
        "language": "Telugu",
        "quality": "1080p",
        "trailer": "https://www.youtube.com/watch?v=5lN4P5x0n0Q"
    },
    {
        "id": "tl_009",
        "title": "Arjun Reddy",
        "slug": "arjun-reddy-2017",
        "year": 2017,
        "genre": ["Romance", "Drama"],
        "rating": 8.0,
        "description": "A brilliant but troubled surgeon spirals into self-destruction after his girlfriend is forced to marry another man.",
        "poster": "https://example.com/posters/arjun-reddy.jpg",
        "backdrop": "https://example.com/backdrops/arjun-reddy-bg.jpg",
        "language": "Telugu",
        "quality": "1080p",
        "trailer": "https://www.youtube.com/watch?v=Ao9s0Yk1z4I"
    },
    {
        "id": "tl_010",
        "title": "Rangasthalam",
        "slug": "rangasthalam-2018",
        "year": 2018,
        "genre": ["Action", "Drama"],
        "rating": 8.4,
        "description": "In a rural village, a partially deaf man fights against a corrupt local politician to bring justice to his people.",
        "poster": "https://example.com/posters/rangasthalam.jpg",
        "backdrop": "https://example.com/backdrops/rangasthalam-bg.jpg",
        "language": "Telugu",
        "quality": "1080p",
        "trailer": "https://www.youtube.com/watch?v=5n9sJ3Rj4e0"
    },
    {
        "id": "tl_011",
        "title": "Sye",
        "slug": "sye-2004",
        "year": 2004,
        "genre": ["Sports", "Drama"],
        "rating": 7.7,
        "description": "A college rugby team unites to save their institution from a powerful rival determined to take over their land.",
        "poster": "https://example.com/posters/sye.jpg",
        "backdrop": "https://example.com/backdrops/sye-bg.jpg",
        "language": "Telugu",
        "quality": "720p",
        "trailer": "https://www.youtube.com/watch?v=O5m4VJtY8CE"
    },
    {
        "id": "tl_012",
        "title": "Khaidi No. 150",
        "slug": "khaidi-no-150-2017",
        "year": 2017,
        "genre": ["Action", "Drama"],
        "rating": 6.9,
        "description": "A man takes on the identity of his lookalike to expose a corrupt businessman and protect farmers from exploitation.",
        "poster": "https://example.com/posters/khaidi-no-150.jpg",
        "backdrop": "https://example.com/backdrops/khaidi-no-150-bg.jpg",
        "language": "Telugu",
        "quality": "1080p",
        "trailer": "https://www.youtube.com/watch?v=0k2TgDq4p1Q"
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
