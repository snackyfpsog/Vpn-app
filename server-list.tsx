"use client"

import { useState } from "react"
import { MapPin, Zap, Users, Search, Filter } from "lucide-react"
import type { Server } from "@/app/page"

interface ServerListProps {
  selectedServerId: string
  onSelectServer: (serverId: string) => void
  servers: Server[]
}

export function ServerList({ selectedServerId, onSelectServer, servers }: ServerListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"load" | "ping" | "users">("load")

  const getLoadColor = (load: number) => {
    if (load < 40) return "text-green-400"
    if (load < 70) return "text-yellow-400"
    return "text-red-400"
  }

  const filteredServers = servers
    .filter(
      (server) =>
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.country.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "load") return a.load - b.load
      if (sortBy === "ping") return a.ping - b.ping
      return b.users - a.users
    })

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Select Server</h2>
        <p className="text-muted-foreground mt-2">Choose from {servers.length} available servers</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search servers by name or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "load" | "ping" | "users")}
            className="bg-card border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent transition-colors"
          >
            <option value="load">Sort by Load</option>
            <option value="ping">Sort by Ping</option>
            <option value="users">Sort by Users</option>
          </select>
        </div>
      </div>

      {/* Server Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServers.length > 0 ? (
          filteredServers.map((server) => (
            <button
              key={server.id}
              onClick={() => onSelectServer(server.id)}
              className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
                selectedServerId === server.id
                  ? "bg-accent/10 border-accent shadow-lg"
                  : "bg-card border-border hover:border-accent/50"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{server.flag}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{server.name}</h3>
                    <p className="text-sm text-muted-foreground">{server.country}</p>
                  </div>
                </div>
                {selectedServerId === server.id && (
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-accent-foreground" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${getLoadColor(server.load)}`} />
                  <div>
                    <p className="text-muted-foreground text-xs">Load</p>
                    <span className="text-foreground font-semibold">{server.load}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-muted-foreground text-xs">Users</p>
                    <span className="text-foreground font-semibold">{server.users}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-muted-foreground text-xs">Ping</p>
                    <span className="text-foreground font-semibold">{server.ping}ms</span>
                  </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No servers found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
