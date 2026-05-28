const db = require("../database/db");

function saveMovies(movies) {
    db.serialize(() => {
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO movies
            (id, title, overview, poster_path, backdrop_path)
            VALUES (?, ?, ?, ?, ?)
        `);

        movies.forEach((movie) => {
            stmt.run(
                movie.id,
                movie.title || movie.name,
                movie.overview,
                movie.poster_path,
                movie.backdrop_path
            );
        });

        stmt.finalize();

        console.log("Movies cached into SQLite");
    });
}

function getCachedMovies(callback) {
    db.all("SELECT * FROM movies", [], (err, rows) => {
        if (err) {
            console.error(err.message);
            callback([]);
        } else {
            callback(rows);
        }
    });
}

module.exports = {
    saveMovies,
    getCachedMovies
};