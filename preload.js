const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    sendMessage: (message) => ipcRenderer.send("message", message),

    onReply: (callback) =>
        ipcRenderer.on("reply", (_, data) => callback(data))
});