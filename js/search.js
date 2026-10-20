const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchGrid = document.querySelector("#search-results");
const searchStatus = document.querySelector("#search-status");
const searchMoreButton = document.querySelector("#load-more-search");

let searchText = "";
let searchPage = 1;
let searchResults = [];
let searchTimeout;

function findMoviesLocally(text) {
    const lowerText = text.toLowerCase();

    return window.FALLBACK_MOVIES.filter(function (movie) {
        return movie.Title.toLowerCase().includes(lowerText)
            || movie.Actors.toLowerCase().includes(lowerText);
    });
}

function displaySearchResults() {
    searchGrid.innerHTML = searchResults.map(window.movieCard).join("");
    searchMoreButton.hidden = !searchText || searchResults.length === 0;
}

async function searchMovies() {
    searchText = searchInput.value.trim();
    searchPage = 1;

    if (searchText.length < 2) {
        searchResults = [];
        displaySearchResults();
        searchStatus.textContent = "Commencez à saisir au moins deux caractères.";
        return;
    }

    searchStatus.textContent = "Recherche en cours...";

    try {
        const data = await window.apiSearch(searchText, searchPage);

        if (data) {
            searchResults = data.Search || [];
        } else {
            searchResults = findMoviesLocally(searchText);
        }

        displaySearchResults();

        if (searchResults.length > 0) {
            searchStatus.textContent =
                searchResults.length + " résultat(s) pour « " + searchText + " »";
        } else {
            searchStatus.textContent =
                "Aucun film trouvé. Essayez un autre titre.";
        }
    } catch (error) {
        searchResults = [];
        displaySearchResults();
        searchStatus.textContent = error.message;
    }
}

async function showMoreResults() {
    searchPage += 1;
    searchMoreButton.disabled = true;
    searchMoreButton.textContent = "Chargement...";

    try {
        const data = await window.apiSearch(searchText, searchPage);

        if (data && data.Search) {
            searchResults = searchResults.concat(data.Search);
        } else {
            searchResults = searchResults.concat(findMoviesLocally(searchText));
        }

        displaySearchResults();
    } finally {
        searchMoreButton.disabled = false;
        searchMoreButton.textContent = "Charger plus de résultats";
    }
}

if (searchForm) {
    searchInput.addEventListener("input", function () 
    {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(searchMovies, 350);
    });

    searchForm.addEventListener("submit", function (event) 
    {
        event.preventDefault();
        clearTimeout(searchTimeout);
        searchMovies();
    });

    searchMoreButton.addEventListener("click", showMoreResults);
}
