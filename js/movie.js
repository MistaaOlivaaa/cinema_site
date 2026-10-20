const movieDetails = document.querySelector("#movie-details");
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id") || "tt3896198";

function showMovie(movie) {
    document.title = `Movies Bazar | ${movie.Title}`;

    let rating = "";

    if (movie.imdbRating && movie.imdbRating !== "N/A") {
        rating = ` · ★ ${movie.imdbRating}/10`;
    }

    movieDetails.innerHTML = `
        <img
            class="movie-details__poster"
            src="${movie.Poster}"
            alt="Affiche de ${movie.Title}"
        >

        <div>
            <div class="movie-facts">
                <div class="movie-fact">
                    Durée
                    <strong>${movie.Runtime || "—"}</strong>
                </div>
                <div class="movie-fact">
                    Sortie
                    <strong>${movie.Released || movie.Year || "—"}</strong>
                </div>
                <div class="movie-fact">
                    Réalisateur
                    <strong>${movie.Director || "—"}</strong>
                </div>
            </div>

            <p class="movie-details__plot">
                ${movie.Plot || "Résumé indisponible."}
            </p>
            <p class="movie-details__label">Avec</p>
            <p>${movie.Actors || "Distribution indisponible."}</p>
        </div>
    `;
}

async function loadMovie() {
    let movie = await window.apiMovie(movieId);

    if (!movie) {
        const featuredMovie = window.MOVIES_CONFIG.featuredMovie;
        const localMovie = window.FALLBACK_MOVIES.find(function (item) {
            return item.imdbID === movieId;
        });

        if (movieId === featuredMovie.imdbID) {
            movie = featuredMovie;
        } else {
            movie = localMovie || window.FALLBACK_MOVIES[0];
        }
    }

    showMovie(movie);
}

if (movieDetails) {
    loadMovie().catch(function (error) {
        movieDetails.innerHTML = `<div class="status">${error.message}</div>`;
    });
}
