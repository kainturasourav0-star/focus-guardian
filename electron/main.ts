import {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  Notification,
  globalShortcut,
  shell,
} from 'electron'
import path from 'path'
import { spawn, ChildProcess } from 'child_process'
import http from 'http'
import { createTray } from './tray'

// ─── Constants ───────────────────────────────────────────────────────────────
const BACKEND_URL = 'http://127.0.0.1:8000'
const SHARED_SECRET = process.env.FOCUS_GUARDIAN_SECRET || 'fg-dev-secret-2024'
const IS_DEV = process.env.NODE_ENV !== 'production'

let mainWindow: BrowserWindow | null = null
let backendProcess: ChildProcess | null = null
let isFocusModeActive = false

// ─── Backend Launch ───────────────────────────────────────────────────────────
function spawnBackend(): void {
  const backendPath = IS_DEV
    ? path.join(__dirname, '..', 'backend', 'main.py')
    : path.join(process.resourcesPath, 'backend', 'main.py')

  // Try common Python locations on Windows
  const pythonCandidates = [
    'D:\\Python314\\python.exe',
    'C:\\Python312\\python.exe',
    'C:\\Python311\\python.exe',
    'python3',
    'python',
  ]

  const python = IS_DEV
    ? (pythonCandidates.find((p) => {
        try { require('fs').accessSync(p) ; return true } catch { return false }
      }) || 'python')
    : path.join(process.resourcesPath, 'backend', 'backend.exe')

  const args = IS_DEV ? [backendPath] : []
  const cmd = IS_DEV ? python : python

  console.log('[Electron] Spawning backend:', cmd, args)

  backendProcess = spawn(cmd, args, {
    env: {
      ...process.env,
      FOCUS_GUARDIAN_SECRET: SHARED_SECRET,
      PYTHONUNBUFFERED: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  backendProcess.stdout?.on('data', (data) => {
    console.log('[Backend]', data.toString().trim())
  })

  backendProcess.stderr?.on('data', (data) => {
    console.error('[Backend ERR]', data.toString().trim())
  })

  backendProcess.on('exit', (code) => {
    console.log('[Electron] Backend exited with code:', code)
  })
}

// ─── Health Check with Retry ─────────────────────────────────────────────────
function waitForBackend(retries = 30, delay = 1000): Promise<boolean> {
  return new Promise((resolve) => {
    const attempt = (remaining: number) => {
      http
        .get(`${BACKEND_URL}/api/health`, (res) => {
          if (res.statusCode === 200) {
            console.log('[Electron] Backend is ready ✓')
            resolve(true)
          } else if (remaining > 0) {
            setTimeout(() => attempt(remaining - 1), delay)
          } else {
            resolve(false)
          }
        })
        .on('error', () => {
          if (remaining > 0) {
            setTimeout(() => attempt(remaining - 1), delay)
          } else {
            resolve(false)
          }
        })
    }
    attempt(retries)
  })
}

// ─── Window Creation ──────────────────────────────────────────────────────────
async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    frame: false,          // Custom titlebar
    titleBarStyle: 'hidden',
    backgroundColor: '#0a0a0f',
    show: false,
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  // Load app
  if (IS_DEV) {
    await mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    await mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  // Reveal when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })

  // Create system tray
  createTray(mainWindow)

  // Register global shortcut for Focus Mode toggle
  globalShortcut.register('CommandOrControl+Shift+F', () => {
    if (mainWindow) {
      isFocusModeActive = !isFocusModeActive
      mainWindow.webContents.send('toggle-focus-mode', isFocusModeActive)
      mainWindow.show()
      mainWindow.focus()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// ─── IPC Handlers ────────────────────────────────────────────────────────────
function registerIpcHandlers(): void {
  // Window controls
  ipcMain.on('window-minimize', () => mainWindow?.minimize())
  ipcMain.on('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })
  ipcMain.on('window-close', () => mainWindow?.close())

  // Pass shared secret to renderer
  ipcMain.handle('get-shared-secret', () => SHARED_SECRET)

  // Focus mode
  ipcMain.on('set-focus-mode', (_event, active: boolean) => {
    isFocusModeActive = active
    if (active) {
      mainWindow?.setFullScreen(false)
    }
  })

  // Native notifications
  ipcMain.on('show-notification', (_event, title: string, body: string) => {
    new Notification({ title, body }).show()
  })

  // Open external link safely
  ipcMain.on('open-external', (_event, url: string) => {
    shell.openExternal(url)
  })

  // Theme
  ipcMain.handle('get-theme', () => nativeTheme.shouldUseDarkColors)
}

// ─── App Lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  nativeTheme.themeSource = 'dark'

  registerIpcHandlers()

  // Spawn Python backend
  spawnBackend()

  // Wait for backend to be healthy before showing window
  const isReady = await waitForBackend()
  if (!isReady) {
    console.warn('[Electron] Backend did not start in time — loading UI anyway')
  }

  await createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll()
  if (process.platform !== 'darwin') {
    backendProcess?.kill()
    app.quit()
  }
})

app.on('before-quit', () => {
  backendProcess?.kill()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
