import { app, BrowserWindow, ipcMain, Menu } from "electron"
import path from "path"
import isDev from "electron-is-dev"
import { VPNManager } from "./vpn-manager"

let mainWindow: BrowserWindow | null = null
let vpnManager: VPNManager

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.ts"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const startUrl = isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../out/index.html")}`

  mainWindow.loadURL(startUrl)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

app.on("ready", () => {
  vpnManager = new VPNManager()
  createWindow()
  createMenu()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC Handlers for VPN operations
ipcMain.handle("vpn:connect", async (event, serverId: string, config: string) => {
  try {
    const result = await vpnManager.connect(serverId, config)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle("vpn:disconnect", async () => {
  try {
    await vpnManager.disconnect()
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle("vpn:status", async () => {
  try {
    const status = await vpnManager.getStatus()
    return { success: true, data: status }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle("vpn:get-ip", async () => {
  try {
    const ip = await vpnManager.getVPNIP()
    return { success: true, data: ip }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

const createMenu = () => {
  const template: any[] = [
    {
      label: "File",
      submenu: [
        {
          label: "Exit",
          accelerator: "CmdOrCtrl+Q",
          click: () => {
            app.quit()
          },
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About",
          click: () => {
            // Show about dialog
          },
        },
      ],
    },
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
