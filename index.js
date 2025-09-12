const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  nativeImage,
  ipcMain,
} = require("electron");
const path = require("path");

var spotifyWebApi = require("spotify-web-api-node");

require("dotenv").config();

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  throw new Error(
    "Missing required environment variables: SPOTIFY_CLIENT_ID and/or SPOTIFY_CLIENT_SECRET. Please set them in your .env file."
  );
}

var spotifyApi = new spotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://localhost:3000/callback",
});

let mainWindow;
let tray;
let callbackServer;

function startCallbackServer() {
  const express = require("express");
  const expressApp = express();

  expressApp.get("/callback", async (req, res) => {
    const { code } = req.query;
    const accessToken = req.query.access_token;
    const refresh_token = req.query.refresh_token;

    let userId;
    try {
      spotifyApi.setAccessToken(accessToken);
      const userResponse = await spotifyApi.getMe();
      userId = userResponse.body.id;
    } catch (error) {
      console.error("Error fetching user information:", error);
    }

    if (userId) {
      if (
        !process.env.DATABASE_URL ||
        !/^postgres:\/\/.+@.+\/.+$/.test(process.env.DATABASE_URL)
      ) {
        console.error(
          "Missing or invalid DATABASE_URL environment variable. Please set a valid PostgreSQL connection string in your .env file."
        );
      } else {
        const { Pool } = require("pg");
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });

        try {
          await pool.query(
            "INSERT INTO spotify_tokens (user_id, access_token, refresh_token) VALUES ($1, $2, $3)",
            [userId, accessToken, refresh_token]
          );
        } catch (error) {
          console.error("Error storing tokens in database:", error);
        }
      }
    } else {
      console.error("User ID not found, skipping token storage.");
    }

    if (!code) {
      return res
        .status(400)
        .send("Authentication failed: No authorization code received");
    }

    const axios = require("axios");
    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          code: code,
          redirect_uri: spotifyApi.getRedirectURI(),
          grant_type: "authorization_code",
          client_id: spotifyApi.getCredentials().clientId,
          client_secret: spotifyApi.getCredentials().clientSecret,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

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
                    <div class="success">Authentication Complete!</div>
                    <div class="message">You can now close this window and return to the Pomodoro app.</div>
                </div>
                <script>
                    setTimeout(() => {
                        window.close();
                    }, 3000);
                </script>
            </body>
            </html>
        `);
    } catch (error) {
      res
        .status(500)
        .send("Failed to exchange code for token: " + error.message);
    }
  });

  callbackServer = expressApp.listen(3000, () => {
    console.log("Spotify callback server running on port 3000");
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
      preload: path.join(__dirname, "preload.js"),
    },
    titleBarStyle: "default", // Changed from 'hiddenInset' to 'default' for better draggability
    frame: true,
    resizable: true,
    movable: true, // Explicitly enable window movement
    show: false, // Don't show until ready
    alwaysOnTop: false,
    skipTaskbar: false,
    autoHideMenuBar: false, // Keep menu bar visible for better UX
  });

  mainWindow.loadFile("index.html");

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Hide to tray instead of closing (optional)
  mainWindow.on("close", (event) => {
    if (process.platform === "darwin") {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function openSpotifyAuthModal() {
  const modal = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
    width: 500,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Use localhost callback that we can handle
  const clientId = spotifyApi.getCredentials().clientId;
  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    "client_id=" +
    clientId +
    "&response_type=code" +
    "&redirect_uri=http://localhost:3000/callback" +
    "&scope=user-read-private,user-read-email,playlist-read-private,playlist-modify-public,playlist-modify-private" +
    "&show_dialog=true";

  modal.loadURL(authUrl);

  modal.once("ready-to-show", () => {
    modal.show();
  });

  // Handle the auth callback by monitoring navigation
  modal.webContents.on("will-navigate", (event, navigationUrl) => {
    if (navigationUrl.includes("localhost:3000/callback")) {
      event.preventDefault();
      modal.close();
    }
  });
}

function createTray() {
  tray = new Tray(nativeImage.createEmpty());
  tray.setTitle("🍅");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        }
      },
    },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  // Show window on tray click
  tray.on("click", () => {
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

  // Set app menu (adds Spotify auth trigger)
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Connect to Spotify",
          click: () => {
            openSpotifyAuthModal();
          },
        },
        {
          label: "Quit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

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

// Clean up callback server when app quits
app.on("before-quit", () => {
  if (callbackServer) {
    callbackServer.close();
    console.log("Callback server closed");
  }
});

ipcMain.on("open-spotify-auth", () => {
  openSpotifyAuthModal();
});
