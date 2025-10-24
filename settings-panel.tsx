"use client"

import { useState } from "react"
import { Wifi, Shield, Bell, Lock, Eye, EyeOff } from "lucide-react"
import { APIConfig } from "./api-config"

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    killSwitch: true,
    autoConnect: false,
    splitTunneling: false,
    notifications: true,
    protocol: "udp",
    encryption: "aes256",
    dnsLeak: true,
    ipv6Leak: false,
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: typeof prev[key] === "boolean" ? !prev[key] : prev[key],
    }))
  }

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${checked ? "bg-accent" : "bg-secondary"}`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  )

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-2">Configure your VPN preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        <APIConfig />

        {/* Security Settings */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Security</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Kill Switch</p>
                <p className="text-sm text-muted-foreground">Block all traffic if VPN disconnects</p>
              </div>
              <ToggleSwitch checked={settings.killSwitch} onChange={() => handleToggle("killSwitch")} />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Split Tunneling</p>
                <p className="text-sm text-muted-foreground">Route specific apps outside VPN</p>
              </div>
              <ToggleSwitch checked={settings.splitTunneling} onChange={() => handleToggle("splitTunneling")} />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="font-medium text-foreground">DNS Leak Protection</p>
                <p className="text-sm text-muted-foreground">Prevent DNS queries from leaking</p>
              </div>
              <ToggleSwitch checked={settings.dnsLeak} onChange={() => handleToggle("dnsLeak")} />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="font-medium text-foreground">IPv6 Leak Protection</p>
                <p className="text-sm text-muted-foreground">Disable IPv6 to prevent leaks</p>
              </div>
              <ToggleSwitch checked={settings.ipv6Leak} onChange={() => handleToggle("ipv6Leak")} />
            </div>
          </div>
        </div>

        {/* Connection Settings */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Wifi className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Connection</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Auto Connect</p>
                <p className="text-sm text-muted-foreground">Connect on startup</p>
              </div>
              <ToggleSwitch checked={settings.autoConnect} onChange={() => handleToggle("autoConnect")} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Protocol</label>
              <select
                value={settings.protocol}
                onChange={(e) => setSettings((prev) => ({ ...prev, protocol: e.target.value }))}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
              >
                <option value="udp">UDP (Faster)</option>
                <option value="tcp">TCP (More Stable)</option>
                <option value="wireguard">WireGuard (Modern)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Encryption</label>
              <select
                value={settings.encryption}
                onChange={(e) => setSettings((prev) => ({ ...prev, encryption: e.target.value }))}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
              >
                <option value="aes256">AES-256 (Recommended)</option>
                <option value="aes128">AES-128</option>
                <option value="chacha20">ChaCha20</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Enable Notifications</p>
              <p className="text-sm text-muted-foreground">Get alerts for connection changes</p>
            </div>
            <ToggleSwitch checked={settings.notifications} onChange={() => handleToggle("notifications")} />
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">Advanced Settings</h3>
            </div>
            {showAdvanced ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>

          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-border space-y-4">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">MTU Size</p>
                <input
                  type="number"
                  defaultValue="1500"
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">Custom DNS</p>
                <input
                  type="text"
                  placeholder="8.8.8.8"
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
