package com.vpngate

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.Socket

class VPNService : VpnService() {
    
    companion object {
        var isConnected = false
        var currentIP = ""
        var currentServer = ""
        private const val CHANNEL_ID = "vpn_service"
        private const val NOTIFICATION_ID = 1
    }
    
    private var vpnThread: Thread? = null
    private var vpnInterface: ParcelFileDescriptor? = null
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val serverIp = intent?.getStringExtra("server_ip") ?: return START_STICKY
        val serverPort = intent.getIntExtra("server_port", 1194)
        val protocol = intent.getStringExtra("protocol") ?: "udp"
        
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, createNotification())
        
        vpnThread = Thread {
            connectToVPN(serverIp, serverPort, protocol)
        }
        vpnThread?.start()
        
        return START_STICKY
    }
    
    private fun connectToVPN(serverIp: String, serverPort: Int, protocol: String) {
        try {
            currentServer = serverIp
            isConnected = true
            
            // Simulate VPN connection
            Thread.sleep(2000)
            currentIP = generateFakeIP()
            
            // Keep connection alive
            while (isConnected) {
                Thread.sleep(1000)
            }
        } catch (e: Exception) {
            isConnected = false
        }
    }
    
    private fun generateFakeIP(): String {
        return "10.${(1..254).random()}.${(1..254).random()}.${(1..254).random()}"
    }
    
    override fun onDestroy() {
        super.onDestroy()
        isConnected = false
        vpnThread?.interrupt()
        vpnInterface?.close()
    }
    
    override fun onBind(intent: Intent?): IBinder? = null
    
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "VPN Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }
    
    private fun createNotification(): Notification {
        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("VPN Gate")
            .setContentText("VPN connection active")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(pendingIntent)
            .build()
    }
}
