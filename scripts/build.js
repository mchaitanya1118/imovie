const fs = require('fs-extra');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/movies.json');
const DIST_DIR = path.join(__dirname, '../');
const TEMPLATE_INDEX = path.join(__dirname, '../index_template.html');
const TEMPLATE_MOVIE = path.join(__dirname, '../movie_template.html');

const MOVIES_PER_PAGE = 4; // Adjust as needed

async function build() {
    console.log('Starting build...');

    if (!fs.existsSync(DATA_FILE)) {
        console.error('Data file not found!');
        process.exit(1);
    }

    const movies = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    // Create 'pages' directory (Clean it first to remove stale pages)
    const pagesDir = path.join(DIST_DIR, 'pages');
    fs.emptyDirSync(pagesDir);

    let indexTemplate = '';
    let movieTemplate = '';

    try {
        indexTemplate = fs.readFileSync(TEMPLATE_INDEX, 'utf8');
        movieTemplate = fs.readFileSync(TEMPLATE_MOVIE, 'utf8');
    } catch (e) {
        console.warn('Templates not found yet. Skipping HTML generation.');
        return;
    }

    const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);

    // --- 1. Generate Movie Listing Pages (Pagination) ---
    for (let i = 1; i <= totalPages; i++) {
        // ... (generation logic remains same, but directory is already clean)
        const pageNum = i;
        const isHome = (pageNum === 1);

        const start = (pageNum - 1) * MOVIES_PER_PAGE;
        const end = start + MOVIES_PER_PAGE;
        const pageMovies = movies.slice(start, end);

        // Determine output file path
        // Page 1 -> index.html (root)
        // Page 2 -> pages/2.html
        const outputFilename = isHome ? 'index.html' : `pages/${pageNum}.html`;
        const outputPath = path.join(DIST_DIR, outputFilename);

        // Adjust link paths based on depth
        // If Root: movies/slug.html, assets/...
        // If Pages: ../movies/slug.html, ../assets/...
        const linkPrefix = isHome ? '' : '../';

        // Generate Movie Cards
        const movieCardsHtml = pageMovies.map(movie => `
            <a href="${linkPrefix}movies/${movie.slug}.html" class="movie-card" data-title="${movie.title.toLowerCase()}">
                <div class="poster-wrapper">
                    <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
                    <div class="quality-tag">${movie.quality}</div>
                </div>
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <div class="meta">
                        <span>${movie.year}</span>
                        <span class="rating">★ ${movie.rating}</span>
                    </div>
                </div>
            </a>
        `).join('');

        // Generate Pagination Controls
        let paginationHtml = '<div class="pagination">';

        // Prev Link
        if (pageNum > 1) {
            const prevLink = (pageNum - 1 === 1) ? `${linkPrefix}index.html` : `${pageNum - 1}.html`;
            paginationHtml += `<a href="${prevLink}" class="page-link">&lt;</a>`;
        } else {
            paginationHtml += `<span class="page-link disabled">&lt;</span>`;
        }

        // Page Numbers
        for (let p = 1; p <= totalPages; p++) {
            const activeClass = (p === pageNum) ? 'active' : '';
            let pLink = '';
            if (p === 1) pLink = `${linkPrefix}index.html`;
            else pLink = (isHome) ? `pages/${p}.html` : `${p}.html`;

            paginationHtml += `<a href="${pLink}" class="page-link ${activeClass}">${p}</a>`;
        }

        // Next Link
        if (pageNum < totalPages) {
            const nextLink = (isHome) ? `pages/${pageNum + 1}.html` : `${pageNum + 1}.html`;
            paginationHtml += `<a href="${nextLink}" class="page-link">&gt;</a>`;
        } else {
            paginationHtml += `<span class="page-link disabled">&gt;</span>`;
        }

        paginationHtml += '</div>';

        // Replace placeholders
        let pageHtml = indexTemplate
            .replace('<!-- MOVIE_LIST -->', movieCardsHtml)
            .replace('<!-- PAGINATION -->', paginationHtml);

        // Fix asset paths if in subdirectory
        if (!isHome) {
            pageHtml = pageHtml.replace(/href="assets\//g, 'href="../assets/')
                .replace(/src="assets\//g, 'src="../assets/');
        }

        fs.writeFileSync(outputPath, pageHtml);
        console.log(`Generated ${outputFilename}`);
    }

    // --- 2. Generate Individual Movie Pages ---
    const movieDir = path.join(DIST_DIR, 'movies');
    fs.ensureDirSync(movieDir);

    // CLEANUP: Remove stale movie files
    const validSlugs = new Set(movies.map(m => m.slug));
    const existingFiles = fs.readdirSync(movieDir);
    let removedFiles = 0;

    existingFiles.forEach(file => {
        if (file.endsWith('.html')) {
            const slug = file.replace('.html', '');
            if (!validSlugs.has(slug)) {
                fs.unlinkSync(path.join(movieDir, file));
                console.log(`Removed stale file: movies/${file}`);
                removedFiles++;
            }
        }
    });
    if (removedFiles > 0) console.log(`Cleaned up ${removedFiles} stale movie pages.`);

    movies.forEach(movie => {
        let pageHtml = movieTemplate
            .replace(/{{title}}/g, movie.title)
            .replace(/{{year}}/g, movie.year)
            .replace(/{{rating}}/g, movie.rating)
            .replace(/{{description}}/g, movie.description)
            .replace(/{{poster}}/g, movie.poster)
            .replace(/{{backdrop}}/g, movie.backdrop)
            .replace(/{{quality}}/g, movie.quality)
            .replace(/{{language}}/g, movie.language)
            .replace(/{{genre}}/g, movie.genre.join(', '));

        fs.writeFileSync(path.join(movieDir, `${movie.slug}.html`), pageHtml);
    });
    console.log(`Generated ${movies.length} movie detail pages.`);
}

build();
