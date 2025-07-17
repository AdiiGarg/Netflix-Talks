import { apiKey } from "./config.js";

const trendingContainer = document.getElementById("trending-movies");

async function fetchTrendingMovies() {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`
    );
    const data = await res.json();
    const movies = data.results.slice(0, 10);

    trendingContainer.innerHTML = movies
      .map(
        (movie) => `
        <div class="movie-card">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
          <p>${movie.title}</p>
        </div>`
      )
      .join("");
  } catch (err) {
    console.error("Error fetching trending movies:", err);
    trendingContainer.innerHTML = "<p>Failed to load trending movies.</p>";
  }
}

fetchTrendingMovies();
