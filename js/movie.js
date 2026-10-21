const movieDetails = document.querySelector("#movie-details");
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

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
    try {
        const movie = await window.apiMovie(movieId);

        // Si OMDb renvoie une erreur
        if (!movie || movie.Response === "False") {
            movieDetails.innerHTML = "<p>Film introuvable.</p>";
            return;
        }

        showMovie(movie);

    } catch (error) {
        movieDetails.innerHTML = `<div class="status">${error.message}</div>`;
    }
}

loadMovie();
