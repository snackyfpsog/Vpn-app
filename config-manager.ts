// Configuration Manager for OpenVPN API
interface VPNConfig {
  apiUrl: string
  apiKey: string
  isConfigured: boolean
}

const CONFIG_KEY = "vpn_config"

export const configManager = {
  getConfig(): VPNConfig {
    if (typeof window === "undefined") {
      return { apiUrl: "", apiKey: "", isConfigured: false }
    }

    const stored = localStorage.getItem(CONFIG_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return { apiUrl: "", apiKey: "", isConfigured: false }
      }
    }
    return { apiUrl: "", apiKey: "", isConfigured: false }
  },

  saveConfig(config: Partial<VPNConfig>): void {
    if (typeof window === "undefined") return

    const current = this.getConfig()
    const updated = {
      ...current,
      ...config,
      isConfigured: !!(config.apiUrl && config.apiKey),
    }
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updated))
  },

  clearConfig(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(CONFIG_KEY)
  },

  isConfigured(): boolean {
    return this.getConfig().isConfigured
  },
}
