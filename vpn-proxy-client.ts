export class VPNProxyClient {
  private baseUrl = "/api/vpn/proxy"

  async connect(serverId: string, serverIp: string, serverPort: number) {
    console.log("[v0] VPN Proxy: Connecting to", serverId)

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "connect",
        serverId,
        serverIp,
        serverPort,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to connect via proxy")
    }

    const data = await response.json()
    console.log("[v0] VPN Proxy: Connected", data)
    return data
  }

  async disconnect(serverId: string) {
    console.log("[v0] VPN Proxy: Disconnecting from", serverId)

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "disconnect",
        serverId,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to disconnect via proxy")
    }

    const data = await response.json()
    console.log("[v0] VPN Proxy: Disconnected", data)
    return data
  }

  async getStatus(serverId: string) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "status",
        serverId,
      }),
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  }
}

export const vpnProxyClient = new VPNProxyClient()
