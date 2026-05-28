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