import { Tray, Menu, BrowserWindow, nativeImage, app } from 'electron'
import path from 'path'

let tray: Tray | null = null

export function createTray(mainWindow: BrowserWindow): void {
  try {
    const iconPath = path.join(__dirname, '..', 'assets', 'tray-icon.png')
    const icon = nativeImage.createFromPath(iconPath)
    tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon)
  } catch {
    tray = new Tray(nativeImage.createEmpty())
  }

  tray.setToolTip('Focus Guardian — AI Productivity Assistant')

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Focus Guardian',
      click: () => {
        mainWindow.show()
        mainWindow.focus()
      },
    },
    {
      label: 'Start Focus Session',
      click: () => {
        mainWindow.show()
        mainWindow.focus()
        mainWindow.webContents.send('toggle-focus-mode', true)
      },
    },
    { type: 'separator' },
    {
      label: 'Pause Monitoring',
      type: 'checkbox',
      checked: false,
      click: (menuItem) => {
        mainWindow.webContents.send('pause-monitoring', menuItem.checked)
      },
    },
    { type: 'separator' },
    {
      label: 'Quit Focus Guardian',
      click: () => {
        app.quit()
      },
    },
  ])

  tray.setContextMenu(contextMenu)

  tray.on('double-click', () => {
    mainWindow.show()
    mainWindow.focus()
  })
}
