package com.belweather

import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WeatherModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val NAME = "WeatherModule";

    override fun getName() = NAME

    @ReactMethod
    fun showTestToast() {
        val text = "Hello toast!"
        val duration = Toast.LENGTH_SHORT

        val toast = Toast.makeText(reactApplicationContext, text, duration)
        toast.show()
    }
}