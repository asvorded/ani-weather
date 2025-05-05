package com.belweather

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.AlarmClock
import android.widget.RemoteViews
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Implementation of App Widget functionality.
 */
class WeatherClassicWidget : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        appWidgetIds.forEach { appWidgetId ->
            val weatherPendingIntent = PendingIntent.getActivity(
                context, 0,
                Intent(context, MainActivity::class.java),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            val timePendingIntent = PendingIntent.getActivity(
                context, 1,
                Intent(AlarmClock.ACTION_SHOW_ALARMS),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            val calendarPendingIntent = PendingIntent.getActivity(
                context, 2,
                Intent(Intent.ACTION_VIEW).apply {
                    data = Uri.parse("content://com.android.calendar/time")
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                },
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val views = RemoteViews(context.packageName, R.layout.weather_classic_widget).apply {
                    setOnClickPendingIntent(R.id.weather_view, weatherPendingIntent)
                    setOnClickPendingIntent(R.id.time_text, timePendingIntent)
                    setOnClickPendingIntent(R.id.date_text, calendarPendingIntent)

                    setWidgetDateAndTime()
                }

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}

internal fun RemoteViews.setWidgetDateAndTime() {
    val currentDate = Date()
    val time = SimpleDateFormat("HH:mm", Locale.getDefault()).format(currentDate)
    val date = SimpleDateFormat("EE, d MMMM", Locale.getDefault()).format(currentDate)

    this.setTextViewText(R.id.time_text, time)
    this.setTextViewText(R.id.date_text, date)
}