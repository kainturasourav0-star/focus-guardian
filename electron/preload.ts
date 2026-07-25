import { contextBridge, ipcRenderer } from 'electron'

/**
 * Context bridge — safely exposes a minimal API to the renderer process.
 * All communication between React and Electron goes through this bridge.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // ── Window Controls ──────────────────────────────────────────────────────
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),

  // ── Auth ─────────────────────────────────────────────────────────────────
  getSharedSecret: (): Promise<string> => ipcRenderer.invoke('get-shared-secret'),

  // ── Focus Mode ───────────────────────────────────────────────────────────
  setFocusMode: (active: boolean) => ipcRenderer.send('set-focus-mode', active),
  onToggleFocusMode: (callback: (active: boolean) => void) => {
    ipcRenderer.on('toggle-focus-mode', (_event, active: boolean) => callback(active))
    return () => ipcRenderer.removeAllListeners('toggle-focus-mode')
  },

  // ── Native Notifications ─────────────────────────────────────────────────
  showNotification: (title: string, body: string) =>
    ipcRenderer.send('show-notification', title, body),

  // ── External Links ───────────────────────────────────────────────────────
  openExternal: (url: string) => ipcRenderer.send('open-external', url),

  // ── System Theme ────────────────────────────────────────────────────────
  getTheme: (): Promise<boolean> => ipcRenderer.invoke('get-theme'),
})

// Type definitions are augmented globally in src/types/index.ts
