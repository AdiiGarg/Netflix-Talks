const db = require("./database/db");
const { saveMovies, getCachedMovies, getMoviesByCategory } = require("./services/movieCache");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const { app, BrowserWindow, ipcMain } = require("electron");

// ===============================
// Poster Download
// ===============================
ipcMain.handle("download-poster", async (event, movie) => {

    const posterUrl =
        `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    const posterDir =
        path.join(__dirname, "cache", "posters");

    if (!fs.existsSync(posterDir)) {
        fs.mkdirSync(
            posterDir,
            { recursive: true }
        );
    }

    const filePath =
        path.join(
            posterDir,
            `${movie.id}.jpg`
        );

    try {

        const response =
            await axios({
                url: posterUrl,
                method: "GET",
                responseType: "stream"
            });

        const writer =
            fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise(
            (resolve, reject) => {

                writer.on(
                    "finish",
                    () => resolve(filePath)
                );

                writer.on(
                    "error",
                    reject
                );
            }
        );

    } catch (err) {

        console.error(
            "Poster download failed:",
            err.message
        );

        return null;
    }
});


// ===============================

ipcMain.handle(
    "download-backdrop",
    async (event, movie) => {

        const backdropUrl =
            `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

        const backdropDir =
            path.join(
                __dirname,
                "cache",
                "backdrops"
            );

        if (!fs.existsSync(backdropDir)) {

            fs.mkdirSync(
                backdropDir,
                { recursive: true }
            );
        }

        const filePath =
            path.join(
                backdropDir,
                `${movie.id}.jpg`
            );

        try {

            const response =
                await axios({
                    url: backdropUrl,
                    method: "GET",
                    responseType: "stream"
                });

            const writer =
                fs.createWriteStream(
                    filePath
                );

            response.data.pipe(
                writer
            );

            return new Promise(
                (
                    resolve,
                    reject
                ) => {

                    writer.on(
                        "finish",
                        () => resolve(filePath)
                    );

                    writer.on(
                        "error",
                        reject
                    );
                }
            );

        } catch (err) {

            console.error(
                "Backdrop download failed:",
                err.message
            );

            return null;
        }
    }
);


// ===============================
// Main Window
// ===============================
function createWindow() {

    const preloadPath =
        path.join(
            __dirname,
            "preload.js"
        );

    console.log(
        "PRELOAD PATH =",
        preloadPath
    );

    const win =
        new BrowserWindow({

            width: 1400,
            height: 900,

            webPreferences: {
                preload: preloadPath,
                nodeIntegration: false,
                contextIsolation: true
            }
        });

    win.webContents.openDevTools();

    win.loadFile("4index.html");
}

// ===============================
// IPC TEST
// ===============================
ipcMain.on(
    "message",
    (event, message) => {

        console.log(
            "Message from Renderer:",
            message
        );

        event.reply(
            "reply",
            "Hello from Electron Main Process"
        );
    }
);

// ===============================
// Cache Movies
// ===============================
ipcMain.on(
    "cache-movies",
    (event, movies, category) => {

        console.log(
            "CACHE MOVIES RECEIVED:",
            movies.length,
            category
        );

        saveMovies(
            movies,
            category
        );

        getCachedMovies(
            (cached) => {

                console.log(
                    "Cached Movies Count:",
                    cached.length
                );
            }
        );
    }
);


ipcMain.handle(
    "get-category-movies",
    async (event, category) => {

        return new Promise(resolve => {

            getMoviesByCategory(
                category,
                resolve
            );

        });

    }
);

// ===============================
// Get Cached Movies
// ===============================
ipcMain.handle(
    "get-cached-movies",
    async () => {

        return new Promise(
            (resolve) => {

                getCachedMovies(
                    (movies) => {

                        console.log(
                            "Returning cached movies:",
                            movies.length
                        );

                        resolve(movies);
                    }
                );
            }
        );
    }
);

// ===============================
// App Ready
// ===============================
app.whenReady().then(() => {

    createWindow();

    app.on(
        "activate",
        () => {

            if (
                BrowserWindow.getAllWindows().length === 0
            ) {
                createWindow();
            }
        }
    );
});

// ===============================
// Quit
// ===============================
app.on(
    "window-all-closed",
    () => {

        if (
            process.platform !== "darwin"
        ) {
            app.quit();
        }
    }
);