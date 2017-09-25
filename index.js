const path = require('path');
const electron = require('electron');
const { app, BrowserWindow, Menu, dialog } = electron;
const groupFileAccess = require('./app/groupFileAccess');

let mainWindow;

app.on('ready', () => {
//--Set up dev tools if in development mode development is for work computer, dev-home is for home computer
console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtension('C:/Users/mark.mccoid/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/2.5.1_0');
    BrowserWindow.addDevToolsExtension('C:/Users/mark.mccoid/AppData/Local/Google/Chrome/User Data/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.15.1_0');
  } else if (process.env.NODE_ENV === 'dev-home') {
    BrowserWindow.addDevToolsExtension('C:/Users/mark/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/2.4.0_0');
    BrowserWindow.addDevToolsExtension('C:/Users/mark/AppData/Local/Google/Chrome/User Data/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.15.1_0');
  }

  mainWindow = new BrowserWindow({
    width: 1080,
    height: 800,
		show: false,
		icon: path.join(__dirname, 'assets/icon.ico'),
		webPreferences : { backgroundThrottling: false }
  });
  mainWindow.loadURL(`file://${__dirname}/public/index.html`);
	//Attach the main Menu
	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);

	if (process.env.NODE_ENV === 'development') {
		mainWindow.toggleDevTools();
	}
	mainWindow.on('ready-to-show', () => {
		mainWindow.show();
	})
});

//------------------------------------------------
//Setup Help window function to show help from menu
//The showUserGuide function is called from the Help/User Guide menu option
let helpWindow;
const showUserGuide = () => {
  //If helpWindow already defined, give it focus and leave function
  if (helpWindow) {
    helpWindow.focus();
    return;
  }
  //Define new BrowserWindow
  helpWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    title: 'Analytix Group Creator User Guide',
    icon: path.join(__dirname, 'assets/icon.ico')
  });
  //When use closes help window, null its variable
  helpWindow.on('closed', () => {
    helpWindow = null;
  });
  //Load help file HTML file into BrowserWindow
  helpWindow.loadURL(`file://${__dirname}/public/GroupEditorHelp.html`);
};
//------------------------------------------------

//-------------
//-Close process when all windows are closed
app.on('window-all-closed', function() {
 if (process.platform != 'darwin') {
		 app.quit();
	 }
});

//------------------------------------------
const exitAccelerator = process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q';
const devMenu = 	{
		label: 'Dev',
		submenu: [
			{role: 'reload'},
			{role: 'forcereload'},
			{role: 'toggledevtools'}
		]
	};

let menuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Quit',
				accelerator: exitAccelerator,
				click() {
					app.quit();
				}
			}
		]
	},
  {
    label: 'Help',
    submenu: [
      {
        label: 'User Guide',
        click() {
          showUserGuide();
        }
      },
      {type: 'separator'},
      {
        label: 'About',
        click() {
          let message = 'Analytix Group Editor v1.0';
          dialog.showMessageBox({type: 'info', message, title: 'Newscycle Solutions - Group Editor'});
        }
      }
    ]
  }
];

//Add a 'Dev' menu option if in development mode
if (process.env.NODE_ENV === 'development') {
	menuTemplate.push(devMenu);
}

if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

// ipcMain.on('request:AppNames', () => {
// 	console.log('request:AppNames received');
// 	groupFileAccess.readAppNamesAsync()
// 		.then(data => {
// 			mainWindow.webContents.send('response:AppNames', data);
// 		})
	//mainWindow.webContents.send('response:AppNames', groupFileAccess.readAppNames());
	// fs.readFile(GROUPS_FILE, (err, data) => {
	// 	console.log(data);
	// 	mainWindow.webContents.send('response:AppNames', JSON.parse(data));
	// });

//});
