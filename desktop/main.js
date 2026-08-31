/* ============================================================
   Taplarp — Electron desktop shell.
   This is the first step toward a Steam build: it loads the
   exact same index.html/style.css/script.js used by the browser
   version, so there is only ever one copy of the game itself.

   Run with: npm start   (from inside this "desktop" folder)

   Steam-specific hooks (Steamworks achievements, cloud saves,
   etc. via steamworks.js) are intentionally NOT wired in yet --
   see ../README.md's "Roadmap to Steam" section for that step,
   since it needs a real Steam App ID to test against.
   ============================================================ */

const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 480,
    height: 800,
    resizable: true,
    title: 'Taplarp',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, '..', 'index.html'));

  // --- Smoke-test mode: used by our own verification script, and reusable
  // as a quick regression check any time (npm run smoketest). ---
  if (process.env.TAPLARP_SMOKE_TEST === '1') {
    win.webContents.on('did-finish-load', async () => {
      await new Promise(r => setTimeout(r, 500));
      const image = await win.webContents.capturePage();
      const fs = require('fs');
      const outPath = process.env.TAPLARP_SMOKE_SCREENSHOT || path.join(__dirname, 'smoketest_screenshot.png');
      fs.writeFileSync(outPath, image.toPNG());
      console.log('SMOKE_TEST_OK screenshot written to ' + outPath);
      app.quit();
    });
    win.webContents.on('did-fail-load', (_e, code, desc) => {
      console.error('SMOKE_TEST_FAIL did-fail-load', code, desc);
      app.exit(1);
    });
  }

  return win;
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
