package com.belweather

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.widget.RemoteViews
import android.widget.Toast
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.JavaScriptExecutor
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.Locale

enum class WeatherId {
    thunderstorm,
    drizzle,
    rain,
    snow,
    mist,
    smoke,
    haze,
    dust,
    fog,
    sand,
    ash,
    squall,
    tornado,
    clearDay,
    clearNight,
    cloudsDay,
    cloudsNight
}

class WeatherModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val NAME = "WeatherModule"

    override fun getName() = NAME

    private fun getWeatherIcon(state: Int, time: Long): Int? {
        return when (state) {
            WeatherId.thunderstorm.ordinal -> R.drawable.weather_state_thunderstorm
            //WeatherId.drizzle.ordinal -> R.drawable.
            WeatherId.rain.ordinal -> R.drawable.weather_state_rain
            WeatherId.snow.ordinal -> R.drawable.weather_state_snow
            //WeatherId.mist.ordinal -> R.drawable.
            //WeatherId.smoke.ordinal -> R.drawable.
            WeatherId.haze.ordinal -> R.drawable.weather_state_haze
            WeatherId.dust.ordinal -> R.drawable.weather_state_dust
            WeatherId.fog.ordinal -> R.drawable.weather_state_fog
            //WeatherId.sand.ordinal -> R.drawable.
            //WeatherId.ash.ordinal -> R.drawable.
            WeatherId.squall.ordinal -> R.drawable.weather_state_squall
            WeatherId.tornado.ordinal -> R.drawable.weather_state_tornado
            WeatherId.clearDay.ordinal -> R.drawable.weather_state_clearday
            WeatherId.clearNight.ordinal -> R.drawable.weather_state_clearnight
            WeatherId.cloudsDay.ordinal -> R.drawable.weather_state_cloudyday
            WeatherId.cloudsNight.ordinal -> R.drawable.weather_state_cloudynight
            else -> null
        }
    }

    @ReactMethod
    fun setForecastOnWidget(forecast: ReadableMap) {
        val name = forecast.getString("name")
        val state = forecast.getDouble("state").toInt()
        val currentTemp = forecast.getDouble("currentTemp")
        val minTemp = forecast.getDouble("minTemp")
        val maxTemp = forecast.getDouble("maxTemp")
        val time = forecast.getDouble("time").toLong()

        val context = reactApplicationContext.applicationContext

        val appWidgetManager = AppWidgetManager.getInstance(context)
        val ids = appWidgetManager.getAppWidgetIds(
            ComponentName(context, WeatherClassicWidget::class.java)
        )

        ids.forEach { id ->
            val views = RemoteViews(context.packageName, R.layout.weather_classic_widget).apply {
                setTextViewText(
                    R.id.current_temp_text,
                    String.format(Locale.getDefault(), "%.1f°", currentTemp)
                )
                setTextViewText(
                    R.id.max_min_temp_text,
                    String.format(Locale.getDefault(), "%.1f°/%.1f°", maxTemp, minTemp)
                )

                val drawableId = getWeatherIcon(state, time)
                setImageViewResource(
                    R.id.weather_icon,
                    drawableId ?: R.drawable.widget_default_icon
                )
            }
            appWidgetManager.partiallyUpdateAppWidget(id, views)
        }
    }

    @ReactMethod
    fun resetWidget() {
        val context = reactApplicationContext.applicationContext

        val appWidgetManager = AppWidgetManager.getInstance(context)
        val ids = appWidgetManager.getAppWidgetIds(
            ComponentName(context, WeatherClassicWidget::class.java)
        )

        ids.forEach { id ->
            val views = RemoteViews(context.packageName, R.layout.weather_classic_widget).apply {
                setTextViewText(
                    R.id.current_temp_text,
                    context.resources.getString(R.string.widget_default_current_weather)
                )
                setTextViewText(
                    R.id.max_min_temp_text,
                    context.resources.getString(R.string.widget_default_max_min_weather)
                )
                setImageViewResource(
                    R.id.weather_icon,
                    R.drawable.widget_default_icon
                )
            }

            appWidgetManager.updateAppWidget(id, views)
        }
    }
}