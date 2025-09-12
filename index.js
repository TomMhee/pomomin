const { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain } = require('electron');
const path = require('path');

var spotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new spotifyWebApi({
    clientId: 'e4c98dde16f2410eaec94b11b0a5b651',
    clientSecret: '344a39fc50f442c7aba743af09b3b8f8',
    redirectUri: 'http://localhost:3000/callback'
});

let mainWindow;
let tray;
let callbackServer;

// Start the callback server
function startCallbackServer() {
    const express = require('express');
    const app = express();
    
    app.get('/callback', (req, res) => {
        const { code } = req.query;
        
        if (code) {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Authentication Complete</title>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            background: #1a1a1a;
                            color: #fff;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            text-align: center;
                        }
                        .container {
                            background: #2a2a2a;
                            border-radius: 16px;
                            padding: 40px;
                            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                        }
                        .success {
                            color: #4caf50;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .message {
                            color: #ccc;
                            margin-bottom: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="success">✅ Authentication Complete!</div>
                        <div class="message">You can now close this window and return to the Pomodoro app.</div>
                    </div>
                    <script>
                        // Automatically close after 3 seconds
                        setTimeout(() => {
                            window.close();
                        }, 3000);
                    </script>
                </body>
                </html>
            `);
            
            // Also send the code to the main window
            if (mainWindow) {
                mainWindow.webContents.executeJavaScript(`
                    console.log('Spotify auth code received: ${code}');
                    // Here you would exchange the code for an access token
                `);
            }
        } else {
            res.status(400).send('Authentication failed: No authorization code received');
        }
    });
    
    callbackServer = app.listen(3000, () => {
        console.log('Spotify callback server running on port 3000');
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 500,
        minWidth: 350,
        minHeight: 450,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'default', // Changed from 'hiddenInset' to 'default' for better draggability
        frame: true,
        resizable: true,
        movable: true, // Explicitly enable window movement
        show: false, // Don't show until ready
        alwaysOnTop: false,
        skipTaskbar: false,
        autoHideMenuBar: false // Keep menu bar visible for better UX
    });

    mainWindow.loadFile('index.html');

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Hide to tray instead of closing (optional)
    mainWindow.on('close', (event) => {
        if (process.platform === 'darwin') {
            event.preventDefault();
            mainWindow.hide();
        }
    });
}

function openSpotifyAuthModal(){
    const modal = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        show: false,
        width: 500,
        height: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Use localhost callback that we can handle
    const authUrl = 'https://accounts.spotify.com/authorize?' + 
        'client_id=e4c98dde16f2410eaec94b11b0a5b651' +
        '&response_type=code' +
        '&redirect_uri=http://localhost:3000/callback' +
        '&scope=user-read-private,user-read-email,playlist-read-private,playlist-modify-public,playlist-modify-private' +
        '&show_dialog=true';

    modal.loadURL(authUrl);
    
    modal.once('ready-to-show', () => {
        modal.show();
    });

    // Handle the auth callback by monitoring navigation
    modal.webContents.on('will-navigate', (event, navigationUrl) => {
        if (navigationUrl.includes('localhost:3000/callback')) {
            event.preventDefault();
            
            // Extract the authorization code from the URL
            const urlParams = new URLSearchParams(navigationUrl.split('?')[1]);
            const code = urlParams.get('code');
            
            if (code) {
                console.log('Authorization code received:', code);
                
                // Show success message in main window
                mainWindow.webContents.executeJavaScript(`
                    alert('Spotify authentication successful! Authorization code: ' + '${code}');
                `);
                
                // Close the modal
                modal.close();
                
                // Here you would exchange the code for an access token
                // exchangeCodeForToken(code);
            }
        }
    });

    // Also listen for the callback page to load
    modal.webContents.on('did-finish-load', () => {
        const currentUrl = modal.webContents.getURL();
        if (currentUrl.includes('localhost:3000/callback')) {
            // The callback page loaded, we can close the modal
            setTimeout(() => {
                modal.close();
            }, 2000);
        }
    });

    modal.on('closed', () => {
        // Modal cleanup if needed
    });
}

function createTray() {
    // Simple tray icon (tomato emoji as text)
    tray = new Tray(nativeImage.createEmpty());
    tray.setTitle('🍅');
    
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                }
            }
        },
        {
            label: 'Quit',
            click: () => {
                app.quit();
            }
        }
    ]);
    
    tray.setContextMenu(contextMenu);
    
    // Show window on tray click
    tray.on('click', () => {
        if (mainWindow) {
            mainWindow.show();
        }
    });
}

// App event handlers
app.whenReady().then(() => {
    createWindow();
    createTray();
    startCallbackServer(); // Start the callback server
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Clean up callback server when app quits
app.on('before-quit', () => {
    if (callbackServer) {
        callbackServer.close();
        console.log('Callback server closed');
    }
});

// Set app menu (adds Spotify auth trigger)
const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Connect to Spotify',
                click: () => {
                    openSpotifyAuthModal();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                click: () => {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' }
        ]
    }
];

ipcMain.on('open-spotify-auth', () => {
    openSpotifyAuthModal();
});

app.whenReady().then(() => {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});