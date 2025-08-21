const { app, BrowserWindow, Menu, Tray, nativeImage } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 500,
        minWidth: 350,
        minHeight: 450,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        titleBarStyle: 'hiddenInset', // macOS style
        frame: true,
        resizable: true,
        show: false // Don't show until ready
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

// Set app menu (optional - creates a minimal menu)
const template = [
    {
        label: 'File',
        submenu: [
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

app.whenReady().then(() => {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});