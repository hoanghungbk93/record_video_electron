const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Listen for save-video event from renderer process
ipcMain.on('save-video', async (event, buffer) => {
    // Open a save dialog
    const { filePath } = await dialog.showSaveDialog({
        title: 'Save recorded video',
        defaultPath: 'recorded_video.webm',
        filters: [{ name: 'WebM Video', extensions: ['webm'] }]
    });

    if (filePath) {
        // Write the video buffer to the chosen file path
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                console.error("Failed to save video:", err);
            } else {
                console.log("Video saved successfully to", filePath);
            }
        });
    }
});
