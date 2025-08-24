const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('node:path')
const converter = require("./pocsvconverter.js");

// A file manager window pops up asking for a file of certain extension
// Returns the file path, undefined if it's cancelled
async function openFile(extension, name, extraComment)
{
    const { canceled, filePaths } = await dialog.showOpenDialog
    ({ 
        title: "Choose the " + extraComment + extension + " file:",
        filters: [{ name: name, extensions: [extension]}],
        properties: ['openFile'] 
    })

    if (!canceled)
    {
        return filePaths[0];
    }
}

// A file manager window pops up asking for the location to save the file of certain extension
// Returns the file path, undefined if it's cancelled
async function saveFile(extension, name)
{
    const { canceled, filePath } = await dialog.showSaveDialog
    ({ 
        title: "Save the generated " + extension + " file:",
        filters: [{ name: name, extensions: [extension]}]
    })

    if (!canceled)
    {
        return filePath;
    }
}

// Gets the po file path and the saved csv file path and calls for the converter
// Returns a string with the output of the result 
async function convertPoToCsv()
{
    const POFilePath = await openFile('po', 'Portable Object', '');

    if (POFilePath === undefined)
        return "Error, no po file found";

    const CSVSaveFilePath = await saveFile('csv', 'Comma-separated value');

    if (CSVSaveFilePath === undefined)
        return "Error, no csv save location found";

    converter.printPoAsCsv(POFilePath, CSVSaveFilePath);
    return '';

}

async function convertCsvToPo()
{
    const OriginalPOFilePath = await openFile('po', 'Portable Object', 'original ');

    if (OriginalPOFilePath === undefined)
        return "Error, no po file found";

    const CSVFilePath = await openFile('csv', 'Comma-separated value', '');

    if (CSVFilePath === undefined)
        return "Error, no csv file found";

    const POSaveFilePath = await saveFile('po', 'Portable Object');

    if (POSaveFilePath === undefined)
        return "Error, no po save location found";

    converter.mergeCsvIn(OriginalPOFilePath, CSVFilePath, POSaveFilePath);
    return '';
}

app.whenReady().then(() => 
{
    // Create a window
    const window = new BrowserWindow
    ({
        width: 400,
        height: 300,
        webPreferences: 
        {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        },
        autoHideMenuBar: true
    })

    // Load a webpage
    window.loadFile('index.html');

    // The ipc will handle the calls from the button with the corresponding functions
    ipcMain.handle('main:convertPoToCsv', convertPoToCsv);
    ipcMain.handle('main:convertCsvToPo', convertCsvToPo);
});

// When all the windows are closed, close the app
app.on('window-all-closed', () =>
{
    if (process.platform !== 'darwin') 
        app.quit()
})
