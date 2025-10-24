package com.vpngate

import android.content.Context
import android.content.Intent
import android.net.VpnService
import android.os.Build
import com.facebook.react.bridge.*
import java.io.File

class VPNModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    override fun getName() = "VPNModule"
    
    @ReactMethod
    fun startVPN(serverIp: String, serverPort: Int, protocol: String, promise: Promise) {
        try {
            val context = reactApplicationContext
            val intent = Intent(context, VPNService::class.java).apply {
                putExtra("server_ip", serverIp)
                putExtra("server_port", serverPort)
                putExtra("protocol", protocol)
            }
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
            
            promise.resolve("VPN connection started")
        } catch (e: Exception) {
            promise.reject("VPN_ERROR", e.message)
        }
    }
    
    @ReactMethod
    fun stopVPN(promise: Promise) {
        try {
            val context = reactApplicationContext
            val intent = Intent(context, VPNService::class.java)
            context.stopService(intent)
            promise.resolve("VPN connection stopped")
        } catch (e: Exception) {
            promise.reject("VPN_ERROR", e.message)
        }
    }
    
    @ReactMethod
    fun getVPNStatus(promise: Promise) {
        try {
            val isConnected = VPNService.isConnected
            val currentIP = VPNService.currentIP
            val currentServer = VPNService.currentServer
            
            val status = Arguments.createMap().apply {
                putBoolean("connected", isConnected)
                putString("ip", currentIP)
                putString("server", currentServer)
            }
            
            promise.resolve(status)
        } catch (e: Exception) {
            promise.reject("VPN_ERROR", e.message)
        }
    }
}
