import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("vpnAPI", {
  connect: (serverId: string, config: string) => ipcRenderer.invoke("vpn:connect", serverId, config),
  disconnect: () => ipcRenderer.invoke("vpn:disconnect"),
  getStatus: () => ipcRenderer.invoke("vpn:status"),
  getIP: () => ipcRenderer.invoke("vpn:get-ip"),
})
