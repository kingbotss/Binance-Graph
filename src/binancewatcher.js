require('@electron/remote/main').initialize();
const { app, BrowserWindow,dialog,ipcMain} =require('electron');
app.commandLine.appendSwitch('disable-site-isolation-trials');
/*const cp=require('child_process');
const path=require('path');
  const fs = require('fs');
  const API=require('axios').default;
  
  */

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // is default value after Electron v5
      contextIsolation: false, // protect against prototype pollution
 
   //  preload: path.join(__dirname, "renderer.js") // use a preload script
    }

  });
  mainWindow.setMenuBarVisibility(false);
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/AdminLTE/starter.html`);


  // Open the DevTools.
  mainWindow.webContents.openDevTools();


  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  mainWindow.webContents.on("did-finish-load", () => { 

  });

};

async function showerrodialog(str){
 dialog.showErrorBox("Error Occured",str);
}


app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
 // cp.spawn('taskkill /IM /F chrome.exe',{shell:true});
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
    mainWindow.reload();
  }
});
global.app=app;
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
