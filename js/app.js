const noPoster = "https://via.placeholder.com/380x560/17171d/ffffff?text=No+Poster";

function escapeText(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function movieLink(movie) {
    return "movie.html?id=" + encodeURIComponent(movie.imdbID || "");
}

function createMovieCard(movie) {
    let poster = movie.Poster;
    const description = movie.Plot
        || `Découvrez ${movie.Title}, un film à ne pas manquer.`;

    if (!poster || poster === "N/A") {
        poster = noPoster;
    }

    return `
        <article class="movie-card">
            <a class="movie-card__poster" href="${movieLink(movie)}">
                <img
                    loading="lazy"
                    src="${escapeText(poster)}"
                    alt="Poster de ${escapeText(movie.Title)}"
                    onerror="this.closest('.movie-card').remove()"
                >
            </a>
            <h3 title="${escapeText(movie.Title)}">${escapeText(movie.Title)}</h3>
            <div class="movie-card__meta">
                ${escapeText(movie.Year || "—")}
                <span aria-hidden="true">•</span>
                ${escapeText(movie.Runtime || "Film")}
            </div>
            <p class="movie-card__plot">${escapeText(description)}</p>
            <a class="movie-card__link" href="${movieLink(movie)}">En savoir plus →</a>
        </article>
    `;
}

function createHeader() {
    const header = document.querySelector("#site-header");

    if (!header) {
        return;
    }

    header.innerHTML = `
        <header class="site-header">
            <div class="container site-header__inner">
                <a class="logo" href="index.html">
                    <img src="img/logo.png" alt="Movies Bazar">
                </a>
                <nav class="nav" aria-label="Navigation principale">
                    <a href="index.html">Movies</a>
                    <a href="search.html">Search</a>
                    <a href="tendance.html">Tendances</a>
                    <a href="aide.html">Aide</a>
                </nav>
                <a class="header-search" href="search.html" aria-label="Search">⌕</a>
            </div>
        </header>
    `;
}

async function searchFromApi(query, page) {
    const apiKey = window.MOVIES_CONFIG.apiKey;

    if (!apiKey) {
        return null;
    }

    const url = "https://www.omdbapi.com/?apikey="
        + encodeURIComponent(apiKey)
        + "&s=" + encodeURIComponent(query)
        + "&page=" + page;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Le service OMDb est indisponible.");
    }

    const data = await response.json();

    if (data.Response === "False") {
        return { Search: [] };
    }

    return data;
}

async function movieFromApi(id) {
    const apiKey = window.MOVIES_CONFIG.apiKey;

    if (!apiKey) {
        return null;
    }

    const url = "https://www.omdbapi.com/?apikey="
        + encodeURIComponent(apiKey)
        + "&i=" + encodeURIComponent(id)
        + "&plot=full";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Le service OMDb est indisponible.");
    }

    const data = await response.json();

    if (data.Response === "False") {
        throw new Error(data.Error);
    }

    return data;
}

window.movieCard = createMovieCard;
window.apiSearch = searchFromApi;
window.apiMovie = movieFromApi;

createHeader();
