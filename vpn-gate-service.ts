"use client"

interface VPNGateServer {
  ip: string
  port: number
  protocol: string
  country: string
  countryCode: string
  users: number
  uptime: number
  speed: number
  logType: string
  operator: string
  message: string
  openVpnConfigData: string
}

const VPNGATE_API = "http://www.vpngate.net/api/iphone/"

export async function fetchVPNGateServers(): Promise<VPNGateServer[]> {
  try {
    const response = await fetch(VPNGATE_API)
    const text = await response.text()

    // Parse CSV response
    const lines = text.split("\n")
    const servers: VPNGateServer[] = []

    // Skip header lines
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const parts = line.split(",")
      if (parts.length < 15) continue

      try {
        servers.push({
          ip: parts[0],
          port: Number.parseInt(parts[1]),
          protocol: parts[2],
          country: parts[5],
          countryCode: parts[6],
          users: Number.parseInt(parts[7]) || 0,
          uptime: Number.parseInt(parts[8]) || 0,
          speed: Number.parseInt(parts[9]) || 0,
          logType: parts[10],
          operator: parts[11],
          message: parts[12],
          openVpnConfigData: parts[14] || "",
        })
      } catch (e) {
        continue
      }
    }

    return servers.sort((a, b) => b.speed - a.speed).slice(0, 50)
  } catch (error) {
    console.error("Error fetching VPN Gate servers:", error)
    return []
  }
}

export function getCountryName(countryCode: string): string {
  const countryNames: Record<string, string> = {
    JP: "Japan",
    US: "United States",
    CN: "China",
    IN: "India",
    BR: "Brazil",
    RU: "Russia",
    DE: "Germany",
    FR: "France",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    SG: "Singapore",
    HK: "Hong Kong",
    KR: "South Korea",
    TW: "Taiwan",
    TH: "Thailand",
    VN: "Vietnam",
    PH: "Philippines",
    MY: "Malaysia",
    ID: "Indonesia",
  }
  return countryNames[countryCode] || countryCode
}
