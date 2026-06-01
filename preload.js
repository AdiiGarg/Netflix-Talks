const {
    contextBridge,
    ipcRenderer
} = require("electron");

console.log("PRELOAD LOADED");

contextBridge.exposeInMainWorld(
    "electronAPI",
    {

        sendMessage: (message) =>
            ipcRenderer.send(
                "message",
                message
            ),

        onReply: (callback) =>
            ipcRenderer.on(
                "reply",
                (_, data) =>
                    callback(data)
            ),

        cacheMovies: (movies, category) =>
            ipcRenderer.send(
                "cache-movies",
                movies, category
            ),

        getCachedMovies: (category) =>
            ipcRenderer.invoke(
                "get-category-movies",
                category
            ),

        downloadPoster: (movie) =>
            ipcRenderer.invoke(
                "download-poster",
                movie
            )
    }
);