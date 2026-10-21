const homeGrid = document.querySelector("#trending-grid");
const homeButton = document.querySelector("#load-more-home");

let page = 1;

async function showHomeMovies() {
    const API_KEY = "27e10bd";

    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=movie&y=2024&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.Search) {
        homeGrid.innerHTML += "<p>Aucun film trouvé pour 2024.</p>";
        homeButton.hidden = true;
        return;
    }

    // IMPORTANT : envoyer l'objet OMDb tel quel
    data.Search.forEach(movie => {
        homeGrid.innerHTML += window.movieCard(movie);
    });

    if (data.Search.length < 10) {
        homeButton.hidden = true;
    }
}

if (homeGrid && homeButton) {
    showHomeMovies();

    homeButton.addEventListener("click", () => {
        page++;
        showHomeMovies();
    });
}
