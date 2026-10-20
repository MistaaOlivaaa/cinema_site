const homeGrid = document.querySelector("#trending-grid");
const homeButton = document.querySelector("#load-more-home");
let homeMovieCount = 6;

function showHomeMovies() {
    const movies = window.FALLBACK_MOVIES.slice(0, homeMovieCount);
    homeGrid.innerHTML = movies.map(window.movieCard).join("");

    if (homeMovieCount >= window.FALLBACK_MOVIES.length) {
        homeButton.hidden = true;
    }
}

if (homeGrid && homeButton) {
    showHomeMovies();

    homeButton.addEventListener("click", function () {
        homeMovieCount += 2;
        showHomeMovies();
    });
}
