import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { writeFileSync } from 'fs';
import * as wallpaper from 'wallpaper'; // Correct import

// Create the window
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    win.loadFile('index.html');

    // Capture the canvas image and set it as wallpaper
    setWallpaper(win);
}

function setWallpaper(win) {
    win.webContents.on('paint', () => {
        // Capture the image from the canvas
        win.webContents.capturePage().then(image => {
            const imagePath = join(__dirname, 'canvas_image.png');
            image.toPNG().then((buffer) => {
                // Save the captured image
                writeFileSync(imagePath, buffer);

                // Set the captured image as the wallpaper using wallpaper.set
                wallpaper.set(imagePath).then(() => {
                    console.log('Wallpaper set successfully');
                }).catch((err) => {
                    console.error('Failed to set wallpaper:', err);
                });
            });
        }).catch((err) => {
            console.error('Error capturing page:', err);
        });
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
