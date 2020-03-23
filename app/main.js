
const fs = require('fs');
const { app, BrowserWindow, dialog } = require('electron');

let mainWindow = null;


app.on('ready', () => {
    mainWindow = new BrowserWindow({ show: false });

    mainWindow.loadFile(`${__dirname}/index.html`);

    // getFileFromUser();

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
});

exports.getFileFromUser = () => {
    const files = dialog.showOpenDialog( mainWindow, {
        properties: ['openFile'],
        buttonLabel: 'Unveil',
        title: 'Open Fire Sale Document',
        filters: [
            {   name: 'Markdown files', 
                extensions: ['md', 'mdown', 'markdown', 'marcdown']
            }, {
            name: 'Text files', 
            extensions: ['txt', 'text']
        }]
    });

    if (!files) return;

    const file = files[0];
    openFile(file);
};

exports.saveMarkdown = (file, content) => {
    if (!file) {
        file = dialog.showSaveDialog(mainWindow, {
            title: 'Save Markdown',
            defaultPath: app.getPath('desktop'),
            filters: [{ name: 'Markdown files', extensions: ['md', 'markdown', 'mdown', 'marcdown']}]
        });
    }

    if(!file) return;

    fs.writeFileSync(file, content);

    openFile(file);
};

exports.saveHTML = (content) => {
    const file = dialog.showSaveDialog(mainWindow, {
            title: 'Save HTML',
            defaultPath: app.getPath('desktop'),
            filters: [{ name: 'HTML files', extensions: ['html', 'htm']}]
        });

    if(!file) return;

    fs.writeFileSync(file, content);

    // openFile(file);
};

const openFile = (exports.openFile = file => {
    const content = fs.readFileSync(file).toString();
    app.addRecentDocument(file);
    mainWindow.webContents.send('file-opened', file, content);
});