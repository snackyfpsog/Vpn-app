import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const connectionId = request.nextUrl.searchParams.get("connectionId")

    if (!connectionId) {
      return NextResponse.json({ error: "Connection ID is required" }, { status: 400 })
    }

    console.log("[v0] Checking status for:", connectionId)

    // Simulate real-time status updates
    const status = {
      connectionId,
      status: "connected",
      uptime: Math.floor(Math.random() * 3600),
      downloadSpeed: Math.floor(Math.random() * 100) + 50,
      uploadSpeed: Math.floor(Math.random() * 50) + 20,
      ping: Math.floor(Math.random() * 50) + 10,
      dataUsed: Math.floor(Math.random() * 1000) + 100,
      timestamp: new Date(),
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error("[v0] Status check error:", error)
    return NextResponse.json({ error: "Failed to get VPN status" }, { status: 500 })
  }
}
