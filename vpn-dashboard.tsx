"use client"

import { useState, useEffect } from "react"
import { Power, Zap, Globe, Lock, Activity, AlertCircle, Download } from "lucide-react"
import { vpnProxyClient } from "@/lib/vpn-proxy-client"
import { vpnClient } from "@/lib/vpn-client" // Declare the vpnClient variable

interface Server {
  id: string
  name: string
  country: string
  flag: string
  load: number
  users: number
  ping: number
  ip?: string
  port?: number
  protocol?: string
}

interface VPNDashboardProps {
  selectedServer: Server
}

export function VPNDashboard({ selectedServer }: VPNDashboardProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [speed, setSpeed] = useState({ download: 0, upload: 0 })
  const [connectionTime, setConnectionTime] = useState(0)
  const [vpnIp, setVpnIp] = useState<string | null>(null)
  const [protocol, setProtocol] = useState("UDP")
  const [encryption, setEncryption] = useState("AES-256")
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    let statusInterval: NodeJS.Timeout
    if (isConnected) {
      statusInterval = setInterval(async () => {
        try {
          const status = await vpnProxyClient.getStatus(selectedServer.id)
          if (status && status.success) {
            setSpeed({
              download: status.downloadSpeed,
              upload: status.uploadSpeed,
            })
            setConnectionTime(Math.floor((Date.now() - new Date(status.connectedAt).getTime()) / 1000))
          }
        } catch (err) {
          console.error("[v0] Status polling error:", err)
        }
      }, 2000)
    }
    return () => clearInterval(statusInterval)
  }, [isConnected, selectedServer.id])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleConnect = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log("[v0] Starting VPN connection to", selectedServer.id)
      const connection = await vpnProxyClient.connect(
        selectedServer.id,
        selectedServer.ip || "127.0.0.1",
        selectedServer.port || 1194,
      )
      setIsConnected(true)
      setVpnIp(connection.vpnIp)
      setConnectionTime(0)
      console.log("[v0] Connected successfully:", connection)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to VPN"
      setError(errorMessage)
      console.error("[v0] Connection error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log("[v0] Disconnecting VPN")
      await vpnProxyClient.disconnect(selectedServer.id)
      setIsConnected(false)
      setVpnIp(null)
      setConnectionTime(0)
      setSpeed({ download: 0, upload: 0 })
      console.log("[v0] Disconnected successfully")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to disconnect from VPN"
      setError(errorMessage)
      console.error("[v0] Disconnection error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadConfig = async () => {
    if (!selectedServer.ip || !selectedServer.port) {
      setError("Server information not available")
      return
    }

    setIsDownloading(true)
    setError(null)
    try {
      console.log("[v0] Downloading OpenVPN config")
      const { config, filename } = await vpnClient.downloadConfig(
        selectedServer.ip,
        selectedServer.port,
        selectedServer.protocol || "UDP",
        (selectedServer as any).ovpnConfig, // Pass base64 config if available
      )

      // Create blob and download
      const blob = new Blob([config], { type: "text/plain" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      console.log("[v0] Config downloaded successfully")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to download config"
      setError(errorMessage)
      console.error("[v0] Download error:", err)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Connection Status</h2>
        <p className="text-muted-foreground mt-2">Manage your VPN connection</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-destructive">Connection Error</p>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )}

      {/* Main Connection Card */}
      <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center justify-center min-h-96 relative overflow-hidden">
        {isConnected && (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-accent via-transparent to-transparent animate-pulse" />
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${
              isConnected ? "bg-accent/20 border-2 border-accent" : "bg-secondary border-2 border-border"
            } ${isLoading ? "scale-95 opacity-50" : "scale-100 opacity-100"}`}
          >
            <Power
              className={`w-16 h-16 transition-all duration-500 ${
                isConnected ? "text-accent animate-pulse" : "text-muted-foreground"
              }`}
            />
          </div>

          <h3 className="text-2xl font-bold mb-2 text-foreground">
            {isLoading ? "Connecting..." : isConnected ? "Connected" : "Disconnected"}
          </h3>
          <p className="text-muted-foreground mb-8">
            {isLoading ? "Please wait..." : isConnected ? "Your connection is secure" : "Click to connect"}
          </p>

          <div className="flex gap-4">
            <button
              onClick={isConnected ? handleDisconnect : handleConnect}
              disabled={isLoading}
              className={`px-12 py-4 rounded-lg font-semibold transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                isConnected
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-accent text-accent-foreground hover:bg-accent/90"
              }`}
            >
              {isLoading ? "Processing..." : isConnected ? "Disconnect" : "Connect"}
            </button>

            <button
              onClick={handleDownloadConfig}
              disabled={isDownloading}
              className="px-6 py-4 rounded-lg font-semibold transition-all text-lg bg-secondary text-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              {isDownloading ? "Downloading..." : "Download Config"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Connection Time */}
        <div className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-muted-foreground">Connection Time</h4>
            <Activity className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-foreground font-mono">{formatTime(connectionTime)}</p>
          <p className="text-xs text-muted-foreground mt-2">{isConnected ? "Connected" : "Not connected"}</p>
        </div>

        {/* Download Speed */}
        <div className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-muted-foreground">Download</h4>
            <Globe className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-foreground font-mono">{speed.download.toFixed(1)} Mbps</p>
          <p className="text-xs text-muted-foreground mt-2">
            {speed.download > 80 ? "Excellent" : speed.download > 50 ? "Good" : "Fair"}
          </p>
        </div>

        {/* Upload Speed */}
        <div className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-muted-foreground">Upload</h4>
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-foreground font-mono">{speed.upload.toFixed(1)} Mbps</p>
          <p className="text-xs text-muted-foreground mt-2">
            {speed.upload > 40 ? "Excellent" : speed.upload > 20 ? "Good" : "Fair"}
          </p>
        </div>
      </div>

      {/* Connection Details */}
      {isConnected && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-accent" />
            <h4 className="font-semibold text-foreground">Connection Details</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-muted-foreground text-xs mb-1">Server</p>
              <p className="text-foreground font-semibold">
                {selectedServer.flag} {selectedServer.name}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-muted-foreground text-xs mb-1">Country</p>
              <p className="text-foreground font-semibold">{selectedServer.country}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-muted-foreground text-xs mb-1">VPN IP</p>
              <p className="text-foreground font-semibold font-mono text-xs">{vpnIp || "—"}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-muted-foreground text-xs mb-1">Protocol</p>
              <p className="text-foreground font-semibold">{protocol}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-muted-foreground text-xs mb-1">Encryption</p>
              <p className="text-foreground font-semibold">{encryption}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-muted-foreground text-xs mb-1">Ping</p>
              <p className="text-foreground font-semibold">{selectedServer.ping}ms</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-accent" />
          How to Use OpenVPN Config
        </h4>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
          <li>Download the OpenVPN config file using the "Download Config" button</li>
          <li>
            Install OpenVPN client from{" "}
            <a
              href="https://openvpn.net/community-downloads/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              openvpn.net
            </a>
          </li>
          <li>Import the downloaded .ovpn file into OpenVPN client</li>
          <li>Click "Connect" to establish the VPN connection</li>
          <li>Your traffic will now be routed through the selected VPN server</li>
        </ol>
      </div>
    </div>
  )
}
