// OpenVPN Client Library
export interface VPNConnection {
  id: string
  serverId: string
  status: "connecting" | "connected" | "disconnecting" | "disconnected"
  ip: string
  ping: number
  downloadSpeed: number
  uploadSpeed: number
  connectedAt: Date
}

export interface VPNServer {
  id: string
  name: string
  country: string
  city: string
  flag: string
  load: number
  ping: number
  users: number
}

import { configManager } from "./config-manager"

class VPNClient {
  private getBaseUrl(): string {
    const config = configManager.getConfig()
    return config.apiUrl || "/api/vpn"
  }

  private getHeaders(): HeadersInit {
    const config = configManager.getConfig()
    return {
      "Content-Type": "application/json",
      ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
    }
  }

  async connect(serverId: string, protocol = "UDP", encryption = "AES-256"): Promise<VPNConnection> {
    try {
      console.log("[v0] VPN Client: Initiating connection to", serverId)

      const response = await fetch(`${this.getBaseUrl()}/connect`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ serverId, protocol, encryption }),
      })

      if (!response.ok) {
        throw new Error(`Connection failed: ${response.statusText}`)
      }

      const data = await response.json()
      this.currentConnection = data

      console.log("[v0] VPN Client: Connected successfully", data.connectionId)
      return data
    } catch (error) {
      console.error("[v0] VPN Client: Connection error", error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (!this.currentConnection) {
      throw new Error("No active connection")
    }

    try {
      console.log("[v0] VPN Client: Disconnecting", this.currentConnection.id)

      const response = await fetch(`${this.getBaseUrl()}/disconnect`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ connectionId: this.currentConnection.id }),
      })

      if (!response.ok) {
        throw new Error(`Disconnection failed: ${response.statusText}`)
      }

      this.currentConnection = null
      console.log("[v0] VPN Client: Disconnected successfully")
    } catch (error) {
      console.error("[v0] VPN Client: Disconnection error", error)
      throw error
    }
  }

  async getStatus(): Promise<VPNConnection | null> {
    if (!this.currentConnection) {
      return null
    }

    try {
      const response = await fetch(`${this.getBaseUrl()}/status?connectionId=${this.currentConnection.id}`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`)
      }

      const data = await response.json()
      this.currentConnection = { ...this.currentConnection, ...data }
      return this.currentConnection
    } catch (error) {
      console.error("[v0] VPN Client: Status check error", error)
      return this.currentConnection
    }
  }

  async downloadConfig(
    ip: string,
    port: number,
    protocol: string,
    ovpnConfigBase64?: string,
  ): Promise<{ config: string; filename: string }> {
    try {
      console.log(`[v0] VPN Client: Downloading config for ${ip}:${port}`)

      const response = await fetch("/api/vpn/config", {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ ip, port, protocol, ovpnConfigBase64 }),
      })

      if (!response.ok) {
        throw new Error(`Config download failed: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] VPN Client: Config downloaded successfully")
      return data
    } catch (error) {
      console.error("[v0] VPN Client: Config download error", error)
      throw error
    }
  }

  getCurrentConnection(): VPNConnection | null {
    return this.currentConnection
  }

  isConnected(): boolean {
    return this.currentConnection?.status === "connected"
  }
}

export const vpnClient = new VPNClient()
