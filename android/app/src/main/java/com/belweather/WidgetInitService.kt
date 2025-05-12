package com.belweather

import android.app.Notification
import android.app.Service
import android.content.Intent
import android.os.IBinder
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class WidgetInitService : HeadlessJsTaskService() {

    companion object {
        const val WIDGET_INIT_TASK_NAME = "widget-init"
    }

    override fun onBind(intent: Intent): IBinder? = null

    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig {
        return HeadlessJsTaskConfig(
            WIDGET_INIT_TASK_NAME,
            Arguments.createMap(),
            15000,
            true
        )
    }
}