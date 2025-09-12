const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openSpotifyAuthModal: () => ipcRenderer.send('open-spotify-auth')
});