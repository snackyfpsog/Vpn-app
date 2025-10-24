"use client"

import { useState, useEffect } from "react"
import { Key, Globe, Check, AlertCircle } from "lucide-react"
import { configManager } from "@/lib/config-manager"

export function APIConfig() {
  const [apiUrl, setApiUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const config = configManager.getConfig()
    setApiUrl(config.apiUrl)
    setApiKey(config.apiKey)
  }, [])

  const handleSave = () => {
    if (!apiUrl.trim() || !apiKey.trim()) {
      setError("Both API URL and API Key are required")
      return
    }

    if (!apiUrl.startsWith("http")) {
      setError("API URL must start with http:// or https://")
      return
    }

    configManager.saveConfig({ apiUrl, apiKey })
    setSaved(true)
    setError("")
    setTimeout(() => setSaved(false), 3000)
  }

  const handleClear = () => {
    setApiUrl("")
    setApiKey("")
    configManager.clearConfig()
    setSaved(false)
    setError("")
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">OpenVPN API Configuration</h3>
      </div>

      <div className="space-y-4">
        {/* API URL Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">API URL</label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => {
              setApiUrl(e.target.value)
              setError("")
            }}
            placeholder="https://api.openvpn.com/v1"
            className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors"
          />
          <p className="text-xs text-muted-foreground mt-1">Your OpenVPN API endpoint URL</p>
        </div>

        {/* API Key Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">API Key</label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                setError("")
              }}
              placeholder="Enter your OpenVPN API key"
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors pr-10"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Key className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Your OpenVPN API authentication key</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {saved && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Check className="w-4 h-4 text-green-500" />
            <p className="text-sm text-green-500">Configuration saved successfully!</p>
          </div>
        )}

        {/* Status */}
        {configManager.isConfigured() && (
          <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
            <p className="text-sm text-accent font-medium">✓ API is configured and ready to use</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2 rounded-lg transition-colors"
          >
            Save Configuration
          </button>
          <button
            onClick={handleClear}
            className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground font-medium py-2 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
