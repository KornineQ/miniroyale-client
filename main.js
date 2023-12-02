const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { exec } = require('child_process');
var { cpus } = require("os");

let mainWindow;
let loadingScreen;

//#region Do Some FPS Tricks
app.commandLine.appendSwitch("disable-frame-rate-limit");
app.commandLine.appendSwitch("disable-gpu-vsync");
app.commandLine.appendSwitch("ignore-gpu-blacklist");
app.commandLine.appendSwitch("disable-breakpad");
app.commandLine.appendSwitch("disable-component-update");
app.commandLine.appendSwitch("disable-print-preview");
app.commandLine.appendSwitch("disable-metrics");
app.commandLine.appendSwitch("disable-metrics-repo");
app.commandLine.appendSwitch("enable-javascript-harmony");
app.commandLine.appendSwitch("enable-future-v8-vm-features");
app.commandLine.appendSwitch("enable-webgl2-compute-context");
app.commandLine.appendSwitch("disable-hang-monitor");
app.commandLine.appendSwitch("no-referrers");
app.commandLine.appendSwitch("renderer-process-limit", 100);
app.commandLine.appendSwitch("max-active-webgl-contexts", 100);
app.commandLine.appendSwitch("enable-quic");
app.commandLine.appendSwitch("high-dpi-support", 1);
app.commandLine.appendSwitch("ignore-gpu-blacklist");
app.commandLine.appendSwitch("disable-2d-canvas-clip-aa");
app.commandLine.appendSwitch("disable-bundled-ppapi-flash");
app.commandLine.appendSwitch("disable-logging");
app.commandLine.appendSwitch("disable-web-security");
app.commandLine.appendSwitch("webrtc-max-cpu-consumption-percentage=100");
if (cpus()[0].model.includes("AMD")) {
    app.commandLine.appendSwitch("enable-zero-copy");
}

function createLoadingScreen() {
  loadingScreen = new BrowserWindow({
    width: 400,
    height: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    icon: `${__dirname}/assets/icon/anticheat.ico`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      hardwareAcceleration: true,
      webSecurity: false,
      hardwareAcceleration: true,
      webSecurity: true,
      enableRemoteModule: false,
    },
  });

  loadingScreen.loadFile('loading.html');
}

function createWindow() {
  createLoadingScreen();

  // Check for processes with "cheatengine" in their name
  exec('tasklist', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error checking processes: ${error.message}`);
      return;
    }

    const isCheatEngineRunning = stdout.toLowerCase().includes('cheatengine');

    if (isCheatEngineRunning) {
      // Cheat engine detected, show cheat detected message
      mainWindow = new BrowserWindow({
        width: 400,
        height: 200,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        icon: `${__dirname}/assets/icon/anticheat.ico`,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          hardwareAcceleration: true,
          webSecurity: false,
        },
      });
      mainWindow.loadFile('detected.html');
      // Close the loading screen immediately if cheat engine is detected
      loadingScreen.close();
    } else {
      // No cheat engine detected, continue with the game
      mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: `${__dirname}/assets/icon/icon.ico`,
        title: "MiniRoyale", // Set the title to "MiniRoyale"
        autoHideMenuBar: true, // Hide the Electron toolbar
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            hardwareAcceleration: true,
            frameRate: 240,
            vsync: true,
            webSecurity: true,
            enableRemoteModule: false,
        },
      });

      mainWindow.loadURL('https://miniroyale.io/');

      // Close the loading screen after 5 seconds, regardless of site load status
      setTimeout(() => {
        loadingScreen.close();
        mainWindow.show();
      }, 9000);

      mainWindow.on('closed', function () {
        mainWindow = null;
      });
    }
  });
}

app.whenReady().then(() => {
  createWindow();

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

// Handle the close-app message
ipcMain.on('close-app', () => {
    app.quit();
  });