const db = require("../database/db");

function saveMovies(
    movies,
    category
) {

    db.serialize(() => {

        const stmt = db.prepare(`
            INSERT OR REPLACE INTO movies
            (
                id,
                category,
                title,
                overview,
                poster_path,
                backdrop_path,
                local_poster_path
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        movies.forEach((movie) => {

            stmt.run(
                movie.id,
                category,
                movie.title || movie.name,
                movie.overview,
                movie.poster_path,
                movie.backdrop_path,
                movie.local_poster_path || null
            );

        });

        stmt.finalize((err) => {

            if (err) {

                console.error(
                    "Finalize Error:",
                    err
                );

            } else {

                console.log(
                    `Movies cached for ${category}`
                );
            }
        });
    });
}

function getCachedMovies(
    callback
) {

    db.all(
        "SELECT * FROM movies",
        [],
        (err, rows) => {

            if (err) {

                console.error(
                    "DB Read Error:",
                    err.message
                );

                callback([]);

            } else {

                callback(rows);
            }
        }
    );
}

function getMoviesByCategory(
    category,
    callback
) {

    db.all(
        `
        SELECT *
        FROM movies
        WHERE category = ?
        `,
        [category],
        (err, rows) => {

            if (err) {

                console.error(
                    "Category Read Error:",
                    err.message
                );

                callback([]);

            } else {

                callback(rows);
            }
        }
    );
}

module.exports = {
    saveMovies,
    getCachedMovies,
    getMoviesByCategory
};