const { contextBridge, ipcRenderer } = require('electron/renderer')

// This exposes the functions of the ipcMain so we can add
// the event listener to the buttons in the interface
contextBridge.exposeInMainWorld('electronAPI', 
{
    convertPoToCsvFiles: () => ipcRenderer.invoke('main:convertPoToCsv'),
    convertCsvToPoFiles: () => ipcRenderer.invoke('main:convertCsvToPo')
})