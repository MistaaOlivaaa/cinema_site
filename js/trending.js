const trendsGrid = document.querySelector("#trending-page-grid");
const trendsButton = document.querySelector("#load-more-trending");
let trendsMovieCount = 6;

function showTrendingMovies() {
    const movies = window.FALLBACK_MOVIES.slice(0, trendsMovieCount);
    trendsGrid.innerHTML = movies.map(window.movieCard).join("");

    if (trendsMovieCount >= window.FALLBACK_MOVIES.length) {
        trendsButton.hidden = true;
    }
}

if (trendsGrid && trendsButton) {
    showTrendingMovies();

    trendsButton.addEventListener("click", function () {
        trendsMovieCount += 4;
        showTrendingMovies();
    });
}
