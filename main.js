const db = require("./database/db");
const { saveMovies, getCachedMovies } = require("./services/movieCache");
const https = require("https");
const axios = require("axios");
const { apiKey } = require("./config.node");

const { app, BrowserWindow } = require("electron");
const path = require("path");
const { ipcMain } = require("electron");

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadFile("4index.html");
}

ipcMain.on("message", (event, message) => {
    console.log("Message from Renderer:", message);

    event.reply("reply", "Hello from Electron Main Process");
});



ipcMain.on("cache-movies", (event, movies) => {
    saveMovies(movies);

    console.log(
        "Movies received from frontend and cached"
    );

    getCachedMovies((cached) => {
        console.log(
            "Cached Movies Count:",
            cached.length
        );
    });
});


app.whenReady().then(() => {
    createWindow();
    
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});


app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
