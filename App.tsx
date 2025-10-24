"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  NativeModules,
  Platform,
} from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

const { VPNModule } = NativeModules
const Tab = createBottomTabNavigator()

interface Server {
  id: string
  country: string
  ip: string
  port: number
  protocol: string
  load: number
  users: number
  ping: number
}

const DashboardScreen = ({ selectedServer, isConnected, onConnect, onDisconnect, loading }) => {
  const [vpnStatus, setVpnStatus] = useState({
    connected: false,
    ip: "0.0.0.0",
    server: "Not connected",
  })

  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (Platform.OS === "android" && VPNModule) {
          const status = await VPNModule.getVPNStatus()
          setVpnStatus(status)
        }
      } catch (error) {
        console.error("Error checking VPN status:", error)
      }
    }

    const interval = setInterval(checkStatus, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Connection Status</Text>
        <View style={[styles.statusIndicator, { backgroundColor: vpnStatus.connected ? "#10b981" : "#ef4444" }]} />
        <Text style={styles.statusText}>{vpnStatus.connected ? "Connected" : "Disconnected"}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>VPN IP:</Text>
          <Text style={styles.infoValue}>{vpnStatus.ip}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Server:</Text>
          <Text style={styles.infoValue}>{vpnStatus.server}</Text>
        </View>
      </View>

      {selectedServer && (
        <View style={styles.serverCard}>
          <Text style={styles.serverTitle}>{selectedServer.country}</Text>
          <View style={styles.serverDetails}>
            <Text style={styles.serverDetail}>IP: {selectedServer.ip}</Text>
            <Text style={styles.serverDetail}>Port: {selectedServer.port}</Text>
            <Text style={styles.serverDetail}>Load: {selectedServer.load}%</Text>
            <Text style={styles.serverDetail}>Ping: {selectedServer.ping}ms</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, vpnStatus.connected ? styles.buttonDisconnect : styles.buttonConnect]}
        onPress={vpnStatus.connected ? onDisconnect : onConnect}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{vpnStatus.connected ? "Disconnect" : "Connect"}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const ServersScreen = ({ servers, selectedServer, onSelectServer, loading }) => {
  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
      ) : (
        servers.map((server) => (
          <TouchableOpacity
            key={server.id}
            style={[styles.serverItem, selectedServer?.id === server.id && styles.serverItemSelected]}
            onPress={() => onSelectServer(server)}
          >
            <View style={styles.serverItemContent}>
              <Text style={styles.serverItemCountry}>{server.country}</Text>
              <Text style={styles.serverItemIP}>
                {server.ip}:{server.port}
              </Text>
              <View style={styles.serverItemStats}>
                <Text style={styles.serverItemStat}>Load: {server.load}%</Text>
                <Text style={styles.serverItemStat}>Users: {server.users}</Text>
                <Text style={styles.serverItemStat}>Ping: {server.ping}ms</Text>
              </View>
            </View>
            {selectedServer?.id === server.id && <Icon name="check-circle" size={24} color="#3b82f6" />}
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  )
}

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    autoConnect: false,
    protocol: "udp",
    encryption: "aes-256",
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem("vpn_settings")
      if (saved) {
        setSettings(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem("vpn_settings", JSON.stringify(settings))
      Alert.alert("Success", "Settings saved")
    } catch (error) {
      Alert.alert("Error", "Failed to save settings")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.settingCard}>
        <Text style={styles.settingLabel}>Protocol</Text>
        <View style={styles.settingOptions}>
          {["udp", "tcp"].map((proto) => (
            <TouchableOpacity
              key={proto}
              style={[styles.settingOption, settings.protocol === proto && styles.settingOptionSelected]}
              onPress={() => setSettings({ ...settings, protocol: proto })}
            >
              <Text style={styles.settingOptionText}>{proto.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.settingCard}>
        <Text style={styles.settingLabel}>Encryption</Text>
        <View style={styles.settingOptions}>
          {["aes-128", "aes-256"].map((enc) => (
            <TouchableOpacity
              key={enc}
              style={[styles.settingOption, settings.encryption === enc && styles.settingOptionSelected]}
              onPress={() => setSettings({ ...settings, encryption: enc })}
            >
              <Text style={styles.settingOptionText}>{enc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default function App() {
  const [servers, setServers] = useState<Server[]>([])
  const [selectedServer, setSelectedServer] = useState<Server | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchServers()
  }, [])

  const fetchServers = async () => {
    setLoading(true)
    try {
      // Fetch from VPN Gate API
      const response = await axios.get("http://www.vpngate.net/api/iphone/")
      const lines = response.data.split("\n")

      const parsedServers: Server[] = []
      for (let i = 2; i < Math.min(lines.length, 32); i++) {
        const parts = lines[i].split(",")
        if (parts.length > 14) {
          parsedServers.push({
            id: `server_${i}`,
            country: parts[0] || "Unknown",
            ip: parts[1] || "0.0.0.0",
            port: Number.parseInt(parts[2]) || 1194,
            protocol: parts[3] || "udp",
            load: Number.parseInt(parts[4]) || 0,
            users: Number.parseInt(parts[5]) || 0,
            ping: Number.parseInt(parts[6]) || 0,
          })
        }
      }

      setServers(parsedServers.slice(0, 30))
      if (parsedServers.length > 0) {
        setSelectedServer(parsedServers[0])
      }
    } catch (error) {
      console.error("Error fetching servers:", error)
      Alert.alert("Error", "Failed to fetch VPN servers")
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    if (!selectedServer) {
      Alert.alert("Error", "Please select a server first")
      return
    }

    setLoading(true)
    try {
      if (Platform.OS === "android" && VPNModule) {
        await VPNModule.startVPN(selectedServer.ip, selectedServer.port, selectedServer.protocol)
        setIsConnected(true)
        Alert.alert("Success", `Connected to ${selectedServer.country}`)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect to VPN")
      console.error("Connection error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setLoading(true)
    try {
      if (Platform.OS === "android" && VPNModule) {
        await VPNModule.stopVPN()
        setIsConnected(false)
        Alert.alert("Success", "Disconnected from VPN")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to disconnect from VPN")
      console.error("Disconnection error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName
            if (route.name === "Dashboard") {
              iconName = focused ? "shield-check" : "shield-outline"
            } else if (route.name === "Servers") {
              iconName = focused ? "server-network" : "server-network-outline"
            } else if (route.name === "Settings") {
              iconName = focused ? "cog" : "cog-outline"
            }
            return <Icon name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: "#3b82f6",
          tabBarInactiveTintColor: "#9ca3af",
          headerStyle: { backgroundColor: "#1f2937" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          options={{ title: "VPN Gate" }}
          children={() => (
            <DashboardScreen
              selectedServer={selectedServer}
              isConnected={isConnected}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              loading={loading}
            />
          )}
        />
        <Tab.Screen
          name="Servers"
          options={{ title: "Servers" }}
          children={() => (
            <ServersScreen
              servers={servers}
              selectedServer={selectedServer}
              onSelectServer={setSelectedServer}
              loading={loading}
            />
          )}
        />
        <Tab.Screen name="Settings" options={{ title: "Settings" }} component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },
  statusCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  statusLabel: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    color: "#94a3b8",
    fontSize: 14,
  },
  infoValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  serverCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  serverTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  serverDetails: {
    gap: 8,
  },
  serverDetail: {
    color: "#cbd5e1",
    fontSize: 13,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonConnect: {
    backgroundColor: "#3b82f6",
  },
  buttonDisconnect: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 40,
  },
  serverItem: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serverItemSelected: {
    backgroundColor: "#3b82f6",
    borderWidth: 2,
    borderColor: "#60a5fa",
  },
  serverItemContent: {
    flex: 1,
  },
  serverItemCountry: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  serverItemIP: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 6,
  },
  serverItemStats: {
    flexDirection: "row",
    gap: 12,
  },
  serverItemStat: {
    color: "#cbd5e1",
    fontSize: 11,
  },
  settingCard: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  settingLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
  },
  settingOptions: {
    flexDirection: "row",
    gap: 8,
  },
  settingOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#0f172a",
    alignItems: "center",
  },
  settingOptionSelected: {
    backgroundColor: "#3b82f6",
  },
  settingOptionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})
