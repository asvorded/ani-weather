package com.belweather

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.widget.RemoteViews
import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import java.util.Locale

class WeatherModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val NAME = "WeatherModule";

    override fun getName() = NAME

    @ReactMethod
    fun setForecastOnWidget(forecast: ReadableMap) {
        val name = forecast.getString("name")
        val state = forecast.getDouble("state").toInt()
        val currentTemp = forecast.getDouble("currentTemp")
        val minTemp = forecast.getDouble("minTemp")
        val maxTemp = forecast.getDouble("maxTemp")

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
                // TODO: set image from state
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