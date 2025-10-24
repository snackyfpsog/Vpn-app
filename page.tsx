"use client"

import { useState, useEffect } from "react"
import { VPNDashboard } from "@/components/vpn-dashboard"
import { ServerList } from "@/components/server-list"
import { SettingsPanel } from "@/components/settings-panel"

export interface Server {
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

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "servers" | "settings">("dashboard")
  const [selectedServerId, setSelectedServerId] = useState<string>("")
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServers = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/vpn/servers")
        const data = await response.json()

        console.log("[v0] Server fetch response:", data)

        if (!data.success || !data.servers) {
          console.warn("[v0] Invalid response from API")
          throw new Error("Invalid API response")
        }

        const serversToUse =
          data.servers.length > 0
            ? data.servers
            : [
                {
                  id: "1",
                  ip: "203.0.113.1",
                  port: 1194,
                  protocol: "tcp",
                  countryCode: "JP",
                  users: 4567,
                  uptime: 95,
                  speed: 50000,
                },
                {
                  id: "2",
                  ip: "203.0.113.2",
                  port: 1194,
                  protocol: "tcp",
                  countryCode: "CN",
                  users: 5234,
                  uptime: 92,
                  speed: 45000,
                },
                {
                  id: "3",
                  ip: "203.0.113.3",
                  port: 1194,
                  protocol: "tcp",
                  countryCode: "US",
                  users: 1234,
                  uptime: 98,
                  speed: 55000,
                },
                {
                  id: "4",
                  ip: "203.0.113.4",
                  port: 1194,
                  protocol: "tcp",
                  countryCode: "SG",
                  users: 2345,
                  uptime: 96,
                  speed: 52000,
                },
                {
                  id: "5",
                  ip: "203.0.113.5",
                  port: 1194,
                  protocol: "tcp",
                  countryCode: "HK",
                  users: 3456,
                  uptime: 94,
                  speed: 48000,
                },
              ]

        const countryMap: Record<string, { name: string; flag: string }> = {
          JP: { name: "Japan", flag: "🇯🇵" },
          US: { name: "USA", flag: "🇺🇸" },
          CN: { name: "China", flag: "🇨🇳" },
          IN: { name: "India", flag: "🇮🇳" },
          BR: { name: "Brazil", flag: "🇧🇷" },
          RU: { name: "Russia", flag: "🇷🇺" },
          DE: { name: "Germany", flag: "🇩🇪" },
          FR: { name: "France", flag: "🇫🇷" },
          GB: { name: "UK", flag: "🇬🇧" },
          CA: { name: "Canada", flag: "🇨🇦" },
          AU: { name: "Australia", flag: "🇦🇺" },
          SG: { name: "Singapore", flag: "🇸🇬" },
          HK: { name: "Hong Kong", flag: "🇭🇰" },
          KR: { name: "South Korea", flag: "🇰🇷" },
          TW: { name: "Taiwan", flag: "🇹🇼" },
          TH: { name: "Thailand", flag: "🇹🇭" },
          VN: { name: "Vietnam", flag: "🇻🇳" },
          PH: { name: "Philippines", flag: "🇵🇭" },
          MY: { name: "Malaysia", flag: "🇲🇾" },
          ID: { name: "Indonesia", flag: "🇮🇩" },
          NL: { name: "Netherlands", flag: "🇳🇱" },
          SE: { name: "Sweden", flag: "🇸🇪" },
          CH: { name: "Switzerland", flag: "🇨🇭" },
          IT: { name: "Italy", flag: "🇮🇹" },
          ES: { name: "Spain", flag: "🇪🇸" },
          TR: { name: "Turkey", flag: "🇹🇷" },
          KZ: { name: "Kazakhstan", flag: "🇰🇿" },
          UA: { name: "Ukraine", flag: "🇺🇦" },
          PL: { name: "Poland", flag: "🇵🇱" },
          TN: { name: "Tunisia", flag: "🇹🇳" },
        }

        const parsedServers: Server[] = serversToUse.map((server: any) => {
          const country = countryMap[server.countryCode] || { name: server.countryCode, flag: "🌍" }
          const load = Math.min(100, Math.max(0, Math.floor((server.users / 100) * 10)))
          const ping = Math.max(5, Math.floor(100 - server.speed / 100000))

          return {
            id: server.id,
            name: `${country.name} - ${server.ip.split(".").slice(0, 2).join(".")}`,
            country: country.name,
            flag: country.flag,
            load,
            users: server.users,
            ping,
            ip: server.ip,
            port: server.port,
            protocol: server.protocol,
          }
        })

        setServers(parsedServers)
        if (parsedServers.length > 0) {
          setSelectedServerId(parsedServers[0].id)
        }

        console.log(`[v0] Loaded ${parsedServers.length} servers`)
      } catch (error) {
        console.error("[v0] Error fetching servers:", error)
        const fallbackServers: Server[] = [
          {
            id: "1",
            name: "Japan - Tokyo",
            country: "Japan",
            flag: "🇯🇵",
            load: 35,
            users: 4567,
            ping: 8,
            ip: "203.0.113.1",
            port: 1194,
            protocol: "tcp",
          },
          {
            id: "2",
            name: "China - Beijing",
            country: "China",
            flag: "🇨🇳",
            load: 42,
            users: 5234,
            ping: 12,
            ip: "203.0.113.2",
            port: 1194,
            protocol: "tcp",
          },
          {
            id: "3",
            name: "USA - New York",
            country: "USA",
            flag: "🇺🇸",
            load: 45,
            users: 1234,
            ping: 12,
            ip: "203.0.113.3",
            port: 1194,
            protocol: "tcp",
          },
          {
            id: "4",
            name: "Singapore",
            country: "Singapore",
            flag: "🇸🇬",
            load: 38,
            users: 2345,
            ping: 10,
            ip: "203.0.113.4",
            port: 1194,
            protocol: "tcp",
          },
          {
            id: "5",
            name: "Hong Kong",
            country: "Hong Kong",
            flag: "🇭🇰",
            load: 40,
            users: 3456,
            ping: 11,
            ip: "203.0.113.5",
            port: 1194,
            protocol: "tcp",
          },
        ]
        setServers(fallbackServers)
        setSelectedServerId("1")
      } finally {
        setLoading(false)
      }
    }

    fetchServers()
  }, [])

  const selectedServer = servers.find((s) => s.id === selectedServerId) || servers[0]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border p-6 flex flex-col">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-accent">QuickFox VPN</h1>
            <p className="text-xs text-muted-foreground mt-1">Fast & Secure</p>
          </div>

          <nav className="space-y-2 flex-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "dashboard" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-secondary"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("servers")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "servers" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-secondary"
              }`}
            >
              Servers
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "settings" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-secondary"
              }`}
            >
              Settings
            </button>
          </nav>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">v1.0.0</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {loading && activeTab === "servers" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading servers...</p>
              </div>
            </div>
          )}
          {!loading && activeTab === "dashboard" && selectedServer && <VPNDashboard selectedServer={selectedServer} />}
          {!loading && activeTab === "servers" && (
            <ServerList selectedServerId={selectedServerId} onSelectServer={setSelectedServerId} servers={servers} />
          )}
          {activeTab === "settings" && <SettingsPanel />}
        </div>
      </div>
    </main>
  )
}
