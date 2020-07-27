const { app, BrowserWindow } = require('electron');

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.once('ready-to-show', () => {
    win.show()
  });

  win.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    if (url.indexOf('https://note.youdao.com/web') >= 0) {
      // If url is inside youdao, do not open browser, just loadURL to keep user inside this app
      win.loadURL(url);
      return;
    }
    require('electron').shell.openExternal(url);
  });

  win.webContents.on('dom-ready', () => {
    win.webContents.executeJavaScript(`
      const extention = document.createElement('script');
      extention.src = 'https://gitcdn.xyz/repo/greatbody/youdao-note-optimizer/master/dist/youdao-userscript.js';
      extention.setAttribute('crossorigin', 'anonymous');
      extention.setAttribute('type', 'text/javascript');
      document.body.appendChild(extention);
    `);
  });

  win.maximize();

  // and load the index.html of the app.
  win.loadURL('https://note.youdao.com/web/');

}

app.on('ready', createWindow)
