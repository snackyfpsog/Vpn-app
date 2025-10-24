import { exec } from "child_process"
import path from "path"
import fs from "fs"
import os from "os"
import sudo from "sudo-prompt"

export class VPNManager {
  private vpnProcess: any = null
  private isConnected = false
  private currentServerId: string | null = null
  private configDir: string

  constructor() {
    this.configDir = path.join(os.homedir(), ".vpn-gate-client")
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true })
    }
  }

  async connect(serverId: string, configContent: string): Promise<any> {
    try {
      // Save config file
      const configPath = path.join(this.configDir, `${serverId}.ovpn`)
      fs.writeFileSync(configPath, configContent)

      // Start OpenVPN process with sudo
      return new Promise((resolve, reject) => {
        const command = `openvpn --config "${configPath}"`

        sudo.exec(command, { name: "VPN Gate Client" }, (error: any, stdout: any, stderr: any) => {
          if (error) {
            reject(new Error(`Failed to connect: ${error.message}`))
          } else {
            this.vpnProcess = true
            this.isConnected = true
            this.currentServerId = serverId
            resolve({ connected: true, serverId })
          }
        })
      })
    } catch (error) {
      throw error
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.vpnProcess) {
        const command = "pkill -f openvpn"
        return new Promise((resolve, reject) => {
          sudo.exec(command, { name: "VPN Gate Client" }, (error: any) => {
            if (error) {
              reject(error)
            } else {
              this.vpnProcess = null
              this.isConnected = false
              this.currentServerId = null
              resolve()
            }
          })
        })
      }
    } catch (error) {
      throw error
    }
  }

  async getStatus(): Promise<any> {
    return {
      connected: this.isConnected,
      serverId: this.currentServerId,
      timestamp: new Date().toISOString(),
    }
  }

  async getVPNIP(): Promise<string> {
    return new Promise((resolve, reject) => {
      exec("curl -s https://api.ipify.org", (error, stdout) => {
        if (error) {
          reject(error)
        } else {
          resolve(stdout.trim())
        }
      })
    })
  }
}
