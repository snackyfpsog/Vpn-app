"use client"

import { useState } from "react"
import { Power, Wifi, WifiOff } from "lucide-react"

interface ConnectionControlsProps {
  isConnected: boolean
  onConnect: () => void
  onDisconnect: () => void
  isLoading?: boolean
  selectedServer?: string
}

export function ConnectionControls({
  isConnected,
  onConnect,
  onDisconnect,
  isLoading = false,
  selectedServer = "US - New York",
}: ConnectionControlsProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="space-y-4">
      {/* Main Control Button */}
      <div className="flex gap-4">
        <button
          onClick={isConnected ? onDisconnect : onConnect}
          disabled={isLoading}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isConnected
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-accent text-accent-foreground hover:bg-accent/90"
          }`}
        >
          <Power className="w-5 h-5" />
          {isLoading ? "Processing..." : isConnected ? "Disconnect" : "Connect"}
        </button>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-6 py-4 rounded-lg border border-border bg-card text-foreground hover:border-accent/50 transition-colors"
          title="Toggle details"
        >
          {isConnected ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
        </button>
      </div>

      {/* Connection Status Details */}
      {showDetails && (
        <div className="bg-secondary/50 border border-border rounded-lg p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className={`text-sm font-semibold ${isConnected ? "text-green-400" : "text-muted-foreground"}`}>
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Server</span>
            <span className="text-sm font-semibold text-foreground">{selectedServer}</span>
          </div>
          {isConnected && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Protocol</span>
                <span className="text-sm font-semibold text-foreground">OpenVPN UDP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Encryption</span>
                <span className="text-sm font-semibold text-foreground">AES-256</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
