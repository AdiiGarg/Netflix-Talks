const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "netflix-talks.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("SQLite database connected");
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS movies (
        id INTEGER,
        category TEXT,
        title TEXT,
        overview TEXT,
        poster_path TEXT,
        backdrop_path TEXT,
        local_poster_path TEXT,
        local_backdrop_path TEXT,
        cached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id, category)
    )
`);


module.exports = db;