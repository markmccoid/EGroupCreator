const path = require('path');
const electron = require('electron');
const { app, BrowserWindow } = electron;

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  mainWindow.loadURL(`file://${__dirname}/public/index.html`);
  
})
